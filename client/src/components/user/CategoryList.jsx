import React, { useEffect, useMemo, useState } from "react";
import { Empty, Spin } from "antd";
import {
  AppstoreOutlined,
  CloudServerOutlined,
  CodeSandboxOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  HddOutlined,
  SafetyOutlined,
  UsbOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import axios from "../../utils/axiosConfig";
import {
  getBrandLetters,
  getBrandLogoUrl,
  getBrandName,
} from "../../utils/brandAssets";

const defaultCatalog = [
  { title: "Switch", slug: "switch", icon: HddOutlined },
  { title: "Firewall", slug: "firewall", icon: SafetyOutlined },
  { title: "Router", slug: "router", icon: DeploymentUnitOutlined },
  { title: "Wireless", slug: "wireless", icon: WifiOutlined },
  { title: "Server", slug: "server", icon: CloudServerOutlined },
  { title: "Storage", slug: "storage", icon: DatabaseOutlined },
  { title: "Software", slug: "software", icon: CodeSandboxOutlined },
  { title: "Module quang", slug: "module-quang", icon: AppstoreOutlined },
  { title: "Thiết bị khác", slug: "thiet-bi-khac", icon: DeploymentUnitOutlined },
  { title: "Phụ kiện mạng", slug: "phu-kien-mang", icon: UsbOutlined },
];

const CategoryList = ({ loading = false, onClose }) => {
  const { categories } = useData();
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [brandCache, setBrandCache] = useState({});
  const [brandLoading, setBrandLoading] = useState(false);

  const catalog = useMemo(
    () =>
      defaultCatalog.map((item) => {
        const matchedCategory = categories?.find(
          (category) =>
            category.slug === item.slug ||
            category.title?.toLowerCase() === item.title.toLowerCase()
        );

        return {
          ...item,
          ...matchedCategory,
          iconComponent: item.icon,
          iconUrl: matchedCategory?.icon?.[0]?.url,
        };
      }),
    [categories]
  );

  useEffect(() => {
    if (!hoveredCategory?.slug || brandCache[hoveredCategory.slug]) return;

    const fetchBrands = async () => {
      setBrandLoading(true);
      try {
        const { data } = await axios.get(
          `categories/${hoveredCategory.slug}/brands`
        );
        setBrandCache((prev) => ({
          ...prev,
          [hoveredCategory.slug]: data.brands || [],
        }));
      } catch (error) {
        setBrandCache((prev) => ({
          ...prev,
          [hoveredCategory.slug]: [],
        }));
      } finally {
        setBrandLoading(false);
      }
    };

    fetchBrands();
  }, [brandCache, hoveredCategory]);

  const goToCategory = (category) => {
    navigate(`/${category.slug}`);
    onClose?.();
  };

  const goToBrand = (brand) => {
    if (!hoveredCategory?.slug) return;
    navigate(`/${hoveredCategory.slug}/${brand.slug}`);
    onClose?.();
  };

  const activeBrands = hoveredCategory?.slug
    ? brandCache[hoveredCategory.slug] || []
    : [];

  return (
    <div
      className="relative z-20 w-[1100px] overflow-visible"
      onClick={(event) => event.stopPropagation()}
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="relative z-30 w-[320px] shrink-0 overflow-hidden rounded-t-md border border-gray-200 bg-white shadow-xl">
        <div className="flex h-[46px] items-center gap-3 bg-primary px-4 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            stroke="currentColor"
            className="h-5 w-5 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <h2 className="truncate text-[17px] font-bold uppercase leading-none">
            Danh mục sản phẩm
          </h2>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="bg-white">
            {catalog.map((category) => {
              const Icon = category.iconComponent;
              const isActive = hoveredCategory?.slug === category.slug;

              return (
                <button
                  key={category.slug}
                  type="button"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onFocus={() => setHoveredCategory(category)}
                  onClick={() => goToCategory(category)}
                  className={`group flex h-[54px] w-full items-center border-b border-gray-100 px-4 text-left transition ${
                    isActive ? "bg-primary/5" : "bg-white hover:bg-primary/5"
                  }`}
                >
                  <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center text-[22px] text-primary/55">
                    {category.iconUrl ? (
                      <img
                        src={category.iconUrl}
                        alt={category.title}
                        className="h-6 w-6 object-contain opacity-70"
                      />
                    ) : (
                      <Icon />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[17px] font-medium leading-none text-[#555]">
                    {category.title}
                  </span>
                  <span className="ml-3 text-[18px] leading-none text-[#555] transition group-hover:translate-x-1 group-hover:text-primary">
                    ›
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {hoveredCategory && (
        <div className="absolute left-[320px] top-0 z-20 min-h-[586px] w-[780px] border border-l-0 border-gray-200 bg-white p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xl font-semibold text-primary">
              {hoveredCategory.title}
            </h3>
            <button
              type="button"
              onClick={() => goToCategory(hoveredCategory)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          {brandLoading && !brandCache[hoveredCategory.slug] ? (
            <div className="flex h-40 items-center justify-center">
              <Spin />
            </div>
          ) : activeBrands.length ? (
            <div className="grid grid-cols-4 gap-x-8 gap-y-8">
              {activeBrands.map((brand) => {
                const brandName = getBrandName(brand);
                const logoUrl = getBrandLogoUrl(brand);

                return (
                  <button
                    key={brand.id || brand.slug}
                    type="button"
                    onClick={() => goToBrand(brand)}
                    className="group flex min-h-[120px] flex-col items-center justify-start rounded-md p-3 text-center transition hover:bg-primary/5 hover:shadow-md"
                  >
                    <div className="flex h-14 w-full items-center justify-center">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={brandName}
                          className="max-h-14 w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                          {getBrandLetters(brandName)}
                        </div>
                      )}
                    </div>
                    <span className="mt-3 text-[16px] font-medium text-[#666] group-hover:text-primary">
                      {hoveredCategory.title} {brandName}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <Empty description="Chưa có hãng sản phẩm trong danh mục này." />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
