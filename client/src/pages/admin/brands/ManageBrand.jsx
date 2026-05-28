import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import {
  message,
  Input,
  Button,
  Upload,
  Image,
  Spin,
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

function ManageBrand() {
  const [brands, setBrands] = useState([]);
  const [editedBrand, setEditedBrand] = useState({
    title: "",
    logo: {
      url: "",
      public_id: "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [logoFile, setLogoFile] = useState({});
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingRemoveImage, setLoadingRemoveImage] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/brand", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setBrands(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thương hiệu:", error);
      message.error("Có lỗi xảy ra khi lấy danh sách thương hiệu.");
    }
  };

  const handleAddBrand = async () => {
    console.log(editedBrand);
    try {
      const response = await axios.post("/brand", editedBrand, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });
      message.success("Thêm Thương Hiệu Thành Công");
      fetchBrands();
      setEditedBrand({ title: "", logo: { url: "", public_id: "" } });
      setLogoFile({});
    } catch (error) {
      console.error("Lỗi Khi Thêm Thương Hiệu:", error);
      message.error("Lỗi khi thêm thương hiệu");
    }
  };

  const handleEditBrand = (brand) => {
    setLogoFile({
      uid: Date.now(),
      name: brand.title,
      status: "done",
      url: brand.logo.url,
      public_id: brand.logo.public_id,
    });
    setEditedBrand({
      title: brand.title,
      logo: { url: brand.logo.url, public_id: brand.logo.public_id },
    });
    setIsEditing(true);
    setCurrentBrandId(brand._id);
  };

  const handleUpdateBrand = async () => {
    try {
      const response = await axios.put(
        `/brand/${currentBrandId}`,
        editedBrand,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      message.success("Thương hiệu đã được cập nhật thành công!");
      fetchBrands();
      setIsEditing(false);
      setEditedBrand({ title: "", logo: { url: "", public_id: "" } });
      setLogoFile({});
    } catch (error) {
      console.error("Lỗi khi cập nhật thương hiệu:", error);
      message.error("Có lỗi xảy ra khi cập nhật thương hiệu.");
    }
  };
  const [loadingDelete, setLoadingDelete] = useState(null); // Lưu trữ ID của thương hiệu đang xóa

  const handleDeleteBrand = async (id, publicId) => {
    setLoadingDelete(id); // Bắt đầu tải xóa cho thương hiệu với ID này
    try {
      // Xóa hình ảnh trước khi xóa thương hiệu
      if (publicId) {
        await handleRemoveImage(publicId);
      }

      // Xóa thương hiệu sau khi xóa hình ảnh
      await axios.delete(`/brand/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      setBrands((prev) => prev.filter((brand) => brand._id !== id));
      message.success("Thương hiệu và hình ảnh đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu và hình ảnh:", error);
      message.error("Có lỗi xảy ra khi xóa thương hiệu và hình ảnh.");
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleUploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("images", file);
    setLoadingLogo(true);
    try {
      const response = await axios.put("/brand/upload-logo", formData, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const { url, public_id } = response.data[0];
      setEditedBrand((prev) => ({
        ...prev,
        logo: { url: url, public_id: public_id },
      }));
      setLogoFile({
        uid: Date.now(),
        name: file.name,
        status: "done",
        url: url,
        public_id: public_id,
      });
      message.success("Logo đã được tải lên thành công!");
      setLoadingLogo(false);
    } catch (error) {
      console.error("Lỗi khi tải lên logo:", error);
      message.error("Có lỗi xảy ra khi tải lên logo.");
    }
    return false;
  };

  const handleRemoveImage = async (publicId) => {
    setLoadingRemoveImage(true);
    try {
      await axios.delete(`product/delete-img/${publicId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setLogoFile({});
      message.success("Hình ảnh đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hình ảnh:", error);
      message.error("Có lỗi xảy ra khi xóa hình ảnh.");
    } finally {
      setLoadingRemoveImage(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản Lý Thương Hiệu
          </h1>
        </div>

        {/* Form thêm/sửa thương hiệu */}
        <Card className="mb-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? "Chỉnh Sửa Thương Hiệu" : "Thêm Thương Hiệu Mới"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Thương Hiệu
              </label>
              <Input
                placeholder="Nhập tên thương hiệu"
                value={editedBrand.title}
                onChange={(e) =>
                  setEditedBrand({ ...editedBrand, title: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Thương Hiệu
              </label>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={({ file }) => handleUploadLogo(file)}
                beforeUpload={() => {
                  if (!logoFile.url) return true;
                  message.warning(
                    "Vui lòng xóa logo hiện tại trước khi tải lên logo mới"
                  );
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} className="w-full">
                  Tải Lên Logo
                </Button>
              </Upload>

              {loadingLogo && <Spin className="mt-2" />}

              {logoFile.url && (
                <div className="mt-4 flex items-center gap-4">
                  <Image
                    src={logoFile.url}
                    alt="Logo"
                    preview={false}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveImage(logoFile.public_id)}
                    loading={loadingRemoveImage}
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {isEditing && (
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditedBrand({
                    title: "",
                    logo: { url: "", public_id: "" },
                  });
                  setLogoFile({});
                }}
                className="mr-2"
              >
                Hủy
              </Button>
            )}
            <Button
              type="primary"
              onClick={isEditing ? handleUpdateBrand : handleAddBrand}
            >
              {isEditing ? "Cập Nhật" : "Thêm Mới"}
            </Button>
          </div>
        </Card>

        {/* Danh sách thương hiệu */}
        <Card className="shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Danh Sách Thương Hiệu</h2>

          {brands.length === 0 ? (
            <Empty description="Chưa có thương hiệu nào" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {brand.logo && brand.logo.url ? (
                      <Image
                        src={brand.logo.url}
                        alt={brand.title}
                        preview={false}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">No logo</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{brand.title}</h3>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Tooltip title="Chỉnh sửa">
                      <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleEditBrand(brand)}
                      />
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Popconfirm
                        title="Bạn có chắc muốn xóa thương hiệu này?"
                        onConfirm={() =>
                          handleDeleteBrand(brand._id, brand.logo?.public_id)
                        }
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          loading={loadingDelete === brand._id}
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

export default ManageBrand;
