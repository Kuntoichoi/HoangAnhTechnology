import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryList from "./CategoryList";
import { Menu, Input, Drawer } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { Carousel } from "antd";

import useCategories from "../../hooks/useCategories";
import { useData } from "../../contexts/DataContext";
import SearchResult from "./SearchResult";
import MobileCategoryList from "./MobileCategoryList";

const items = [
  {
    key: "sub1",
    label: "Navigation One",
    icon: <MailOutlined />,
    children: [
      {
        key: "g1",
        label: "Item 1",
        type: "group",
        children: [
          {
            key: "1",
            label: "Option 1",
          },
          {
            key: "2",
            label: "Option 2",
          },
        ],
      },
      {
        key: "g2",
        label: "Item 2",
        type: "group",
        children: [
          {
            key: "3",
            label: "Option 3",
          },
          {
            key: "4",
            label: "Option 4",
          },
        ],
      },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "5",
        label: "Option 5",
      },
      {
        key: "6",
        label: "Option 6",
      },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          {
            key: "7",
            label: "Option 7",
          },
          {
            key: "8",
            label: "Option 8",
          },
        ],
      },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "sub4",
    label: "Navigation Three",
    icon: <SettingOutlined />,
    children: [
      {
        key: "9",
        label: "Option 9",
      },
      {
        key: "10",
        label: "Option 10",
      },
      {
        key: "11",
        label: "Option 11",
      },
      {
        key: "12",
        label: "Option 12",
      },
    ],
  },
  {
    key: "grp",
    label: "Group",
    type: "group",
    children: [
      {
        key: "13",
        label: "Option 13",
      },
      {
        key: "14",
        label: "Option 14",
      },
    ],
  },
];

const EMAIL = "trungtran@hac.com.vn";

const Navbar = () => {
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const searchContainerRef = useRef(null);

  const { categoriesFetch, loading, error } = useCategories();
  const { categories, setCategories } = useData();

  useEffect(() => {
    setCategories(categoriesFetch);
  }, [categoriesFetch, setCategories]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearchResult(false);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCategoryList = () => {
    setShowCategoryList(!showCategoryList);
  };

  const closeCategoryList = () => {
    setShowCategoryList(false);
  };

  const closeSearchResult = () => {
    setShowSearchResult(false);
    setSearchValue("");
  };

  if (error) {
    console.error("Error fetching categories:", error);
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const contentStyle = {
    margin: 0,
    height: "30px",
    color: "#fff",
    lineHeight: "30px",
    textAlign: "center",
    background: "#364d79",
  };
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <>
        <Carousel
          arrows
          infinite={true}
          dots={false}
          autoplay
          autoplaySpeed={3000}
        >
          <div>
            <h3 style={contentStyle}>Freeship Nội Thành TP.HCM</h3>
          </div>
          <div>
            <h3 style={contentStyle}>
              Địa chỉ: 74/28 Trương Quốc Dung, Phường 10, Quận Phú Nhuận, Tp.
              HCM
            </h3>
          </div>
          <div>
            <h3 style={contentStyle}>Liên Hệ: 028 399 70 399</h3>
          </div>
          <div>
            <h3 style={contentStyle}>Email: trungtran@hac.com.vn</h3>
          </div>
        </Carousel>
      </>
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4">
        <ul className="flex items-center justify-between py-2 sm:py-3 gap-4 xl:gap-6">
          <li className="xl:hidden">
            <button onClick={() => setShowMobileMenu(true)} className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </li>
          <li className="shrink-0">
            <Link to="/">
              <img
                src={
                  windowWidth < 1280
                    ? "/images/hac-logo/logo-pri.png"
                    : "/images/hac-logo/logo-sec.png"
                }
                alt="Logo"
                className="w-[40px] sm:w-[40px] md:w-[35px] xl:w-[120px]"
              />
            </Link>
          </li>
          <div className="hidden xl:flex shrink-0">
            <li
              className="flex items-center space-x-2 h-[45px] md:h-[50px] px-5 rounded bg-primary text-base cursor-pointer text-white shadow-sm"
              onClick={toggleCategoryList}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
              <p className="font-medium">Danh mục sản phẩm</p>
            </li>
          </div>

          {/* Desktop CategoryList */}
          {showCategoryList && (
            <div className="absolute top-[185px] left-1/2 hidden xl:block w-[1200px] -translate-x-1/2 overflow-visible">
              <div
                className="fixed top-0 left-0 right-0 bottom-0 bg-black transition-opacity duration-300 ease-in-out"
                style={{
                  opacity: showCategoryList ? 0.2 : 0,
                }}
                onClick={closeCategoryList}
              ></div>
              <div className="relative z-20 flex justify-start">
                <div
                  className={`transform transition-transform duration-300 ease-in-out ${
                    showCategoryList
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-4 opacity-0"
                  }`}
                >
                  <CategoryList
                    loading={loading}
                    onClose={() => setShowCategoryList(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {showMenu && (
            <Menu
              style={{ width: 256 }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              items={items}
            />
          )}
          <li className="relative flex-1" ref={searchContainerRef}>
            <div className="flex items-center border-solid border-[1px] rounded-md text-grey border-[#868686] bg-white h-[45px] md:h-[50px]">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full text-black border-none h-full rounded-md"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setShowSearchResult(true)}
                allowClear
                suffix={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 md:size-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                }
              />
            </div>

            {showSearchResult && searchValue && (
              <div className="absolute top-full left-0 w-full mt-1 ">
                <SearchResult
                  searchValue={searchValue}
                  onClose={closeSearchResult}
                />
              </div>
            )}
          </li>
          <li className="text-primary items-center space-x-[10px] p-[15px] hidden md:flex shrink-0">
            <div>
              <svg
                fill="currentColor"
                height="25px"
                width="25px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 473.806 473.806"
                xmlSpace="preserve"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <g>
                      <path d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4 c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8 c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6 c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5 c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26 c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9 c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z M410.256,398.806 C410.156,398.806,410.156,398.906,410.256,398.806c-3.9,4.2-7.9,8-12.2,12.2c-6.5,6.2-13.1,12.7-19.3,20 c-10.1,10.8-22,15.9-37.6,15.9c-1.5,0-3.1,0-4.6-0.1c-29.7-1.9-57.3-13.5-78-23.4c-56.6-27.4-106.3-66.3-147.6-115.6 c-34.1-41.1-56.9-79.1-72-119.9c-9.3-24.9-12.7-44.3-11.2-62.6c1-11.7,5.5-21.4,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1 c6.3,0,11.4,3.8,14.6,7c0.1,0.1,0.2,0.2,0.3,0.3c6.1,5.7,11.9,11.6,18,17.9c3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3 c10.6,10.6,10.6,20.4,0,31c-2.9,2.9-5.7,5.8-8.6,8.6c-8.4,8.6-16.4,16.6-25.1,24.4c-0.2,0.2-0.4,0.3-0.5,0.5 c-8.6,8.6-7,17-5.2,22.7c0.1,0.3,0.2,0.6,0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8 c4.1,2.6,8.3,4.7,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3c0.4,0.2,0.8,0.5,1.2,0.7c3.4,1.7,6.6,2.5,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9 l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5c6.2,0,11.3,3.9,14.4,7.3c0.1,0.1,0.1,0.1,0.2,0.2l55.1,55.1 C420.456,377.706,420.456,388.206,410.256,398.806z"></path>{" "}
                      <path d="M256.056,112.706c26.2,4.4,50,16.8,69,35.8s31.3,42.8,35.8,69c1.1,6.6,6.8,11.2,13.3,11.2c0.8,0,1.5-0.1,2.3-0.2 c7.4-1.2,12.3-8.2,11.1-15.6c-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3,3.7-15.6,11 S248.656,111.506,256.056,112.706z"></path>{" "}
                      <path d="M473.256,209.006c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2,3.7-15.5,11 c-1.2,7.4,3.7,14.3,11.1,15.6c46.6,7.9,89.1,30,122.9,63.7c33.8,33.8,55.8,76.3,63.7,122.9c1.1,6.6,6.8,11.2,13.3,11.2 c0.8,0,1.5-0.1,2.3-0.2C469.556,223.306,474.556,216.306,473.256,209.006z"></path>{" "}
                    </g>
                  </g>
                </g>
              </svg>
            </div>

            <div className="font-normal text-sm lg:block hidden">
              <Link to="/contact">Liên Hệ</Link>
              <p>028 399 70 399</p>
            </div>
          </li>
          <li className="hidden md:flex text-primary items-center space-x-[10px] p-[15px] shrink-0">
            <a href={`mailto:${EMAIL}?subject=Hỏi thông tin&body=Chào bạn!`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </a>
            <div className="font-normal text-sm lg:block hidden">
              <p>Email</p>
              <p>{EMAIL}</p>
            </div>
          </li>
        </ul>

        <ul className="items-center justify-center space-x-[15px] sm:space-x-[30px] py-2 sm:py-3 lg:text-sm text-xs text-primary bg-white flex border-t border-gray-100">
          <Link to="about" className="py-1">
            Giới Thiệu
          </Link>
          <div className="border-l border-grey h-6" />
          <Link to="/contact" className="py-1">
            Liên Hệ
          </Link>
          <div className="border-l border-grey h-6" />

          <Link to="/blog" className="py-1">
            Tin Tức
          </Link>
        </ul>

        {/* Mobile Drawer with MobileCategoryList */}
        <Drawer
          placement="left"
          onClose={() => setShowMobileMenu(false)}
          open={showMobileMenu}
          width="100%"
          className="mobile-drawer"
          closable={false}
        >
          <MobileCategoryList onClose={() => setShowMobileMenu(false)} />
        </Drawer>
      </div>
    </header>
  );
};

export default Navbar;
