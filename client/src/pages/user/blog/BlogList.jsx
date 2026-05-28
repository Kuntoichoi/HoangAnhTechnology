import React from "react";
import { useNavigate } from "react-router-dom";

import BlogCard from "../../../components/user/blog/BlogCard";

const dummyBlogs = [
  {
    slug: "wifi-6-la-gi",
    title: "WiFi 6 là gì? Có nên nâng cấp?",
    excerpt:
      "Tìm hiểu công nghệ WiFi 6 và lý do tại sao nên nâng cấp hệ thống mạng doanh nghiệp.",
    image:
      "https://res.cloudinary.com/hac-cloud/image/upload/v1748485678/4333335_802_11_ac_wifi_800x450_ugkcbb.jpg",
    date: "2025-05-01",
  },
  {
    slug: "giai-phap-toi-uu-cho-mot-he-thong-van-hanh-muot-ma",
    title: "Giải Pháp Tối Ưu Cho Một Hệ Thống Vận Hành Mượt Mà",
    excerpt:
      "Danh sách những switch, router và access point được nhiều khách hàng lựa chọn nhất.",
    image:
      "https://res.cloudinary.com/hac-cloud/image/upload/v1748485289/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_ihqzvm.png",
    date: "2025-05-05",
  },
  {
    slug: "h3c-r4700-r4900-dac-biet",
    title: "H3C R4700 & R4900 Có Gì Đặc Biệt So Với Các Server Đầu Bảng",
    excerpt: "So sánh và phân tích chi tiết 2 model server nổi bật của H3C.",
    image:
      "https://res.cloudinary.com/hac-cloud/image/upload/v1747987948/H3C-logo_pca1ja.png",
    date: "2025-05-23",
  },
];

function BlogList() {
  const navigate = useNavigate();

  const handleClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tin tức & Bài viết</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyBlogs.map((blog) => (
          <div
            key={blog.slug}
            onClick={() => handleClick(blog.slug)}
            className="cursor-pointer"
          >
            <BlogCard {...blog} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
