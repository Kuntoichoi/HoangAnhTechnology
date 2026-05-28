import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryItems = ({ category, onMouseEnter, onClick }) => {
  return (
    <div
      className="flex items-center px-4 py-2 hover:bg-grey cursor-pointer transition-all duration-200 ease-in-out"
      onMouseEnter={onMouseEnter}
      onClick={() => onClick?.(category)}
    >
      <div className="flex items-center gap-3">
        {category.icon && category.icon[0] && (
          <img
            src={category.icon[0].url}
            alt={category.title}
            className="w-[25px] h-[25px] transition-transform duration-200 group-hover:scale-105"
          />
        )}
        <span className="text-sm transition-colors duration-200">
          {category.title}
        </span>
      </div>
      <span className="ml-auto transition-transform duration-200 group-hover:translate-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </span>
    </div>
  );
};

export default CategoryItems;
