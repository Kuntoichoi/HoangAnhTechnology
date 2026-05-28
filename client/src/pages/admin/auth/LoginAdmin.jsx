import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ADMIN_URL } from "../../../constants/adminConstants";
import axios from "../../../utils/axiosConfig";

function LoginAdmin() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate(`/${ADMIN_URL}/home-admin`);
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`/${ADMIN_URL}/admin-login`, values);
      const { token } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem("adminToken", token);

      message.success("Đăng nhập thành công!");
      navigate(`/${ADMIN_URL}/home-admin`);
    } catch (error) {
      message.error("Đăng nhập thất bại, vui lòng kiểm tra lại!");
      console.error("Login error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Đăng Nhập Admin</h1>
          <p className="text-gray-600 mt-2">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <Form
          form={form}
          name="admin_login"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700"
              size="large"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginAdmin;
