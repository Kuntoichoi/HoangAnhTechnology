import { useState } from "react";
import axios from "../utils/axiosConfig";
import { message } from "antd";

export const useImageHandler = () => {
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToFileList = (file) => {
    setFileList((prev) => [...prev, file]);
    return false; // Prevent default upload behavior
  };

  const handleRemoveFromFileList = (file) => {
    setFileList((prev) => prev.filter((item) => item !== file));
  };

  const handleRemoveFromServer = async (publicId) => {
    try {
      setIsLoading(true);
      await axios.delete(`product/delete-img/${publicId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      message.success("Xóa ảnh thành công!");
      return publicId;
    } catch (error) {
      console.error("Lỗi khi xóa ảnh:", error);
      message.error("Lỗi khi xóa ảnh!");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImagesToServer = async () => {
    if (!fileList.length) return [];

    try {
      setIsLoading(true);
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await axios.put("product/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setFileList([]); // Clear file list after successful upload
      message.success("Tải ảnh lên thành công!");
      return data;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      message.error("Lỗi khi tải ảnh lên!");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fileList,
    isLoading,
    handleAddToFileList,
    handleRemoveFromFileList,
    handleRemoveFromServer,
    uploadImagesToServer,
  };
};
