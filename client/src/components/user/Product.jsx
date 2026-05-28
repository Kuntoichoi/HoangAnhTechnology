import React, { useEffect, useRef, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Button, Skeleton, Image, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";
import { InboxOutlined } from "@ant-design/icons";

const Product = ({
  category,
  series,
  page,
  limit,
  setTotalProducts,
  options,
  sortType,
  selectedBrand,
  relatedProducts,
  layoutType,
  recentProduct,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setLoading(true);
      setError(null);
      setProducts([]);

      try {
        const queryParams = new URLSearchParams();
        if (category) {
          queryParams.append("categoryID", category._id);
        }

        if (Array.isArray(relatedProducts) && relatedProducts.length > 0) {
          relatedProducts.forEach((productID) =>
            queryParams.append("productID", productID)
          );
        }

        if (selectedBrand?._id) {
          queryParams.append("brandID", selectedBrand._id);
        }

        if (series) {
          queryParams.append("seriesID", series);
        }
        if (options?.length > 0) {
          queryParams.append("optionIDs", options);
        }
        queryParams.append("page", page);
        queryParams.append("limit", limit);
        if (sortType) {
          queryParams.append("sort", sortType);
        }

        const response = await axios.get(`/product?${queryParams.toString()}`);
        if (requestId !== requestIdRef.current) return;

        if (response.data?.products?.length === 0) {
          setError("Không có sản phẩm trong danh mục này.");
          setProducts([]);
          setTotalProducts(0);
          return;
        } else {
          let filteredProducts = recentProduct
            ? response.data.products.filter(
                (product) => product._id !== recentProduct
              )
            : response.data.products;
          setProducts(filteredProducts);
          setTotalProducts(response.data.totalProducts);
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        if (error.response && error.response.status === 404) {
          setError("Không có sản phẩm trong danh mục này.");
        } else {
          console.error("Error fetching products:", error);
          setError("Đã xảy ra lỗi khi tải sản phẩm.");
        }
        setProducts();
        setTotalProducts(0);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [
    category,
    selectedBrand,
    series,
    options,
    relatedProducts,
    page,
    limit,
    sortType,
  ]);

  const handleProductClick = async (product) => {
    try {
      await axios.put(`/product/${product.slug}/views`);
      navigate(`/product/${product.slug}`);
    } catch (error) {
      console.error("Error updating views:", error);
      navigate(`/product/${product.slug}`);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64  w-[950px]">
        <Spin />
      </div>
    );

  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] min-w-[1000px]">
        <InboxOutlined className="text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg text-gray-600 w-full flex items-center justify-center">
          Không có sản phẩm trong danh mục này
        </h3>
      </div>
    );
  }

  return (
    <>
      {products &&
        products.map((product) => (
          <div
            key={product._id}
            className={`flex ${
              layoutType === "horizontal"
                ? "flex-row items-center gap-2 p-2 sm:p-3 w-full max-w-[500px]"
                : "flex-col"
            } h-auto cursor-pointer overflow-hidden 
            transition-all duration-300 bg-white rounded-lg`}
            style={{
              border: '1px solid #e8eaf5',
              boxShadow: '0 2px 8px rgba(26, 76, 149, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(26, 76, 149, 0.15)';
              e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 76, 149, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => handleProductClick(product)}
          >
            {/* Image Section */}
            <div
              className={`flex items-center justify-center bg-gray-50 relative ${
                layoutType === "horizontal"
                  ? "h-[80px] w-[80px] sm:h-[100px] sm:w-[100px]"
                  : "h-[130px] min-[380px]:h-[160px] xs:h-[180px] sm:h-[220px] w-full"
              } overflow-hidden`}
            >
              {product.images.length ? (
                <Image
                  src={product.images?.[0]?.url || "/placeholder-image.png"}
                  alt={product.title}
                  className="p-4 w-full h-full object-contain transition-transform duration-300 ease-in-out"
                  preview={false}
                  style={{
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ) : (
                <div className="p-4 w-full h-full object-contain transition-transform duration-300 ease-in-out bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div
              className={`flex flex-col justify-between ${
                layoutType === "horizontal"
                  ? "flex-1 px-2"
                  : "p-3 min-[380px]:p-4"
              } relative bg-white w-full`}
            >
              <div>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#e74c3c',
                  marginBottom: '6px',
                  lineClamp: '2',
                }}>
                  {product.productID}
                </p>
                <p style={{
                  fontSize: layoutType === "horizontal" ? '13px' : '14px',
                  fontWeight: '500',
                  color: '#333',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                }}>
                  {product.title}
                </p>
              </div>

              <div style={{
                padding: '8px 0',
                borderTop: '1px solid #e8eaf5'
              }}>
                <p style={{
                  fontSize: layoutType === "horizontal" ? '13px' : '14px',
                  fontWeight: '700',
                  color: '#1a4c95',
                  margin: 0,
                }}>
                  Liên hệ
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-3 right-3 text-gray-400 group-hover:text-primary transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`${
                    layoutType === "horizontal" ? "w-5 h-5" : "w-4 h-4"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Product;
