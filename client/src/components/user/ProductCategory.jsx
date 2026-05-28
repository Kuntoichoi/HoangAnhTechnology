import React, { useState } from "react";
import Product from "./Product";
import { useNavigate } from "react-router-dom";
const ProductCategory = ({
  category,
  brand,
  selectedSeries,
  page = 1,
  limit = 15,
  itemSize = 200,
}) => {
  const { icon = [], title, brandIDs = [] } = category;
  const [totalProducts, setTotalProducts] = useState(0);

  const navigate = useNavigate();
  const handleBrandClick = (brandSlug) => {
    navigate(`/product-list/${category.slug}/${brandSlug}`);
  };

  const handleAllBrandClick = () => {
    navigate(`/product-list/${category.slug}`);
  };

  return (
    <div className="justify-between items-center w-full bg-white mt-2 pb-4 shadow ">
      <div className="flex flex-col sm:flex-row justify-between p-6 gap-4">
        <div className="flex items-center">
          {icon.length > 0 ? (
            <img
              src={icon[0].url}
              className="w-[30px] h-[30px]"
              alt="Category Icon"
            />
          ) : (
            <div className="w-[30px] h-[30px] bg-gray-200 rounded-full" />
          )}
          <div className="pl-4 text-lg sm:text-xl font-medium">{title}</div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 justify-start sm:justify-between items-center">
          {brandIDs.slice(0, 3).map((brand) => (
            <div key={brand._id}>
              <div
                className="underline-offset-1 hover:underline cursor-pointer text-sm sm:text-md font-light"
                onClick={() => handleBrandClick(brand.slug)}
              >
                {brand.title}
              </div>
            </div>
          ))}
          <span
            className="text-primary text-sm sm:text-md cursor-pointer font-normal"
            onClick={() => handleAllBrandClick()}
          >
            Xem tất cả
          </span>
        </div>
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="sm:hidden overflow-x-auto scrollbar-hide px-2 w-full">
        <div className="flex gap-4 pb-2">
          <div className="grid grid-flow-col auto-cols-[200px] gap-2">
            <Product
              category={category}
              brand={brand}
              selectedSeries={selectedSeries}
              page={page}
              limit={limit}
              itemSize={200}
              setTotalProducts={setTotalProducts}
            />
          </div>
        </div>
      </div>

      {/* Tablet and Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-5 pb-2 gap-3">
        <Product
          category={category}
          brand={brand}
          selectedSeries={selectedSeries}
          page={page}
          limit={limit}
          itemSize={itemSize}
          setTotalProducts={setTotalProducts}
        />
      </div>
    </div>
  );
};

export default ProductCategory;
