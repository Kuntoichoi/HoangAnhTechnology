import React from "react";
import { useNavigate } from "react-router-dom";

const BrandCategory = ({ category, onMouseLeave, onSelectBrand }) => {
  const navigate = useNavigate();

  const handleBrandClick = (brand) => {
    onSelectBrand(brand.slug);
  };

  return (
    <div className="w-[895px] h-[450px] bg-white" onMouseLeave={onMouseLeave}>
      <div className="p-4">
        <ul className="flex flex-wrap">
          {category.brandIDs.map((brand) => (
            <li
              key={brand._id}
              onClick={() => handleBrandClick(brand)}
              className="p-3 hover:bg-grey w-1/5"
            >
              <div className="w-full flex items-center justify-center">
                <img src={brand.logo.url} alt={brand.title} className="w-20" />
              </div>
              <span className="flex justify-center items-center w-full text-center flex-wrap">
                {category.title} - {brand.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BrandCategory;
