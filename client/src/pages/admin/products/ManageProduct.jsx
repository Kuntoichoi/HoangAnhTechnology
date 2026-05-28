import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../../utils/axiosConfig";
import {
  Button,
  Input,
  Select,
  Spin,
  Card,
  Tooltip,
  Empty,
  Image,
  Tag,
  Popconfirm,
  Pagination,
  message,
  Space,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ADMIN_URL } from "../../../constants/adminConstants";

const { Option } = Select;

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deletingProducts, setDeletingProducts] = useState(new Set());

  const token = localStorage.getItem("adminToken");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });

      if (searchTerm) {
        queryParams.append("keyword", searchTerm);
      }
      if (selectedBrand) {
        queryParams.append("brandID", selectedBrand);
      }
      if (selectedCategory) {
        queryParams.append("categoryID", selectedCategory);
      }

      const { data } = await axios.get(
        `product/admin?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Không th tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      message.error("Vui lòng đăng nhập");
      navigate("/admin-hac/admin-login");
      return;
    }
    fetchProducts();
  }, [currentPage, searchTerm, selectedBrand, selectedCategory]);

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get("brand"),
          axios.get("category"),
        ]);
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching brands and categories:", error);
        message.error("Failed to fetch brands or categories.");
      }
    };
    fetchBrandsAndCategories();
  }, []);

  const handleProductClick = (productSlug) => {
    navigate(`/${ADMIN_URL}/manage-product/product/${productSlug}`);
  };

  const handleDeleteProduct = async (productId) => {
    setDeletingProducts((prev) => new Set([...prev, productId]));

    try {
      const product = products.find((product) => product._id === productId);

      if (product?.images?.length > 0) {
        await Promise.all(
          product.images.map((image) =>
            axios.delete(`product/delete-img/${image.public_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
      }

      await axios.delete(`product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product._id !== productId));
      message.success("Xóa Sản Phẩm Thành Công");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setTempSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/${ADMIN_URL}/manage-product/add-product`)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thêm Sản Phẩm
          </Button>
        </div>

        <Card className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex gap-2 col-span-2">
              <Input
                placeholder="Tìm theo ID hoặc tên sản phẩm"
                prefix={<SearchOutlined className="text-gray-400" />}
                value={tempSearchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                allowClear
              />
              <Button
                type="primary"
                onClick={handleSearch}
                icon={<SearchOutlined />}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Tìm
              </Button>
            </div>

            <Select
              placeholder="Chọn Thương Hiệu"
              onChange={handleBrandChange}
              allowClear
              className="w-full"
              value={selectedBrand}
            >
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.title}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Chọn Danh Mục"
              allowClear
              onChange={handleCategoryChange}
              className="w-full"
              value={selectedCategory}
            >
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.title}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} sản phẩm`
              }
              className="text-sm"
            />
          </div>
        </Card>

        <Card className="shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spin size="large" tip="Đang tải sản phẩm..." />
            </div>
          ) : products.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm nào" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`p-3 border rounded-lg hover:shadow-md transition-all duration-300 bg-white relative ${
                    product.isDisabled ? "opacity-50" : ""
                  }`}
                >
                  {deletingProducts.has(product._id) && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center z-10">
                      <div className="bg-white p-2 rounded-lg shadow-md">
                        <Spin size="small" />
                        <span className="ml-2 text-sm">Đang xóa...</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      {product.images.length ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover rounded"
                          preview={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium mb-1 truncate">
                        {product.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-gray-500">
                          ID: {product.productID}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Tooltip title="Xem chi tiết">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            navigate(
                              `/${ADMIN_URL}/manage-product/product/view/${product.slug}`
                            )
                          }
                          className="flex items-center text-gray-500 hover:text-gray-600"
                          disabled={deletingProducts.has(product._id)}
                        />
                      </Tooltip>

                      <Tooltip title="Chỉnh sửa">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleProductClick(product.slug)}
                          className="flex items-center text-blue-500 hover:text-blue-600"
                          disabled={deletingProducts.has(product._id)}
                        />
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <Popconfirm
                          title="Bạn có chắc muốn xóa sản phẩm này?"
                          description="Hành động này không thể hoàn tác"
                          onConfirm={() => handleDeleteProduct(product._id)}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{
                            danger: true,
                            loading: deletingProducts.has(product._id),
                          }}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            className="flex items-center text-red-500 hover:text-red-600"
                            disabled={deletingProducts.has(product._id)}
                          />
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                total={totalProducts}
                pageSize={itemsPerPage}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} sản phẩm`
                }
                className="text-sm"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ManageProduct;
