import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Upload,
  message,
  Spin,
  Image,
  Checkbox,
  Card,
  Divider,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import axios from "../../../utils/axiosConfig";
import AddProductInput from "../../../components/admin/forms/AddProductInput";
import { useNavigate } from "react-router-dom";
import { ADMIN_URL } from "../../../constants/adminConstants";
import CustomTextArea from "../../../components/admin/forms/CustomTextArea";
import UploadExcel from "../../../components/admin/shared/UploadExcel";

const { Option } = Select;

const { Dragger } = Upload;

function AddProduct() {
  const [product, setProduct] = useState({
    productID: "",
    title: "",
    description: "",
    prices: "",
    quantity: 0,
    images: [],
    categoryID: "",
    brandID: "",
    seriesID: "",
    relatedProducts: [],
    matchingProducts: [],
    optionIDs: [],
    specifications: [
      {
        topic: "",
        details: [
          {
            title: "",
            description: "",
          },
        ],
      },
    ],
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [series, setSeries] = useState({ data: [] });
  const [fileList, setFileList] = useState([]);
  const [filters, setFilters] = useState([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [priceAvailable, setPriceAvailable] = useState("true");

  const [inputProductID, setInputProductID] = useState("");

  const handleAddRelatedProduct = (productID) => {
    const trimmedProductID = productID.trim(); // Loại bỏ khoảng trắng

    if (!productID.trim() || product.relatedProducts.includes(trimmedProductID))
      return message.error("Đã có mã này");
    setProduct((prev) => ({
      ...prev,
      relatedProducts: [...prev.relatedProducts, trimmedProductID], // Thêm sản phẩm vào danh sách
    }));
    setInputProductID(""); // Reset input
  };

  const handleRemoveRelatedProduct = (productID) => {
    setProduct((prev) => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter((id) => id !== productID), // Loại bỏ sản phẩm khỏi danh sách
    }));
  };

  const handleAddMatchingProduct = (productID) => {
    const trimmedProductID = productID.trim(); // Loại bỏ khoảng trắng

    if (
      !productID.trim() ||
      product.matchingProducts.includes(trimmedProductID)
    )
      return message.error("Đã có mã này");
    setProduct((prev) => ({
      ...prev,
      matchingProducts: [...prev.matchingProducts, trimmedProductID], // Thêm sản phẩm vào danh sách
    }));
    setInputProductID(""); // Reset input
  };

  const handleRemoveMatchingProduct = (productID) => {
    setProduct((prev) => ({
      ...prev,
      matchingProducts: prev.matchingProducts.filter((id) => id !== productID), // Loại bỏ sản phẩm khỏi danh sách
    }));
  };

  const selectedCategoryID = product.categoryID;
  const selectedBrandID = product.brandID;

  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const categoriesResponse = await axios.get("category");
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Không thể tải dữ liệu từ server.");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedCategoryID.length > 0) {
          const brandResponse = await axios.get(
            `brand?categoryIDs=${selectedCategoryID}`
          );
          setBrands(brandResponse.data);
        }

        if (selectedCategoryID.length > 0 && selectedBrandID.length > 0) {
          const seriesResponse = await axios.get(
            `series?categoryID=${selectedCategoryID}&brandID=${selectedBrandID}`
          );
          setSeries(seriesResponse.data);
        }

        if (selectedCategoryID.length > 0) {
          const selectedCategory = categories.find(
            (category) => category._id === selectedCategoryID
          );

          if (selectedCategory) {
            const filters = selectedCategory.filterIDs.map((filter) => ({
              id: filter._id,
              title: filter.title,
              options: [],
            }));

            const url = `option?${filters
              .map((filter) => `filterID=${filter.id}`)
              .join("&")}`;

            const optionResponse = await axios.get(url);
            const fetchedOptions = optionResponse.data;
            const updatedFilters = filters.map((filter) => {
              const optionsForFilter = fetchedOptions.filter(
                (option) => option.filterID === filter.id
              );

              return {
                ...filter,
                options: optionsForFilter,
              };
            });

            setFilters(updatedFilters);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Không thể tải dữ liệu từ server.");
      }
    };

    if (selectedCategoryID.length > 0) {
      fetchData();
    }
  }, [selectedCategoryID, selectedBrandID, categories]);

  const validateForm = () => {
    const requiredFields = [
      "title",
      "productID",
      "categoryID",
      "prices",
      "quantity",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !product[field]);

    if (
      product.specifications.some(
        (spec) =>
          spec.details.length === 0 ||
          spec.details.some((detail) => !detail.title || !detail.description)
      )
    ) {
      message.error("Vui lòng điền đầy đủ thông số kỹ thuật.");
      return false;
    }

    if (missingFields.length > 0) {
      message.error(`Vui lòng điền đầy đủ: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoadingSubmit(true);

    const uploadedImages = [];
    try {
      // Upload tất cả ảnh
      for (const file of fileList) {
        if (file.status === "pending") {
          const formData = new FormData();
          formData.append("images", file.file);
          const token = localStorage.getItem("adminToken");
          const response = await axios.put("product/upload", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { url, public_id } = response.data[0];
          uploadedImages.push({ url, public_id });
        } else {
          uploadedImages.push({ url: file.url, public_id: file.public_id });
        }
      }

      const priceToSubmit = product.prices ? product.prices : "Liên hệ";
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Bạn chưa đăng nhập hoặc token không tồn tại.");
      }

      // Tạo sản phẩm
      const response = await axios.post(
        "product",
        {
          ...product,
          seriesID: product.seriesID || undefined,
          prices: priceToSubmit,
          images: uploadedImages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        message.success("Sản phẩm đã được lưu thành công!");
        setProduct({
          productID: "",
          title: "",
          description: "",
          prices: "",
          quantity: 0,
          images: [],
          categoryID: "",
          brandID: "",
          seriesID: "",
          filterIDs: [],
          relatedProducts: [],
          specifications: [
            { topic: "", details: [{ title: "", description: "" }] },
          ],
        });

        setFileList([]);
        localStorage.removeItem("productData");
        localStorage.removeItem("fileList");
      }
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      message.error("Có lỗi xảy ra khi lưu sản phẩm.");

      // Xóa từng ảnh đã upload nếu có lỗi
      if (uploadedImages.length > 0) {
        try {
          const token = localStorage.getItem("adminToken");
          await Promise.all(
            uploadedImages.map((img) =>
              axios.delete(`product/delete-img/${img.public_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            )
          );
        } catch (deleteError) {
          console.error("Lỗi khi xóa ảnh:", deleteError);
        }
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Image
  const handleImageUpload = (file) => {
    const newImage = {
      uid: Date.now(),
      name: file.name,
      status: "pending",
      url: URL.createObjectURL(file),
      file: file,
    };
    setFileList((prevFileList) => [...prevFileList, newImage]);
    return false;
  };

  const handleRemoveImage = (uid) => {
    setFileList((prevFileList) =>
      prevFileList.filter((file) => file.uid !== uid)
    );
  };

  //Handle Change

  const handleSelectChange = (field, value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
      ...(field === "categoryID" && { optionIDs: [] }),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const [specifications, setSpecifications] = useState([]);

  const handleSpecificationChange = (specIndex, e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => {
      const newSpecs = [...prevProduct.specifications];
      newSpecs[specIndex][name] = value;
      return { ...prevProduct, specifications: newSpecs };
    });
  };

  const handleDetailChange = (specIndex, detailIndex, field, value) => {
    setProduct((prevProduct) => {
      const newSpecs = [...prevProduct.specifications];
      newSpecs[specIndex].details[detailIndex][field] = value;
      return { ...prevProduct, specifications: newSpecs };
    });
  };

  const handleAddDetail = (specIndex) => {
    setProduct((prevProduct) => {
      const newSpecs = [...prevProduct.specifications];
      newSpecs[specIndex].details.push({ title: "", description: "" });
      return { ...prevProduct, specifications: newSpecs };
    });
  };

  const handleRemoveDetail = (specIndex, detailIndex) => {
    setProduct((prevProduct) => {
      const newSpecs = [...prevProduct.specifications];
      newSpecs[specIndex].details = newSpecs[specIndex].details.filter(
        (_, idx) => idx !== detailIndex
      );
      return { ...prevProduct, specifications: newSpecs };
    });
  };

  const handleAddSpecification = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      specifications: [
        ...prevProduct.specifications,
        {
          topic: "",
          details: [{ title: "", description: "" }],
        },
      ],
    }));
  };

  const handleRemoveSpecification = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      specifications: prevProduct.specifications.filter(
        (_, idx) => idx !== index
      ),
    }));
  };

  const handleFilterSelected = (optionID) => {
    setProduct((prevProduct) => {
      const { optionIDs } = prevProduct;

      const newOptionIDs = optionIDs.includes(optionID)
        ? optionIDs.filter((id) => id !== optionID)
        : [...optionIDs, optionID];

      return {
        ...prevProduct,
        optionIDs: newOptionIDs,
      };
    });
  };

  const navigateBack = () => {
    navigate(`/${ADMIN_URL}/manage-product`);
  };

  const props = {
    beforeUpload: handleImageUpload,
    showUploadList: false,
    accept: "image/*",
    className: "mb-4",
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={navigateBack}
              type="text"
              className="hover:bg-gray-100"
            >
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold m-0">Thêm Sản Phẩm Mới</h1>
          </div>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loadingSubmit}
            className="bg-blue-500"
          >
            Lưu Sản Phẩm
          </Button>
        </div>
      </Card>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2">
          <Card title="Thông Tin Cơ Bản" className="mb-6">
            <div className="space-y-4">
              <AddProductInput
                label="Tên Sản Phẩm"
                name="title"
                type="text"
                placeholder="Nhập Tên Sản Phẩm"
                value={product.title}
                onChange={handleInputChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <AddProductInput
                  label="Mã Sản Phẩm"
                  name="productID"
                  type="text"
                  placeholder="Nhập Mã Sản Phẩm"
                  value={product.productID}
                  onChange={handleInputChange}
                  required
                />
                <AddProductInput
                  label="Số Lượng"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AddProductInput
                  label="Giá Sản Phẩm"
                  name="prices"
                  type="text"
                  placeholder="Nhập Giá Sản Phẩm"
                  value={product.prices}
                  onChange={handleInputChange}
                  disabled={priceAvailable === "false"}
                />
              </div>
            </div>
          </Card>

          {/* Description & Specifications */}
          <Card title="Mô Tả & Thông Số Kỹ Thuật" className="mb-6">
            <CustomTextArea
              label="Mô Tả"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả sản phẩm..."
              className="mb-4"
            />

            <Divider />

            <div className="specifications-section">
              <h3 className="font-medium mb-4">Thông Số Kỹ Thuật</h3>

              <UploadExcel setProduct={setProduct} />

              {product.specifications.map((spec, specIndex) => (
                <div key={specIndex} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="topic"
                      value={spec.topic}
                      onChange={(e) => handleSpecificationChange(specIndex, e)}
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
                          icon={<MinusOutlined />}
                          onClick={() =>
                            handleRemoveDetail(specIndex, detailIndex)
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
                      onClick={() => handleRemoveSpecification(specIndex)}
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
        </div>

        {/* Right Column - Categories & Images */}
        <div className="lg:col-span-1">
          <Card title="Hình Ảnh Sản Phẩm" className="mb-6">
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
              className="mb-4"
            >
              <Button icon={<PlusOutlined />} block>
                Tải Hình Ảnh Lên
              </Button>
            </Upload>

            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>

            <div className="grid grid-cols-2 gap-2">
              {fileList.map((file) => (
                <div key={file.uid} className="relative group">
                  <Image
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    danger
                    icon={<MinusOutlined />}
                    onClick={() => handleRemoveImage(file.uid)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Phân Loại">
            <Tabs
              defaultActiveKey="categories"
              items={[
                {
                  label: "Danh mục",
                  key: "categories",
                  children: (
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium">
                          Danh Mục:
                        </label>
                        <Select
                          onChange={(value) =>
                            handleSelectChange("categoryID", value)
                          }
                          placeholder="Chọn Danh Mục"
                          className="w-full"
                        >
                          {categories.map((category) => (
                            <Option key={category._id} value={category._id}>
                              {category.title}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium">
                          Thương Hiệu:
                        </label>
                        <Select
                          onChange={(value) =>
                            handleSelectChange("brandID", value)
                          }
                          placeholder="Chọn Thương Hiệu"
                          className="w-full"
                        >
                          {brands.map((brand) => (
                            <Option key={brand._id} value={brand._id}>
                              {brand.title}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium">
                          Dòng Sản Phẩm:
                        </label>
                        <Select
                          onChange={(value) =>
                            handleSelectChange("seriesID", value)
                          }
                          placeholder="Chọn Dòng Sản Phẩm"
                          className="w-full"
                          showSearch
                          allowClear
                        >
                          {(series?.data || []).map((serie, index) => (
                            <Option key={index} value={serie._id}>
                              {serie.title}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  ),
                },
                {
                  label: "Bộ lọc",
                  key: "filters",
                  children: filters.map((filter) => (
                    <div key={filter.id} className="mb-4">
                      <label className="block mb-2 font-medium">
                        {filter.title}:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {filter.options.map((option) => (
                          <Checkbox
                            key={option._id}
                            checked={product.optionIDs.includes(option._id)}
                            onChange={() => handleFilterSelected(option._id)}
                            className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
                          >
                            {option.title}
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  )),
                },
                {
                  label: "Sản phẩm liên quan",
                  key: "relatedProduct",
                  children: (
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium">
                          Nhập Product ID:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nhập Product ID"
                            value={inputProductID}
                            onChange={(e) => setInputProductID(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                          />
                          <button
                            onClick={() =>
                              handleAddRelatedProduct(inputProductID)
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">
                          Danh sách sản phẩm liên quan:
                        </h3>
                        <ul className="space-y-2">
                          {product.relatedProducts.map((productID) => (
                            <li
                              key={productID}
                              className="border rounded px-3 py-2 flex justify-between items-center"
                            >
                              <span>{productID}</span>
                              <button
                                onClick={() =>
                                  handleRemoveRelatedProduct(productID)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Xóa
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                },
                {
                  label: "Sản phẩm phù hợp",
                  key: "matchingProducts",
                  children: (
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium">
                          Nhập Product ID:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nhập Product ID"
                            value={inputProductID}
                            onChange={(e) => setInputProductID(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                          />
                          <button
                            onClick={() =>
                              handleAddMatchingProduct(inputProductID)
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">
                          Danh sách sản phẩm phù hợp:
                        </h3>
                        <ul className="space-y-2">
                          {product.matchingProducts.map((productID) => (
                            <li
                              key={productID}
                              className="border rounded px-3 py-2 flex justify-between items-center"
                            >
                              <span>{productID}</span>
                              <button
                                onClick={() =>
                                  handleRemoveMatchingProduct(productID)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Xóa
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
