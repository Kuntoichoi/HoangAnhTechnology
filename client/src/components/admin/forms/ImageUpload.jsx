// ImageUpload.js
import React from "react";
import { Upload, Button, Spin, Image } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const ImageUpload = ({
  handleImageUpload,
  fileList,
  loadingImage,
  loadingRemoveImage,
  handleRemoveImage,
}) => {
  return (
    <div>
      <label className="block mb-2 font-medium">Hình Ảnh:</label>
      <Upload
        beforeUpload={handleImageUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<PlusOutlined />}>Tải Hình Ảnh Lên</Button>
      </Upload>
      <div className="mt-4">
        {loadingImage && <Spin />}
        <div className="flex flex-wrap gap-2 mt-2">
          {fileList.map((file) => (
            <div key={file.public_id} className="relative inline-block">
              <Image
                src={file.url}
                alt={file.name}
                width={100}
                height={100}
                className="object-cover"
              />
              <Button
                icon={<MinusOutlined />}
                onClick={() => handleRemoveImage(file.public_id)}
                loading={loadingRemoveImage}
                className="absolute top-0 right-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
