import React from "react";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt();

const DetailDescription = ({ description }) => {
  return (
    <MarkdownEditor
      value={description}
      renderHTML={(text) => mdParser.render(text)}
      readOnly={true} // Đảm bảo chỉ hiển thị
      config={{ view: { menu: false, md: false, html: true } }} // Chỉ hiện HTML
      className="border-none shadow-none" // Tailwind CSS để bỏ border
      style={{ borderRight: "none", boxShadow: "none" }} // Đảm bảo bỏ border bên phải
    />
  );
};

export default DetailDescription;
