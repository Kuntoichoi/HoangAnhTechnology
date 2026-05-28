import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Spin,
  Pagination,
  Button,
  Tag,
  Select,
  Empty,
  Drawer,
  Badge,
  Alert,
} from "antd";
import axios from "../../utils/axiosConfig";
import Product from "../../components/user/Product";
import ProductBrandFilter from "../../components/user/ProductBrandFilter";
import Filter from "../../components/user/Filter";
import "./ProductList.css";

function ProductList() {
  const { categorySlug, brandSlug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [filters, setFilters] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [series, setSeries] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [sortType, setSortType] = useState("default");
  const [productLoading, setProductLoading] = useState(false);

  const itemsPerPage = 20;

  useEffect(() => {
    setSelectedBrand(null);
    setSelectedSeries(null);
    setBrand(null);
    setCurrentPage(1);
    setOptions([]);
    setSelectedTags([]);
    setSortType("default");
  }, [categorySlug]);

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`category/${categorySlug}`);
      setCategory(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching category:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  const fetchBrand = useCallback(async (brandSlug) => {
    if (!brandSlug) return null;
    try {
      const response = await axios.get(`brand/${brandSlug}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching brand:", error);
      return null;
    }
  }, []);

  const handleBrandSelect = async (brand) => {
    setProductLoading(true);
    setCurrentPage(1);
    if (!brand) {
      setSelectedBrand(null);
      setBrand(null);
      setProductLoading(false);
      return;
    }
    const fetchedBrand = await fetchBrand(brand.slug);
    if (fetchedBrand) {
      setSelectedBrand(fetchedBrand);
      setBrand(fetchedBrand);
    }
    setProductLoading(false);
  };

  useEffect(() => {
    fetchCategory();
    if (brandSlug) {
      fetchBrand(brandSlug).then((fetchedBrand) => {
        setSelectedBrand(fetchedBrand);
        setBrand(fetchedBrand);
      });
    } else {
      setSelectedBrand(null);
    }
  }, [fetchCategory, fetchBrand, brandSlug]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (selectedOptions) => {
    setOptions(selectedOptions.map((opt) => opt.id));
    setSelectedTags(selectedOptions);

    setCurrentPage(1);
    setShowMobileFilter(false);
  };

  const handleTempFilterChange = (selectedOptions) => {
    setTempSelectedTags(selectedOptions);
  };

  const handleApplyFilter = () => {
    setOptions(tempSelectedTags.map((opt) => opt.id));
    setSelectedTags(tempSelectedTags);
    setCurrentPage(1);
    setShowMobileFilter(false);
  };

  const handleSortChange = (value) => {
    setSortType(value);
    setCurrentPage(1);
  };

  const handleCloseMobileFilter = () => {
    setShowMobileFilter(false);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  const sortOptions = [
    { label: "Thứ tự mặc định", value: "default" },
    { label: "Giá thấp đến cao", value: "price_asc" },
    { label: "Giá cao đến thấp", value: "price_desc" },
    { label: "Sản phẩm nổi bật", value: "featured" },
  ];

  const breadcrumbItems = [
    {
      title: <Link to="/">Trang Chủ</Link>,
    },
    {
      title: category ? (
        <Link
          to={`/product-list/${category.slug}`}
          onClick={() => {
            setSelectedBrand(null);
            setSelectedSeries(null);
            setBrand(null);
            setCurrentPage(1);
            setOptions([]);
            setSelectedTags([]);
            setSortType("default");
          }}
          className={!brandSlug ? "font-bold text-black" : ""}
        >
          {category.title}
        </Link>
      ) : (
        "Loading..."
      ),
    },
    ...(selectedBrand
      ? [
          {
            title: selectedBrand.title,
            className: "text-gray-500 font-semibold",
          },
        ]
      : []),
  ];

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedBrand) count++;
    if (selectedSeries) count++;
    if (selectedTags.length > 0) count += selectedTags.length;
    return count;
  };

  const handleRemoveTag = (tagId) => {
    const newSelectedTags = selectedTags.filter((tag) => tag.id !== tagId);
    handleFilterChange(newSelectedTags); // Cập nhật lại filter
  };

  return (
    <div className="product-list-container">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Category Header */}
      {category && (
        <div style={{
          background: 'linear-gradient(135deg, #1a4c95 0%, #2968b8 100%)',
          color: 'white',
          padding: '32px 24px',
          borderRadius: '12px',
          marginBottom: '32px',
          boxShadow: '0 8px 24px rgba(26, 76, 149, 0.2)'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, marginBottom: '12px' }}>
            {category.title}
          </h1>
          <p style={{ fontSize: '16px', margin: 0, opacity: '0.95' }}>
            {category.description || `Khám phá bộ sưu tập ${category.title} của chúng tôi`}
          </p>
        </div>
      )}

      <div className="mobile-filter-button-container">
        <Button
          type="default"
          onClick={() => setShowMobileFilter(true)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="filter-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
          }
          className="filter-button"
        >
          <span>Bộ lọc</span>
          {getActiveFilterCount() > 0 && (
            <Badge count={getActiveFilterCount()} size="small" />
          )}
        </Button>
      </div>

      <div className="main-content">
        <div className="pt-3 hidden lg:block">
          {selectedTags.length > 0 && (
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(26, 76, 149, 0.08)',
              borderLeft: '4px solid #1a4c95'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Bộ lọc đã chọn:</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTags.map((tag) => (
                  <Tag
                    key={tag.id}
                    closable
                    onClose={() => handleRemoveTag(tag.id)}
                    className="text-xs"
                    color="processing"
                  >
                    {tag.title}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          <ProductBrandFilter
            categoryId={category?._id}
            onSelectBrand={handleBrandSelect}
            selectedBrand={selectedBrand}
            setSelectedSeries={setSelectedSeries}
            selectedSeries={selectedSeries}
            category={category}
            totalProducts={totalProducts}
            startItem={startItem}
            endItem={endItem}
          />
          {category && (
            <div className="additional-filter-section">
              <Filter
                filterData={category.filterIDs}
                onFilterChange={handleFilterChange}
                selectedTags={selectedTags}
                isMobile={false}
              />
            </div>
          )}
        </div>

        <div className="">
          {totalProducts > 0 && !loading && !error && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '24px',
              gap: '16px'
            }}>
              <div style={{
                background: 'white',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#666'
              }}>
                Hiển thị <span style={{ fontWeight: '600', color: '#1a4c95' }}>{startItem}-{endItem}</span> trong tổng <span style={{ fontWeight: '600', color: '#1a4c95' }}>{totalProducts}</span> sản phẩm
              </div>

              <div className="sorting-bar">
                <span className="sort-label">Sắp xếp theo:</span>
                <Select
                  value={sortType}
                  onChange={handleSortChange}
                  options={sortOptions}
                  className="sort-select"
                  size="middle"
                  popupMatchSelectWidth={false}
                />
              </div>
            </div>
          )}

          {loading || productLoading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="error-container">
              <Alert
                message="Lỗi tải dữ liệu"
                description="Không thể tải sản phẩm. Vui lòng thử lại sau."
                type="error"
                showIcon
              />
            </div>
          ) : (
            <div className="product-grid">
              <Product
                key={[
                  category?._id,
                  selectedBrand?._id,
                  selectedSeries,
                  currentPage,
                  itemsPerPage,
                  options.join(","),
                  sortType,
                ].join("-")}
                category={category}
                selectedBrand={selectedBrand}
                series={selectedSeries}
                page={currentPage}
                limit={itemsPerPage}
                setTotalProducts={setTotalProducts}
                options={options}
                sortType={sortType}
              />
            </div>
          )}

          {totalProducts > itemsPerPage && !loading && !error && (
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={totalProducts}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>

      <Drawer
        title="Bộ lọc sản phẩm"
        placement="left"
        onClose={handleCloseMobileFilter}
        open={showMobileFilter}
        width="85%"
        className="mobile-filter-drawer"
        footer={
          <div className="drawer-footer">
            <Button
              type="primary"
              onClick={handleApplyFilter}
              className="apply-filter-btn"
              block
            >
              Áp dụng ({tempSelectedTags.length} bộ lọc)
            </Button>
          </div>
        }
      >
        <div className="">
          <ProductBrandFilter
            categoryId={category?._id}
            onSelectBrand={handleBrandSelect}
            selectedBrand={selectedBrand}
            setSelectedSeries={setSelectedSeries}
            selectedSeries={selectedSeries}
            category={category}
          />

          {category && (
            <div className="additional-filter-section">
              <Filter
                key={category._id}
                filterData={category.filterIDs}
                onFilterChange={handleFilterChange}
                selectedTags={selectedTags}
                isMobile={false}
              />
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default ProductList;
