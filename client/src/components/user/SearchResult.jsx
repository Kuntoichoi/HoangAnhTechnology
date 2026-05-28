import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { formatPrice } from "../../utils/helpers";

function SearchResult({ searchValue, onClose }) {
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const handleProductClick = async (productSlug) => {
    try {
      await axios.put(`/product/${productSlug}/views`);
    } catch (error) {
      console.error("Error updating views:", error);
    }

    onClose();
  };

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(async () => {
      if (searchValue.trim()) {
        try {
          const response = await axios.get(
            `/product?keyword=${searchValue}&limit=5`
          );
          if (response.data?.products) {
            setSearchResults(response.data.products);
          }
        } catch (error) {
          console.error("Error searching products:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
      setDebouncedValue(searchValue);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  if (searchResults.length === 0 && !isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-lg p-4">
        <p className="text-gray-500 text-center">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-lg p-1 max-h-[400px] overflow-y-auto">
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Spin indicator={antIcon} />
            <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
          </div>
        ) : (
          <>
            {searchResults.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item.slug}`}
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 border-b border-gray-100"
                onClick={() => handleProductClick(item.slug)}
              >
                <img
                  src={item.images?.[0]?.url || "/placeholder-image.png"}
                  alt={item.title}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-1">
                  <p className=" text-[12px] sm:text-[14px] font-medium line-clamp-2 text-red-600">
                    {item.productID}
                  </p>
                  <h3 className="text-base font-normal text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-primary font-bold text-medium">Liên hệ</p>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResult;
