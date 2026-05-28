// Specifications.js
import React from "react";
import { Button } from "antd";
import AddProductInput from "../../components/admin/AddProductInput";

const Specifications = ({
  specifications,
  handleSpecificationChange,
  handleRemoveSpecification,
  handleAddSpecification,
}) => {
  return (
    <div>
      {specifications.map((spec, index) => (
        <div key={index} className="border p-4 rounded-md mt-4">
          <AddProductInput
            label="Tiêu Đề"
            name="title"
            type="text"
            value={spec.title}
            onChange={(e) => handleSpecificationChange(index, e)}
          />
          <div className="grid pt-3">
            <label className="block mb-2 font-medium">Chi Tiết</label>
            <textarea
              name="details"
              value={spec.details}
              onChange={(e) => handleSpecificationChange(index, e)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <Button type="link" onClick={() => handleRemoveSpecification(index)}>
            Xóa Thông Số Kỹ Thuật Này
          </Button>
        </div>
      ))}
      <Button type="button" onClick={handleAddSpecification}>
        Thêm Thông Số Kỹ Thuật Mới
      </Button>
    </div>
  );
};

export default Specifications;
