import React from "react";

function BlogCard({ title, excerpt, image, date }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-[450px] flex flex-col">
      <img
        src={image}
        alt={title}
        className="w-full items-center justify-center rounded-t-lg shadow-md"
        style={{ height: "250px", objectFit: "cover" }}
      />
      <div className="p-4 flex flex-col flex-grow overflow-hidden">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h2>
        <p className="text-gray-600 mb-3 flex-grow line-clamp-3">{excerpt}</p>
        <p className="text-gray-400 text-sm">{date}</p>
      </div>
    </div>
  );
}

export default BlogCard;
