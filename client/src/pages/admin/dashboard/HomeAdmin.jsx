import React from "react";
import { Card, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import {
  ShoppingOutlined,
  TagsOutlined,
  AppstoreOutlined,
  FormOutlined,
  BranchesOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ADMIN_URL } from "../../../constants/adminConstants";

function HomeAdmin() {
  const adminMenus = [
    {
      title: "Quản lý Sản phẩm",
      icon: <ShoppingOutlined className="text-2xl" />,
      path: `/${ADMIN_URL}/manage-product`,
      description: "Thêm, sửa, xóa và quản lý sản phẩm",
    },
    {
      title: "Quản lý Thương hiệu",
      icon: <TagsOutlined className="text-2xl" />,
      path: `/${ADMIN_URL}/manage-brand`,
      description: "Quản lý các thương hiệu sản phẩm",
    },
    {
      title: "Quản lý Danh mục",
      icon: <AppstoreOutlined className="text-2xl" />,
      path: `/${ADMIN_URL}/manage-category`,
      description: "Quản lý danh mục sản phẩm",
    },
    {
      title: "Quản lý Form",
      icon: <FormOutlined className="text-2xl" />,
      path: `/${ADMIN_URL}/form`,
      description: "Xem và quản lý các form liên hệ",
    },
    {
      title: "Quản lý Series",
      icon: <BranchesOutlined className="text-2xl" />,
      path: `/${ADMIN_URL}/manage-series`,
      description: "Quản lý các dòng sản phẩm",
    },
    {
      title: "Quản lý Filter & Option",
      icon: <FilterOutlined className="text-2xl" />,
      path: `/${ADMIN_URL}/manage-option`,
      description: "Quản lý bộ lọc và tùy chọn",
    },
    {
      title: "Thêm Sản Phẩm",
      icon: <PlusOutlined className="text-2xl" />,
      path: `/${ADMIN_URL}/manage-product/add-product`,
      description: "Thêm sản phẩm mới vào hệ thống",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trang Quản Trị</h1>
      </div>
      <Row gutter={[16, 16]}>
        {adminMenus.map((menu, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Link to={menu.path}>
              <Card
                hoverable
                className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="text-primary p-4 bg-primary/5 rounded-full">
                    {menu.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{menu.title}</h3>
                    <p className="text-gray-500 text-sm">{menu.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HomeAdmin;
