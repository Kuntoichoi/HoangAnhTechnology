import React, { useEffect, useState } from "react";
import { Breadcrumb, Empty, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import {
  getBrandLetters,
  getBrandLogoUrl,
  getBrandName,
} from "../../utils/brandAssets";

function CategoryBrands() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`categories/${categorySlug}/brands`);
        setCategory(data.category);
        setBrands(data.brands || []);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy danh mục");
        setCategory(null);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [categorySlug]);

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
            { title: category?.name || category?.title },
          ]}
        />

        <section className="mb-8">
          <h1 className="text-3xl font-bold uppercase text-primary">
            Thiết bị {category?.name || category?.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">
            {category?.description ||
              `Lựa chọn hãng sản xuất để xem danh sách sản phẩm ${category?.name || category?.title} phù hợp cho hệ thống mạng doanh nghiệp.`}
          </p>
        </section>

        {brands.length ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 rounded-md bg-white px-4 py-8 shadow-sm sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => {
              const brandName = getBrandName(brand);
              const logoUrl = getBrandLogoUrl(brand);

              return (
                <button
                  key={brand.id || brand.slug}
                  type="button"
                  onClick={() => navigate(`/${category.slug}/${brand.slug}`)}
                  className="group flex min-h-[132px] flex-col items-center justify-start rounded-md p-3 text-center transition hover:bg-primary/5"
                >
                  <div className="flex h-20 w-full items-center justify-center">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={brandName}
                        className="max-h-20 w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                        {getBrandLetters(brandName)}
                      </div>
                    )}
                  </div>
                  <span className="mt-4 text-center text-[20px] font-semibold text-[#666] group-hover:text-primary">
                    {category?.name || category?.title} {brandName}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <Empty description="Chưa có hãng sản phẩm trong danh mục này." />
        )}
      </div>
    </main>
  );
}

export default CategoryBrands;
