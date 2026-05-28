import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import {
  message,
  Input,
  Button,
  Upload,
  Image,
  Spin,
  Select,
  Card,
  Tooltip,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState([]);
  const [editedCategory, setEditedCategory] = useState({
    title: "",
    icon: { url: "", public_id: "" },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [iconFile, setIconFile] = useState({});
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [file, setFileList] = useState([]);
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCategories(), fetchBrandsAndFilters()]);
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories.");
    }
  };

  const fetchBrandsAndFilters = async () => {
    try {
      const [brandRes, filterRes] = await Promise.all([
        axios.get("/brand"),
        axios.get("/filter"),
      ]);
      setBrands(brandRes.data);
      setFilters(filterRes.data);
    } catch (error) {
      console.error("Error fetching brands or filters:", error);
      message.error("Failed to load brands and filters.");
    }
  };

  const getUsedFilterIDs = () => {
    const usedIDs = new Set();
    categories.forEach((category) => {
      category.filterIDs.forEach((filter) => usedIDs.add(filter._id));
    });
    return usedIDs;
  };

  const handleSubmit = async (method, url, data) => {
    try {
      await axios[method](url, data, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      await fetchCategories();
      message.success(
        `${
          method === "post" ? "Category added" : "Category updated"
        } successfully!`
      );
      resetForm();
    } catch (error) {
      console.error(
        `Error ${method === "post" ? "adding" : "updating"} category:`,
        error
      );
      message.error(
        `Failed to ${method === "post" ? "add" : "update"} category.`
      );
    }
  };

  const handleAddCategory = () => {
    if (!editedCategory.icon.url) {
      message.error("Please upload an icon before adding the category.");
      return;
    }

    handleSubmit("post", "/category", {
      title: editedCategory.title,
      icon: editedCategory.icon,
      brandIDs: selectedBrands,
      filterIDs: selectedFilters,
    });
  };

  const handleUpdateCategory = () => {
    if (!editedCategory.icon.url) {
      message.error("Please upload an icon before updating the category.");
      return;
    }

    const filterIDs = selectedFilters
      .map((filterTitle) => {
        const filter = filters.find((filter) => filter.title === filterTitle);
        return filter ? filter._id : null;
      })
      .filter((id) => id !== null);

    const brandIDs = selectedBrands;

    handleSubmit("put", `/category/${currentCategoryId}`, {
      title: editedCategory.title,
      icon: editedCategory.icon,
      brandIDs: brandIDs,
      filterIDs: filterIDs,
    });
  };

  const handleEditCategory = (category) => {
    setIconFile({
      uid: Date.now(),
      name: category.title,
      status: "done",
      url: category.icon[0].url,
      public_id: category.icon[0].public_id,
    });
    setEditedCategory({
      title: category.title,
      icon: {
        url: category.icon[0].url,
        public_id: category.icon[0].public_id,
      },
    });

    const selectedFilterIDs = category.filterIDs.map((filter) => filter._id);
    const selectedFilterTitles = filters
      .filter((filter) => selectedFilterIDs.includes(filter._id))
      .map((filter) => filter.title);

    setSelectedFilters(selectedFilterTitles);
    setSelectedBrands(category.brandIDs.map((brand) => brand._id));
    setIsEditing(true);
    setCurrentCategoryId(category._id);
  };

  const handleDeleteCategory = async (id, publicId) => {
    setLoadingDelete(id);
    try {
      if (publicId) await handleRemoveImage(publicId);
      await axios.delete(`/category/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setCategories((prev) => prev.filter((category) => category._id !== id));
      message.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category.");
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleUploadIcon = async (file) => {
    const formData = new FormData();
    formData.append("images", file);
    setLoadingIcon(true);
    try {
      if (iconFile.public_id) {
        await handleRemoveImage(iconFile.public_id);
      }
      const { data } = await axios.put("/category/upload-icon", formData, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const { url, public_id } = data[0];
      setEditedCategory((prev) => ({ ...prev, icon: { url, public_id } }));
      setIconFile({
        uid: Date.now(),
        name: file.name,
        status: "done",
        url,
        public_id,
      });
      message.success("Icon uploaded successfully!");
    } catch (error) {
      console.error("Error uploading icon:", error);
      message.error("Failed to upload icon.");
    } finally {
      setLoadingIcon(false);
    }
    return false;
  };

  const handleRemoveImage = async (publicId) => {
    try {
      await axios.delete(`product/delete-img/${publicId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setIconFile({});
      message.success("Image removed successfully!");
    } catch (error) {
      console.error("Error removing image:", error);
      message.error("Failed to remove image.");
    }
  };

  const resetForm = () => {
    setEditedCategory({ title: "", icon: { url: "", public_id: "" } });
    setIconFile({});
    setIsEditing(false);
    setCurrentCategoryId(null);
    setSelectedBrands([]);
    setSelectedFilters([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Quản Lý Danh Mục Sản Phẩm
        </h1>

        {/* Form thêm/sửa danh mục */}
        <Card className="mb-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Danh Mục
              </label>
              <Input
                placeholder="Nhập tên danh mục"
                value={editedCategory.title}
                onChange={(e) =>
                  setEditedCategory({
                    ...editedCategory,
                    title: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thương Hiệu
              </label>
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Chọn thương hiệu"
                onChange={setSelectedBrands}
                value={selectedBrands}
              >
                {brands.map((brand) => (
                  <Option key={brand._id} value={brand._id}>
                    {brand.title}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bộ Lọc
              </label>
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Chọn bộ lọc"
                onChange={setSelectedFilters}
                value={selectedFilters}
              >
                {filters
                  .filter((filter) => !getUsedFilterIDs().has(filter._id))
                  .map((filter) => (
                    <Option key={filter._id} value={filter.title}>
                      {filter.title}
                    </Option>
                  ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon Danh Mục
              </label>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={({ file }) => handleUploadIcon(file)}
                beforeUpload={() => {
                  if (!iconFile.url) return true;
                  message.warning(
                    "Vui lòng xóa icon hiện tại trước khi tải lên icon mới"
                  );
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} className="w-full">
                  Tải Lên Icon
                </Button>
              </Upload>

              {loadingIcon && <Spin className="mt-2" />}

              {iconFile.url && (
                <div className="mt-4 flex items-center gap-4">
                  <Image
                    src={iconFile.url}
                    alt="Icon"
                    preview={false}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <Button
                    danger
                    onClick={() => handleRemoveImage(iconFile.public_id)}
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {isEditing && (
              <Button onClick={resetForm} className="mr-2">
                Hủy
              </Button>
            )}
            <Button
              type="primary"
              onClick={isEditing ? handleUpdateCategory : handleAddCategory}
            >
              {isEditing ? "Cập Nhật" : "Thêm Mới"}
            </Button>
          </div>
        </Card>

        {/* Danh sách danh mục */}
        <Card className="shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Danh Sách Danh Mục</h2>

          {categories.length === 0 ? (
            <Empty description="Chưa có danh mục nào" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={category.icon[0].url}
                      alt={category.title}
                      preview={false}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{category.title}</h3>
                      <p className="text-sm text-gray-500">
                        {category.brandIDs.length} thương hiệu
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Tooltip title="Chỉnh sửa">
                      <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleEditCategory(category)}
                      />
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Popconfirm
                        title="Bạn có chắc muốn xóa danh mục này?"
                        onConfirm={() =>
                          handleDeleteCategory(
                            category._id,
                            category.icon[0].public_id
                          )
                        }
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          loading={loadingDelete === category._id}
                        />
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ManageCategory;
