import React from "react";

const AddProductInput = ({ label, ...rest }) => {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>
      <input className="w-full p-2 border border-gray-300 rounded" {...rest} />
    </div>
  );
};

export default AddProductInput;
