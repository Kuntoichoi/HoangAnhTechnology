import React, { useState, useEffect } from "react";
import { Table, Tabs, Tag, Modal, Button, message } from "antd";
import axios from "../../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

function ManageForm() {
  const [supportForms, setSupportForms] = useState([]);
  const [productForms, setProductForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  const fetchForms = async () => {
    setLoading(true);
    try {
      const [supportRes, productRes] = await Promise.all([
        axios.get("/formad", axiosConfig),
        axios.get("/prodform", axiosConfig),
      ]);
      setSupportForms(supportRes.data);
      setProductForms(productRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn");
        localStorage.removeItem("adminToken");
        navigate("/admin-hac/admin-login");
      } else {
        message.error("Không thể tải dữ liệu form");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // Kiểm tra token trước khi fetch data
    if (!adminToken) {
      message.error("Vui lòng đăng nhập");
      navigate("/admin-hac/admin-login");
      return;
    }
    fetchForms();
  }, [navigate]);

  const getStatusSorter = () => ({
    sorter: (a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return 0;
    },
    sortDirections: ["descend", "ascend"],
  });

  const supportColumns = [
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "gold" : "green"}>
          {status === "pending" ? "Chưa xử lý" : "Đã xử lý"}
        </Tag>
      ),
      ...getStatusSorter(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showFormDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const productColumns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "prodID",
      key: "prodID",
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "gold" : "green"}>
          {status === "pending" ? "Chưa xử lý" : "Đã xử lý"}
        </Tag>
      ),
      ...getStatusSorter(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showFormDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const showFormDetail = (form) => {
    setSelectedForm(form);
    setIsModalVisible(true);
  };

  const handleUpdateStatus = async (formId, formType) => {
    try {
      const endpoint =
        formType === "support" ? `/formad/${formId}` : `/prodform/${formId}`;
      await axios.put(endpoint, { status: "approved" }, axiosConfig);
      message.success("Cập nhật trạng thái thành công");
      fetchForms();
      setIsModalVisible(false);
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        message.error("Không thể cập nhật trạng thái");
      }
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <span>
          Form Yêu Cầu Sản Phẩm
          {productForms.pendingForms && (
            <Tag color="red" className="ml-2">
              {productForms.pendingForms}
            </Tag>
          )}
        </span>
      ),
      children: (
        <Table
          columns={productColumns}
          dataSource={productForms.forms}
          loading={loading}
          rowKey="_id"
        />
      ),
    },
    {
      key: "2",
      label: (
        <span>
          Form Yêu Cầu Hỗ Trợ
          {supportForms.pendingForms > 0 && (
            <Tag color="red" className="ml-2">
              {supportForms.pendingForms}
            </Tag>
          )}
        </span>
      ),
      children: (
        <Table
          columns={supportColumns}
          dataSource={supportForms.forms}
          loading={loading}
          rowKey="_id"
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Quản Lý Form</h1>

      <Tabs items={items} />

      <Modal
        title="Chi tiết form"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() =>
              handleUpdateStatus(
                selectedForm._id,
                selectedForm.prodID ? "product" : "support"
              )
            }
            disabled={selectedForm?.status === "processed"}
          >
            Đánh dấu đã xử lý
          </Button>,
        ]}
      >
        {selectedForm && (
          <div className="space-y-4">
            {selectedForm.prodID && (
              <p>
                <strong>Mã sản phẩm:</strong> {selectedForm.prodID}
              </p>
            )}
            <p>
              <strong>Họ và tên:</strong> {selectedForm.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedForm.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedForm.phone}
            </p>
            <p>
              <strong>Lời nhắn:</strong> {selectedForm.message}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Tag color={selectedForm.status === "pending" ? "gold" : "green"}>
                {selectedForm.status === "pending" ? "Chưa xử lý" : "Đã xử lý"}
              </Tag>
            </p>
            <p>
              <strong>Thời gian tạo:</strong>{" "}
              {new Date(selectedForm.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ManageForm;
