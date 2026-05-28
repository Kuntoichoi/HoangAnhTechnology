import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  HddOutlined,
  SafetyOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useData } from "../../contexts/DataContext";

const featuredCategories = [
  {
    title: "Switch",
    slug: "switch",
    icon: HddOutlined,
    summary: "Switch access, aggregation và core cho hạ tầng doanh nghiệp.",
  },
  {
    title: "Wireless",
    slug: "wireless",
    icon: WifiOutlined,
    summary: "WiFi doanh nghiệp, controller và access point hiệu năng cao.",
  },
  {
    title: "Firewall",
    slug: "firewall",
    icon: SafetyOutlined,
    summary: "Bảo mật biên mạng, VPN, kiểm soát truy cập và threat defense.",
  },
  {
    title: "Server",
    slug: "server",
    icon: CloudServerOutlined,
    summary: "Máy chủ, linh kiện và giải pháp tính toán cho hệ thống CNTT.",
  },
  {
    title: "Storage",
    slug: "storage",
    icon: DatabaseOutlined,
    summary: "Lưu trữ tập trung, backup và mở rộng dung lượng vận hành.",
  },
  {
    title: "Module quang",
    slug: "module-quang",
    icon: DeploymentUnitOutlined,
    summary: "Transceiver, DAC, AOC và module kết nối quang tương thích.",
  },
];

const partners = [
  { name: "Cisco", logo: "/images/partners/logo-cisco.png" },
  { name: "Aruba", logo: "/images/partners/logo-aruba.png" },
  { name: "HPE", logo: "/images/partners/logo-hpe.png" },
  { name: "Dell", logo: "/images/partners/logo-dell.png" },
  { name: "H3C", logo: "/images/partners/logo-h3c.png" },
  { name: "Lenovo", logo: "/images/partners/logo-lenovo.png" },
  { name: "CoreEdge", logo: "/images/partners/logo-coreedge.svg" },
];

const productHighlights = [
  {
    title: "Cisco Catalyst",
    image: "/product-import/cisco-catalyst/C9300-48T-E.png",
    href: "/switch/cisco",
  },
  {
    title: "Aruba Switch",
    image: "/product-import/aruba-switch/ARUBA-CX-6300-SWITCH-SERIES.png",
    href: "/switch/hpe-aruba",
  },
  {
    title: "CoreEdge",
    image: "/product-import/coreedge/images/C3300-24TS/01-C3300-24TS-01.jpg",
    href: "/switch/coreedge",
  },
];

const stats = [
  { value: "10+", label: "năm kinh nghiệm" },
  { value: "50+", label: "đối tác công nghệ" },
  { value: "1000+", label: "dự án đã hỗ trợ" },
];

const getVisibleCategories = (categories = []) => {
  if (!categories.length) return featuredCategories;

  return featuredCategories.map((fallback) => {
    const matched = categories.find(
      (category) =>
        category.slug === fallback.slug ||
        category.title?.toLowerCase() === fallback.title.toLowerCase()
    );

    return matched
      ? { ...fallback, ...matched, iconComponent: fallback.icon }
      : { ...fallback, iconComponent: fallback.icon };
  });
};

function HomePage() {
  const { categories } = useData();
  const visibleCategories = getVisibleCategories(categories);

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#172033]">
      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#0f2238]">
        <img
          src="/images/banner/home-banner-2.png"
          alt="Thiết bị mạng doanh nghiệp"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#081827]/70" />
        <div className="relative mx-auto flex min-h-[560px] max-w-[1200px] flex-col justify-center px-4 py-12 text-white sm:px-6 lg:px-0">
          <div className="max-w-[720px]">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#69d2ff]">
              HAC Network Infrastructure
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-[64px]">
              Thiết bị mạng chính hãng cho hệ thống vận hành ổn định
            </h1>
            <p className="mt-6 max-w-[620px] text-base leading-7 text-white/82 sm:text-lg">
              Hoàng Anh cung cấp switch, wireless, firewall, server và module
              quang từ Cisco, Aruba, HPE, Dell, H3C, Lenovo và CoreEdge.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/switch"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#22a7df] px-6 text-base font-semibold text-white transition hover:bg-[#168ac0]"
              >
                Xem danh mục
                <ArrowRightOutlined className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/55 px-6 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
          <div className="mt-12 grid max-w-[760px] grid-cols-3 border-y border-white/18 py-5">
            {stats.map((item) => (
              <div key={item.label} className="pr-4">
                <div className="text-3xl font-bold text-white">
                  {item.value}
                </div>
                <div className="mt-1 text-sm uppercase text-white/65">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-0 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-0">
          {[
            "Tư vấn đúng cấu hình",
            "Sản phẩm có nguồn gốc rõ ràng",
            "Hỗ trợ triển khai và bảo hành",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 border-b border-[#e5edf4] py-4 md:border-b-0 md:border-r md:px-6 md:last:border-r-0"
            >
              <CheckCircleOutlined className="text-2xl text-[#18a058]" />
              <span className="text-base font-semibold text-[#24364a]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-0">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[#1b8fc2]">
              Danh mục trọng tâm
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#14243a]">
              Chọn nhanh nhóm thiết bị
            </h2>
          </div>
          <Link
            to="/switch"
            className="inline-flex items-center font-semibold text-[#1677b8] hover:text-[#0f5f96]"
          >
            Xem tất cả sản phẩm
            <ArrowRightOutlined className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category) => {
            const Icon = category.iconComponent || HddOutlined;

            return (
              <Link
                key={category.slug}
                to={`/${category.slug}`}
                className="group min-h-[184px] rounded-md border border-[#dfe8f0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#84c7e6] hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[#e8f6fc] text-2xl text-[#0b83bd]">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-[#15263b]">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#627086]">
                  {category.summary}
                </p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#168ac0]">
                  Khám phá
                  <ArrowRightOutlined className="ml-2 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-[#111d2d] py-14 text-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-[#69d2ff]">
                Thiết bị nổi bật
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Sẵn sàng cho access, core và mở rộng hạ tầng
              </h2>
              <p className="mt-4 leading-7 text-white/72">
                Ưu tiên các dòng sản phẩm có độ ổn định cao, dễ vận hành,
                phù hợp với văn phòng, nhà máy, trường học và doanh nghiệp.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {productHighlights.map((product) => (
                <Link
                  key={product.title}
                  to={product.href}
                  className="rounded-md border border-white/12 bg-white p-4 text-[#172033] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-32 items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-28 w-full object-contain"
                    />
                  </div>
                  <div className="mt-4 font-bold">{product.title}</div>
                  <div className="mt-2 text-sm text-[#66758c]">
                    Xem sản phẩm
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-0">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase text-[#1b8fc2]">
              Đối tác công nghệ
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#14243a]">
              Hãng thiết bị HAC đang phân phối
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex h-24 items-center justify-center rounded-md border border-[#e2e9f0] bg-[#fbfcfe] px-4"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-md bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase text-[#1b8fc2]">
              Quy trình làm việc
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#14243a]">
              Từ nhu cầu đến cấu hình triển khai
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                "Tiếp nhận nhu cầu và hiện trạng hệ thống",
                "Đề xuất cấu hình, mã hàng và phương án thay thế",
                "Bàn giao thiết bị, hỗ trợ kỹ thuật và bảo hành",
              ].map((step, index) => (
                <div key={step} className="border-l-2 border-[#22a7df] pl-4">
                  <div className="text-sm font-bold text-[#22a7df]">
                    0{index + 1}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#4c5b70]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-[#e8f6fc] p-8">
            <h3 className="text-2xl font-bold text-[#14243a]">
              Cần báo giá nhanh?
            </h3>
            <p className="mt-4 leading-7 text-[#4f6176]">
              Gửi danh sách model hoặc nhu cầu hệ thống, đội ngũ HAC sẽ hỗ trợ
              kiểm tra cấu hình và phản hồi phương án phù hợp.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#14243a] px-5 font-semibold text-white hover:bg-[#223a59]"
            >
              Gửi yêu cầu
              <ArrowRightOutlined className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
