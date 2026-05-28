import React from "react";
import { useData } from "../../contexts/DataContext";
import { useNavigate } from "react-router-dom";
import {
  getBrandLetters,
  getBrandLogoUrl,
  getBrandName,
} from "../../utils/brandAssets";

const MobileCategoryList = ({ onClose }) => {
  const { categories } = useData();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Điều hướng đến trang category
    navigate(`/${category.slug}`);
    // Đóng menu mobile
    onClose();
  };

  const handleBrandClick = (category, brand) => {
    navigate(`/product-list/${category.slug}/${brand.slug}`);
    onClose();
  };

  const getCategoryIconUrl = (category) => category.icon?.[0]?.url || "";

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">Tất cả sản phẩm</h2>
        <button onClick={onClose} className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Categories List */}
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {categories?.map((category) => {
          const categoryIconUrl = getCategoryIconUrl(category);

          return (
            <div key={category._id} className="border-b border-gray-100">
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left active:bg-gray-50"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="flex items-center space-x-3">
                  {categoryIconUrl ? (
                    <img
                      src={categoryIconUrl}
                      alt={category.title}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#eef5fc] text-xs font-semibold text-[#17345f]">
                      {category.title?.[0]}
                    </span>
                  )}
                  <span className="font-medium text-gray-800">
                    {category.title}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="bg-[#eef5fc] px-4 pb-3">
                {category.brandIDs?.slice(0, 8).map((brand) => {
                  const brandName = getBrandName(brand);
                  const logoUrl = getBrandLogoUrl(brand);

                  return (
                    <button
                      key={brand._id}
                      type="button"
                      className="flex min-h-10 w-full items-center gap-3 py-2 pl-12 text-left text-sm text-[#17345f]"
                      onClick={() => handleBrandClick(category, brand)}
                    >
                      <span className="flex h-7 w-16 shrink-0 items-center justify-center rounded bg-white px-2">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={brandName}
                            className="max-h-5 w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold text-[#17345f]">
                            {getBrandLetters(brandName)}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {category.title} {brandName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCategoryList;
