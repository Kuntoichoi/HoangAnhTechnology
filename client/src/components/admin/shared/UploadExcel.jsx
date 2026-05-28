import { useState } from "react";
import * as XLSX from "xlsx";
import { notification } from "antd";

const UploadExcel = ({ setProduct }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn file Excel!",
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      let specifications = [];
      let currentTopic = "";

      jsonData.forEach((row) => {
        if (row[0] && !row[1]) {
          // Nếu ô đầu tiên có nội dung và ô thứ hai rỗng -> Đó là "topic"
          currentTopic = row[0];
          specifications.push({
            topic: currentTopic,
            details: [],
          });
        } else if (row[0] && row[1]) {
          // Nếu cả hai cột đầu có dữ liệu -> Đó là "details"
          if (specifications.length === 0) {
            // Nếu chưa có topic, thêm một topic trống
            specifications.push({
              topic: "",
              details: [],
            });
          }
          specifications[specifications.length - 1].details.push({
            title: row[0],
            description: row[1] || "",
          });
        }
      });

      // Cập nhật vào state product
      setProduct((prev) => ({
        ...prev,
        specifications: specifications,
      }));

      notification.success({
        message: "Thành công",
        description: "Import dữ liệu từ Excel thành công!",
      });
    };
  };

  return (
    <div className="p-4 border rounded">
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Import Excel
      </button>
    </div>
  );
};

export default UploadExcel;
