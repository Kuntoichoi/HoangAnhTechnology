import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchData } from "../../../hooks/useFetchData";
import axios from "../../../utils/axiosConfig";
import {
  message,
  Input,
  Button,
  Select,
  Upload,
  Form,
  Row,
  Col,
  Spin,
  Checkbox,
  Tabs,
  Card,
  Divider,
  Modal,
} from "antd";
import {
  MinusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useImageHandler } from "../../../hooks/useImageHandler";
import { ADMIN_URL } from "../../../constants/adminConstants";
import CustomTextArea from "../../../components/admin/forms/CustomTextArea";
import UploadExcel from "../../../components/admin/shared/UploadExcel";

function EditProduct() {
  const { productSlug } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [seriesParams, setSeriesParams] = useState({
    categoryID: null,
    brandID: null,
  });

  const {
    fileList,
    isLoading: imageLoading,
    handleAddToFileList,
    handleRemoveFromFileList,
    handleRemoveFromServer,
    uploadImagesToServer,
  } = useImageHandler();

  // Fetch product data
  const {
    data: product,
    loading: productLoading,
    refetch: refetchProduct,
    setData: setProduct,
  } = useFetchData(`/product/admin/${productSlug}`, [productSlug]);

  // Fetch categories
  const { data: categories = [], loading: categoriesLoading } =
    useFetchData("/category");

  // Fetch brands based on selected category
  const { data: brands = [], loading: brandsLoading } = useFetchData(
    product?.categoryID?._id
      ? `brand?categoryIDs=${product.categoryID._id}`
      : null,
    [product?.categoryID?._id]
  );

  // Fetch series based on selected category and brand
  const {
    data: seriesResponse = null,
    loading: seriesLoading,
    refetch: refetchSeries,
  } = useFetchData(
    seriesParams.categoryID && seriesParams.brandID
      ? `series?categoryID=${seriesParams.categoryID}&brandID=${seriesParams.brandID}`
      : null,
    [seriesParams.categoryID, seriesParams.brandID]
  );

  // Thêm state để lưu trữ filters và options
  const [cachedFilters, setCachedFilters] = useState([]);

  // Chỉ fetch filters khi ở tab filters và chưa có cached data
  const { data: filters = [], setData: setFilters } = useFetchData(
    activeTab === "filters" &&
      product?.categoryID?._id &&
      cachedFilters.length === 0
      ? `filter?categoryID=${product.categoryID._id}`
      : null,
    [activeTab, product?.categoryID?._id]
  );

  // Cập nhật cachedFilters khi có filters mới
  useEffect(() => {
    if (filters?.length > 0) {
      setCachedFilters(filters);
    }
  }, [filters]);

  // Fetch options khi có filters và lưu vào cache
  useEffect(() => {
    const fetchOptions = async () => {
      if (
        !cachedFilters?.length ||
        cachedFilters.some((filter) => filter.options)
      )
        return;

      try {
        const url = `option?${cachedFilters
          .map((filter) => `filterID=${filter._id}`)
          .join("&")}`;
        const { data: optionsData } = await axios.get(url);
        const updatedFilters = cachedFilters.map((filter) => ({
          ...filter,
          options: optionsData.filter(
            (option) => option.filterID === filter._id
          ),
        }));

        setCachedFilters(updatedFilters);
        setFilters(updatedFilters);
      } catch (error) {
        console.error("Lỗi khi tải options:", error);
        message.error("Không thể tải options");
      }
    };

    fetchOptions();
  }, [cachedFilters]);

  useEffect(() => {
    // Reset series khi thay đổi category hoặc brand
    setProduct((prev) => ({
      ...prev,
      seriesID: null, // Xóa series đã chọn trước đó
    }));

    // Cập nhật params để fetch series mới
    if (product?.categoryID?._id && product?.brandID?._id) {
      setSeriesParams({
        categoryID: product.categoryID._id,
        brandID: product.brandID._id,
      });
    }
  }, [product?.categoryID?._id, product?.brandID?._id]);

  // Save changes
  const handleSaveAll = async () => {
    if (!isEditing) {
      message.info("Không có thay đổi");
      return;
    }

    try {
      // Upload new images if any
      const newImages = await uploadImagesToServer();

      const updatedProduct = {
        ...product,
        images: [...product.images, ...newImages],
      };

      await axios.put(`/product/${product._id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setProduct(updatedProduct);
      setIsEditing(false);
      message.success("Lưu thành công!");
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Lỗi khi lưu thay đổi!");
    }
  };

  const handleFilterSelected = (optionId) => {
    setProduct((prev) => {
      const currentOptions = prev.optionIDs || [];
      const isSelected = currentOptions.some(
        (option) => option._id === optionId
      );

      const newOptions = isSelected
        ? currentOptions.filter((option) => option._id !== optionId)
        : [...currentOptions, { _id: optionId }];

      return {
        ...prev,
        optionIDs: newOptions,
      };
    });
    setIsEditing(true);
  };

  // Specification handling
  const handleSpecificationChange = (specIndex, e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex][name] = value;
      return { ...prev, specifications: newSpecs };
    });
    setIsEditing(true);
  };

  const handleDetailChange = (specIndex, detailIndex, field, value) => {
    setProduct((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex].details[detailIndex][field] = value;
      return { ...prev, specifications: newSpecs };
    });
    setIsEditing(true);
  };

  const handleAddDetail = (specIndex) => {
    setProduct((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex].details.push({ title: "", description: "" });
      return { ...prev, specifications: newSpecs };
    });
    setIsEditing(true);
  };

  const handleRemoveDetail = (specIndex, detailIndex) => {
    setProduct((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex].details = newSpecs[specIndex].details.filter(
        (_, idx) => idx !== detailIndex
      );
      return { ...prev, specifications: newSpecs };
    });
    setIsEditing(true);
  };

  const handleAddSpecification = () => {
    setProduct((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        {
          topic: "",
          details: [{ title: "", description: "" }],
        },
      ],
    }));
    setIsEditing(true);
  };

  const handleRemoveSpecification = (index) => {
    setProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index),
    }));
    setIsEditing(true);
  };

  // Thay thế nhiều state loading riêng lẻ bằng một object
  const [loadingStates, setLoadingStates] = useState({
    page: false,
    image: false,
    save: false,
  });

  // Helper function để update loading state
  const setLoading = (key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  // Kiểm tra tất cả các trạng thái loading
  const isPageLoading =
    productLoading ||
    categoriesLoading ||
    brandsLoading ||
    seriesLoading ||
    imageLoading;

  // Thêm hàm xử lý xóa ảnh trong EditProduct
  const handleImageRemove = async (publicId) => {
    console.log(publicId);

    const deletedId = await handleRemoveFromServer(publicId);
    if (deletedId) {
      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.public_id !== publicId),
      }));
      setIsEditing(true);
    }
  };

  const navigate = useNavigate();

  const handleCategoryChange = (value) => {
    Modal.confirm({
      title: "Xác nhận thay đổi danh mục",
      content:
        "Khi thay đổi danh mục, tất cả bộ lọc đã chọn sẽ bị xóa. Bạn có chắc chắn muốn thay đổi?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        handleValueChange("categoryID", value);
        setCachedFilters([]); // Reset cached filters
        setProduct((prev) => ({
          ...prev,
          optionIDs: [], // Reset selected options
        }));
        setIsEditing(true);
      },
    });
  };

  const handleValueChange = (field, value) => {
    setProduct((prev) => {
      let updatedProduct = {
        ...prev,
        [field]: value,
      };

      // Nếu thay đổi category, reset brand và series
      if (field === "categoryID") {
        updatedProduct.brandID = null;
        updatedProduct.seriesID = null;
      }

      // Nếu thay đổi brand, reset series
      if (field === "brandID") {
        updatedProduct.seriesID = null;
      }

      return updatedProduct;
    });
    setIsEditing(true);
  };

  const [inputRelatedProductID, setInputRelatedProductID] = useState("");

  // Thêm state để lưu trữ sản phẩm liên quan
  const handleAddRelatedProduct = (productID) => {
    if (!productID.trim() || product.relatedProducts.includes(productID))
      return message.error("Đã có mã này");

    // Cập nhật sản phẩm liên quan
    setProduct((prev) => ({
      ...prev,
      relatedProducts: [...prev.relatedProducts, productID], // Thêm sản phẩm vào danh sách
    }));

    // Lưu sản phẩm ngay lập tức

    setIsEditing(true); // Đảm bảo nút lưu hoạt động

    setInputRelatedProductID(""); // Reset input
  };

  const handleRemoveRelatedProduct = (productID) => {
    setProduct((prev) => {
      const updatedRelatedProducts = prev.relatedProducts.filter(
        (id) => id !== productID
      ); // Loại bỏ sản phẩm khỏi danh sách
      return {
        ...prev,
        relatedProducts: updatedRelatedProducts,
      };
    });
    setIsEditing(true); // Đảm bảo nút lưu hoạt động

    // Lưu sản phẩm ngay lập tức
  };

  const [inputMatchingProductID, setInputMatchingProductID] = useState("");

  // Thêm state để lưu trữ sản phẩm khớp
  const handleAddMatchingProduct = (productID) => {
    if (!productID.trim() || product.matchingProducts.includes(productID))
      return message.error("Đã có mã này");

    // Cập nhật sản phẩm khớp
    setProduct((prev) => ({
      ...prev,
      matchingProducts: [...prev.matchingProducts, productID], // Thêm sản phẩm vào danh sách
    }));

    // Lưu sản phẩm ngay lập tức

    setIsEditing(true); // Đảm bảo nút lưu hoạt động

    setInputMatchingProductID(""); // Reset input
  };

  const handleRemoveMatchingProduct = (productID) => {
    setProduct((prev) => {
      const updatedMatchingProducts = prev.matchingProducts.filter(
        (id) => id !== productID
      ); // Loại bỏ sản phẩm khỏi danh sách
      return {
        ...prev,
        matchingProducts: updatedMatchingProducts,
      };
    });
    setIsEditing(true); // Đảm bảo nút lưu hoạt động

    // Lưu sản phẩm ngay lập tức
  };

  return (
    <Spin spinning={isPageLoading} tip="Đang tải...">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <Card className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/${ADMIN_URL}/manage-product`)}
                type="text"
                className="hover:bg-gray-100"
              >
                Quay lại
              </Button>
              <h1 className="text-2xl font-bold m-0">Chỉnh sửa sản phẩm</h1>
            </div>
            <Button
              type="primary"
              onClick={handleSaveAll}
              disabled={!isEditing}
              className="bg-blue-500"
            >
              Lưu thay đổi
            </Button>
          </div>
        </Card>

        {!product ? (
          <div className="text-center">Không tìm thấy sản phẩm</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  {
                    key: "basic",
                    label: "Thông tin cơ bản",
                    children: (
                      <>
                        {" "}
                        <Card title="Thông Tin Cơ Bản" className="mb-6">
                          <div className="space-y-4">
                            <Form.Item label="Tên Sản Phẩm">
                              <Input
                                value={product?.title}
                                onChange={(e) =>
                                  handleValueChange("title", e.target.value)
                                }
                                placeholder="Nhập Tên Sản Phẩm"
                              />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                              <Form.Item label="Mã Sản Phẩm">
                                <Input
                                  value={product.productID}
                                  onChange={(e) =>
                                    handleValueChange(
                                      "productID",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Nhập Mã Sản Phẩm"
                                />
                              </Form.Item>
                              <Form.Item label="Số Lượng">
                                <Input
                                  type="number"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    handleValueChange(
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                />
                              </Form.Item>
                            </div>

                            <Form.Item label="Giá Sản Phẩm">
                              <Input
                                value={product.prices}
                                onChange={(e) =>
                                  handleValueChange("prices", e.target.value)
                                }
                                placeholder="Nhập Giá Sản Phẩm"
                              />
                            </Form.Item>
                          </div>
                        </Card>{" "}
                        <Card
                          title="Mô Tả & Thông Số Kỹ Thuật"
                          className="mb-6"
                        >
                          <CustomTextArea
                            label="Mô Tả"
                            name="description"
                            value={product.description}
                            onChange={(e) =>
                              handleValueChange("description", e.target.value)
                            }
                            placeholder="Nhập mô tả sản phẩm..."
                            className="mb-4"
                          />

                          <Divider />

                          <div className="specifications-section">
                            <h3 className="font-medium mb-4">
                              Thông Số Kỹ Thuật
                            </h3>

                            <UploadExcel setProduct={setProduct} />

                            {product?.specifications?.map((spec, specIndex) => (
                              <div
                                key={specIndex}
                                className="bg-gray-50 p-4 rounded-lg mb-4"
                              >
                                <div className="mb-4">
                                  <input
                                    type="text"
                                    name="topic"
                                    value={spec.topic}
                                    onChange={(e) =>
                                      handleSpecificationChange(specIndex, e)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Chủ đề (không bắt buộc)"
                                  />
                                </div>

                                {spec.details.map((detail, detailIndex) => (
                                  <div
                                    key={detailIndex}
                                    className="grid grid-cols-2 gap-4 mb-2"
                                  >
                                    <input
                                      type="text"
                                      value={detail.title}
                                      onChange={(e) =>
                                        handleDetailChange(
                                          specIndex,
                                          detailIndex,
                                          "title",
                                          e.target.value
                                        )
                                      }
                                      className="w-full p-2 border border-gray-300 rounded"
                                      placeholder="Tiêu đề"
                                    />
                                    <div className="flex gap-2">
                                      <textarea
                                        value={detail.description}
                                        onChange={(e) =>
                                          handleDetailChange(
                                            specIndex,
                                            detailIndex,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded resize-y min-h-[40px]"
                                        placeholder="Mô tả"
                                      />
                                      <Button
                                        danger
                                        icon={<MinusCircleOutlined />}
                                        onClick={() =>
                                          handleRemoveDetail(
                                            specIndex,
                                            detailIndex
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}

                                <div className="flex justify-between mt-2">
                                  <Button
                                    type="dashed"
                                    onClick={() => handleAddDetail(specIndex)}
                                    icon={<PlusOutlined />}
                                  >
                                    Thêm Chi Tiết
                                  </Button>
                                  <Button
                                    danger
                                    onClick={() =>
                                      handleRemoveSpecification(specIndex)
                                    }
                                    icon={<MinusOutlined />}
                                  >
                                    Xóa Mục
                                  </Button>
                                </div>
                              </div>
                            ))}

                            <Button
                              type="dashed"
                              icon={<PlusOutlined />}
                              onClick={handleAddSpecification}
                              className="w-full"
                            >
                              Thêm Mục Thông Số
                            </Button>
                          </div>
                        </Card>
                      </>
                    ),
                  },
                  {
                    key: "filters",
                    label: "Bộ lọc",
                    children: (
                      <Card>
                        {cachedFilters?.map((filter) => (
                          <div key={filter._id} className="mb-4">
                            <label className="block mb-2 font-medium">
                              {filter.title}:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {filter.options?.map((option) => (
                                <Checkbox
                                  key={option._id}
                                  checked={product?.optionIDs?.some(
                                    (optionId) => optionId._id === option._id
                                  )}
                                  onChange={() =>
                                    handleFilterSelected(option._id)
                                  }
                                  className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
                                >
                                  {option.title}
                                </Checkbox>
                              ))}
                            </div>
                          </div>
                        ))}
                      </Card>
                    ),
                  },
                ]}
              />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="pb-6 font-semibold"> {product?.title}</div>

              <Card title="Hình Ảnh Sản Phẩm" className="mb-6">
                <Spin spinning={imageLoading} tip="Đang xử lý...">
                  <div className="grid grid-cols-2 gap-2">
                    {product?.images?.map((img) => (
                      <div key={img.public_id} className="relative group">
                        <img
                          src={img.url}
                          alt="product"
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          danger
                          icon={<MinusOutlined />}
                          onClick={() => handleImageRemove(img.public_id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}

                    {fileList.map((file) => (
                      <div key={file.uid} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          danger
                          icon={<MinusOutlined />}
                          onClick={() => handleRemoveFromFileList(file)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>

                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setIsEditing(true);
                      return handleAddToFileList(file);
                    }}
                    accept="image/*"
                    disabled={imageLoading}
                    className="mt-4"
                  >
                    <Button icon={<PlusCircleOutlined />} block>
                      Tải lên hình ảnh
                    </Button>
                  </Upload>
                </Spin>
              </Card>

              <Card title="Phân Loại" className="mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium">Danh Mục:</label>
                    <Select
                      value={product?.categoryID?._id}
                      onChange={handleCategoryChange}
                      options={categories?.map((category) => ({
                        value: category._id,
                        label: category.title,
                      }))}
                      placeholder="Chọn danh mục"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Thương Hiệu:
                    </label>
                    <Select
                      value={product?.brandID?._id}
                      onChange={(value) => handleValueChange("brandID", value)}
                      options={brands?.map((brand) => ({
                        value: brand._id,
                        label: brand.title,
                      }))}
                      placeholder="Chọn thương hiệu"
                      className="w-full"
                      disabled={!product?.categoryID}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Dòng Sản Phẩm:
                    </label>
                    <Select
                      value={product?.seriesID?._id}
                      onChange={(value) => handleValueChange("seriesID", value)}
                      options={(seriesResponse?.data || [])?.map((serie) => ({
                        value: serie._id,
                        label: serie.title,
                      }))}
                      placeholder="Chọn dòng sản phẩm"
                      className="w-full"
                      disabled={
                        !product?.categoryID ||
                        !product?.brandID ||
                        seriesLoading
                      }
                      loading={seriesLoading}
                    />
                  </div>
                </div>
              </Card>

              {/* Related Products Section */}
              <Card title="Sản Phẩm Liên Quan" className="mb-6">
                <div>
                  <label className="block mb-2 font-medium">
                    Nhập Product ID:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập Product ID"
                      value={inputRelatedProductID}
                      onChange={(e) => setInputRelatedProductID(e.target.value)}
                      className="border rounded px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() =>
                        handleAddRelatedProduct(inputRelatedProductID)
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">
                    Danh sách sản phẩm liên quan:
                  </h3>
                  <ul className="space-y-2">
                    {Array.isArray(product.relatedProducts) &&
                      product.relatedProducts.map((productID) => (
                        <li
                          key={productID}
                          className="border rounded px-3 py-2 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition duration-200"
                        >
                          <span className="text-gray-800">{productID}</span>
                          <button
                            onClick={() =>
                              handleRemoveRelatedProduct(productID)
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                          >
                            Xóa
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>

              {/* Matching Products Section */}
              <Card title="Sản Phẩm Phù Hợp" className="mb-6">
                <div>
                  <label className="block mb-2 font-medium">
                    Nhập Product ID:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập Product ID"
                      value={inputMatchingProductID}
                      onChange={(e) =>
                        setInputMatchingProductID(e.target.value)
                      }
                      className="border rounded px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() =>
                        handleAddMatchingProduct(inputMatchingProductID)
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">
                    Danh sách sản phẩm phù hợp:
                  </h3>
                  <ul className="space-y-2">
                    {Array.isArray(product.matchingProducts) &&
                      product.matchingProducts.map((productID) => (
                        <li
                          key={productID}
                          className="border rounded px-3 py-2 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition duration-200"
                        >
                          <span className="text-gray-800">{productID}</span>
                          <button
                            onClick={() =>
                              handleRemoveMatchingProduct(productID)
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                          >
                            Xóa
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
}

export default EditProduct;
