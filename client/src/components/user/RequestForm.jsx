import React from "react";
import { Modal, Form, Input, Radio, Button, message } from "antd";
import { useState } from "react";
import axios from "../../utils/axiosConfig";

const { TextArea } = Input;

const RequestForm = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await axios.post("/formad", values);

      message.success("Gửi yêu cầu thành công!");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      title="GỬI YÊU CẦU HỖ TRỢ"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="text-gray-600 mb-4">
        Kính chào quý khách!
        <br />
        Chúng tôi rất vui được hỗ trợ quý khách. Xin vui lòng để lại thông tin
        để nhận tư vấn. Chúng tôi sẽ liên hệ lại với quý khách trong thời gian
        sớm nhất.
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Họ và tên *"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại *"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item
          label="Bạn cần hỗ trợ *"
          name="helpOptions"
          rules={[{ required: true, message: "Vui lòng chọn loại hỗ trợ!" }]}
        >
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="Báo Giá Sản Phẩm">Báo giá sản phẩm</Radio>
            <Radio value="Hỗ Trợ Lên Dự Án">Hỗ trợ lên dự án</Radio>
            <Radio value="Hỗ Trợ Tư Vấn Kỹ Thuật, Giải Pháp">
              Hỗ trợ tư vấn kỹ thuật, giải pháp
            </Radio>
            <Radio value="Khác">Khác</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Lời nhắn" name="message">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-primary"
          >
            GỬI YÊU CẦU
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestForm;
