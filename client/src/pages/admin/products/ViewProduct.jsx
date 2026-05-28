import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/helpers";
import {
  Button,
  Card,
  Tabs,
  Spin,
  Divider,
  Popconfirm,
  message,
  Switch,
} from "antd";
import {
  EditOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ADMIN_URL } from "../../../constants/adminConstants";
import { useFetchData } from "../../../hooks/useFetchData";
import axios from "../../../utils/axiosConfig";
import DetailDescription from "../../../components/user/DetailDescription";

function ViewProduct() {
  const [activeTab, setActiveTab] = React.useState("basic");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { productSlug } = useParams();
  const navigate = useNavigate();

  const {
    data: product,
    loading,
    error,
  } = useFetchData(`/product/admin/${productSlug}`, [productSlug]);

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem("adminToken");
    setIsDeleting(true);

    try {
      // Xóa ảnh trước
      if (product?.images?.length > 0) {
        await Promise.all(
          product.images.map((image) =>
            axios.delete(`product/delete-img/${image.public_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
      }

      // Xóa sản phẩm
      await axios.delete(`product/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Xóa sản phẩm thành công");
      navigate(`/${ADMIN_URL}/manage-product`);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    const token = localStorage.getItem("adminToken");
    setIsToggling(true);

    try {
      await axios.patch(
        `product/${product._id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success(
        `Đã ${product.isDisabled ? "kích hoạt" : "vô hiệu hóa"} sản phẩm`
      );
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      message.error("Thay đổi trạng thái thất bại. Vui lòng thử lại.");
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return <Spin tip="Đang tải..." className="flex justify-center p-8" />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Có lỗi xảy ra: {error.message}
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-8">Không tìm thấy sản phẩm</div>;
  }

  return (
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
              disabled={isDeleting}
            >
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold m-0">Chi tiết sản phẩm</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <EyeOutlined />
              <span>{product.views || 0} lượt xem</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Trạng thái:</span>
                <Switch
                  checked={!product.isDisabled}
                  onChange={handleToggleStatus}
                  loading={isToggling}
                  checkedChildren="Đang bán"
                  unCheckedChildren="Đã ẩn"
                  disabled={isDeleting}
                />
              </div>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `/${ADMIN_URL}/manage-product/product/${productSlug}`
                  )
                }
                className="bg-blue-500"
                disabled={isDeleting}
              >
                Chỉnh sửa
              </Button>

              <Popconfirm
                title="Xóa sản phẩm"
                description="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
                onConfirm={handleDeleteProduct}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{
                  danger: true,
                  loading: isDeleting,
                }}
              >
                <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
                  Xóa
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Card>

      {/* Loading overlay khi đang xóa */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card className="w-80 text-center">
            <Spin size="large" />
            <div className="mt-4">
              <div>Đang xóa sản phẩm...</div>
              <div className="text-sm text-gray-500">Vui lòng đợi</div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab="Thông tin cơ bản" key="basic">
              <Card title="Thông Tin Cơ Bản" className="mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600">Tên Sản Phẩm:</label>
                    <div className="font-medium text-lg">{product.title}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-600">Mã Sản Phẩm:</label>
                      <div className="font-medium">{product.productID}</div>
                    </div>
                    <div>
                      <label className="text-gray-600">Số Lượng:</label>
                      <div className="font-medium">{product.quantity}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-600">Lượt Xem:</label>
                      <div className="font-medium flex items-center gap-2">
                        <EyeOutlined />
                        {product.views || 0}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-600">Ngày Tạo:</label>
                      <div className="font-medium">
                        {new Date(product.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600">Giá Sản Phẩm:</label>
                    <div className="font-medium text-green-600 text-xl">
                      {formatPrice(product.prices)}
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Mô Tả & Thông Số Kỹ Thuật" className="mb-6">
                <div>
                  <label className="text-gray-600">Mô tả:</label>

                  <DetailDescription description={product.description} />
                </div>

                <Divider />

                <div className="specifications-section">
                  <h3 className="font-medium mb-4">Thông Số Kỹ Thuật</h3>
                  {product?.specifications?.map((spec, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                      {spec.topic && (
                        <div className="mb-4 font-medium text-gray-700">
                          {spec.topic}
                        </div>
                      )}

                      {spec.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="grid grid-cols-2 gap-4 mb-2"
                        >
                          <div className="text-gray-700">{detail.title}</div>
                          <div
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: detail.description,
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Bộ lọc" key="filters">
              <Card>
                {product?.optionIDs?.map((option) => (
                  <div key={option._id} className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {option.title}
                    </span>
                  </div>
                ))}
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <Card title="Hình Ảnh Sản Phẩm" className="mb-6">
            <div className="grid grid-cols-2 gap-2">
              {product?.images?.map((img) => (
                <div key={img.public_id} className="relative">
                  <img
                    src={img.url}
                    alt="product"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Phân Loại">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600">Danh Mục:</label>
                <div className="font-medium">{product.categoryID?.title}</div>
              </div>

              <div>
                <label className="block text-gray-600">Thương Hiệu:</label>
                <div className="font-medium">{product.brandID?.title}</div>
              </div>

              <div>
                <label className="block text-gray-600">Dòng Sản Phẩm:</label>
                <div className="font-medium">{product.seriesID?.title}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;
