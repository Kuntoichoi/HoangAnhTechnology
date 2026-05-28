import React, { useEffect, useState } from "react";
import { Breadcrumb, Empty, Pagination, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import {
  getBrandLetters,
  getBrandLogoUrl,
  getBrandName,
} from "../../utils/brandAssets";

function BrandProducts() {
  const { categorySlug, brandSlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug, brandSlug]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `categories/${categorySlug}/brands/${brandSlug}/products?page=${currentPage}&limit=${pageSize}`
        );
        setCategory(data.category);
        setBrand(data.brand);
        setProducts(data.products || []);
        setTotalProducts(data.totalProducts || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy sản phẩm");
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, brandSlug, currentPage]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (error) {
    return <div className="mx-auto max-w-[1200px] px-4 py-10 text-center text-gray-600">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8">
      <div className="mx-auto max-w-[1200px]">
        <Breadcrumb
          className="mb-6"
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: <Link to={`/${category.slug}`}>{category.name}</Link> },
            { title: brand.name },
          ]}
        />

        <section className="mb-8 flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm md:flex-row md:items-center">
          {(() => {
            const brandName = getBrandName(brand);
            const logoUrl = getBrandLogoUrl(brand);

            return logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="h-20 w-40 object-contain"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded bg-primary/10 text-xl font-bold text-primary">
                {getBrandLetters(brandName)}
              </div>
            );
          })()}
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {category.name} {brand.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Danh sách sản phẩm {category.name} thuộc hãng {brand.name}.
            </p>
          </div>
        </section>

        {products.length ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="group flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-[190px] items-center justify-center bg-gray-50 p-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No image</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="text-xs font-semibold uppercase text-red-500">
                      {product.sku}
                    </div>
                    <h2 className="mt-2 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-primary">
                      {product.name}
                    </h2>
                    {product.short_description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {product.short_description}
                      </p>
                    )}
                    <div className="mt-auto border-t border-gray-100 pt-3 text-base font-bold text-primary">
                      {product.price_text || "Liên hệ"}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {totalProducts > pageSize && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalProducts}
                  showSizeChanger={false}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <Empty description="Chưa có sản phẩm trong danh mục này." />
        )}
      </div>
    </main>
  );
}

export default BrandProducts;
