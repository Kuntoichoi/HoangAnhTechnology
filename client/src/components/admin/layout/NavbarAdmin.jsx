import React from "react";
import { Menu, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_URL } from "../../../constants/adminConstants";

const items = [
  {
    key: "home",
    label: "Trang Chủ",
  },
  {
    key: "category",
    label: "Quản Lý Danh Mục Sản Phẩm",
  },
  {
    key: "brand",
    label: "Quản Lý Danh Mục Hãng",
  },
  {
    key: "product",
    label: "Quản Lý Sản Phẩm",
  },
  {
    key: "option",
    label: "Quản Lý Thuộc Tính",
  },
  {
    key: "series",
    label: "Quản Lý Dòng Sản Phẩm",
  },
  {
    key: "form",
    label: "Yêu Cầu Khách Hàng",
  },
  { type: "divider" },
  { key: "logout", label: "Đăng Xuất" },
];

function NavbarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = () => {
    if (location.pathname.includes(`/${ADMIN_URL}/manage-product`)) {
      return "product";
    }

    if (location.pathname.includes(`/${ADMIN_URL}/manage-brand`)) {
      return "brand";
    }

    if (location.pathname.includes(`/${ADMIN_URL}/manage-category`)) {
      return "category";
    }

    if (location.pathname.includes(`/${ADMIN_URL}/manage-option`)) {
      return "option";
    }

    if (location.pathname.includes(`/${ADMIN_URL}/form`)) {
      return "form";
    }

    if (location.pathname.includes(`/${ADMIN_URL}/manage-series`)) {
      return "series";
    }
    return items.find((item) => item.path === location.pathname)?.key || "home";
  };

  const handleMenuClick = (key) => {
    const routes = {
      home: `/${ADMIN_URL}/home-admin`,
      product: `/${ADMIN_URL}/manage-product`,
      brand: `/${ADMIN_URL}/manage-brand`,
      category: `/${ADMIN_URL}/manage-category`,
      option: `/${ADMIN_URL}/manage-option`,
      series: `/${ADMIN_URL}/manage-series`,
      form: `/${ADMIN_URL}/form`,
      logout: () => {
        localStorage.removeItem("adminToken");
        message.success("Đăng xuất thành công!");
        navigate(`/${ADMIN_URL}/admin-login`);
      },
    };

    if (routes[key]) {
      if (typeof routes[key] === "function") {
        routes[key]();
      } else {
        navigate(routes[key]);
      }
    } else {
      console.log("click ", key);
    }
  };

  return (
    <div className="bg-white shadow-md sticky left-0 bottom-0 top-0 z-20 h-[100vh]">
      <div className="w-full justify-center flex py-4">
        <img
          src="/images/hac-logo/logo-pri.png"
          className="w-[70px] h-[70px]"
          alt="Logo"
        />
      </div>
      <Menu
        onClick={({ key }) => handleMenuClick(key)}
        style={{ width: 256 }}
        mode="inline"
        selectedKeys={[selectedKey()]}
        items={items.map((item) => ({
          ...item,
          ...(item.path ? { onClick: () => handleMenuClick(item.key) } : {}),
        }))}
      />
    </div>
  );
}

export default NavbarAdmin;
