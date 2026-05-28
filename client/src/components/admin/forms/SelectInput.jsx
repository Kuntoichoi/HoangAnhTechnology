import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SelectInput = ({ label, options, onChange, required }) => {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}:</label>
      <Select
        onChange={onChange}
        placeholder={`Chọn ${label}`}
        required
        className="w-full"
      >
        {options.map((option) => (
          <Option key={option._id} value={option._id}>
            {option.title}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectInput;
