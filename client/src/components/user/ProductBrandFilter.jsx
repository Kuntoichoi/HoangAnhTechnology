import React, { useEffect, useState } from "react";
import {
  Collapse,
  Checkbox,
  Spin,
  Alert,
  ConfigProvider,
  Badge,
  Tooltip,
  Empty,
  Card,
  Input,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";

const ProductBrandFilter = ({
  categoryId,
  onSelectBrand,
  selectedBrand,
  setSelectedSeries,
  selectedSeries,
  category,
}) => {
  const { categorySlug, brandSlug } = useParams();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSeriesData, setAllSeriesData] = useState({});
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [seriesBrandMap, setSeriesBrandMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const fetchBrands = async () => {
      setLoading(true);
      try {
        const responseBrand = await axios.get(
          `/brand?categoryIDs=${categoryId}`
        );

        const newExpanded = {};
        responseBrand.data.forEach((brand) => {
          newExpanded[brand._id] = false;
        });
        setExpanded(newExpanded);
        setBrands(responseBrand.data);
        await fetchAllSeries(responseBrand.data, categoryId);
      } catch (error) {
        setError("Error loading brands. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [categoryId]);

  const fetchAllSeries = async (brandsData, categoryId) => {
    if (!brandsData || !brandsData.length || !categoryId) return;
    setSeriesLoading(true);
    const seriesDataByBrand = {};
    const seriesMapping = {};

    try {
      const fetchPromises = brandsData.map(async (brand) => {
        const params = new URLSearchParams();
        params.append("categoryID", categoryId);
        params.append("brandID", brand._id);

        try {
          const response = await axios.get(`series?${params.toString()}`);
          if (response.data && response.data.data) {
            const sortedSeries = response.data.data.sort((a, b) =>
              a.title.localeCompare(b.title)
            );
            seriesDataByBrand[brand._id] = sortedSeries;
            sortedSeries.forEach((series) => {
              seriesMapping[series._id] = brand._id;
            });
          }
        } catch (error) {
          console.error(
            `Error fetching series for brand ${brand.title}:`,
            error
          );
          seriesDataByBrand[brand._id] = [];
        }
      });

      await Promise.all(fetchPromises);
      setAllSeriesData(seriesDataByBrand);
      setSeriesBrandMap(seriesMapping);
    } catch (error) {
      console.error("Error fetching all series data:", error);
    } finally {
      setSeriesLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelectSeries = (seriesId) => {
    const brandId = seriesBrandMap[seriesId];
    if (brandId) {
      const brand = brands.find((b) => b._id === brandId);
      if (brand) {
        onSelectBrand(brand);
        setSelectedSeries(seriesId);
      }
    }
  };

  const handleSelectBrand = (brand) => {
    onSelectBrand(brand);
    setSelectedSeries(null);
  };

  const renderBrandsList = () => {
    return (
      <div className="px-4">
        <div className="border-b-[1px] border-t-[1px] pt-4 border-grey">
          <div
            className="text-base font-medium cursor-pointer justify-between flex pb-4 items-center"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <span>Dòng sản phẩm</span>{" "}
            <span className="text-lg">{isCollapsed ? "+" : "−"}</span>
          </div>
          {!isCollapsed &&
            brands.length > 0 &&
            brands.map((brand) => (
              <div key={brand._id} className="">
                <div className="flex items-center mb-1">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgContainer: "",
                        colorBorder: "#000",
                      },
                    }}
                  >
                    <Checkbox
                      className="text-sm font-medium"
                      onChange={() => handleSelectBrand(brand)}
                      checked={selectedBrand?._id === brand._id}
                      style={{ background: "transparent" }}
                    >
                      {brand.title}
                    </Checkbox>
                  </ConfigProvider>
                  <button
                    className="ml-auto text-gray-500 hover:text-gray-700 px-1 flex items-center justify-center text-xl"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [brand._id]: !prev[brand._id],
                      }))
                    }
                  >
                    {expanded[brand._id] ? "−" : "+"}
                  </button>
                </div>
                {expanded[brand._id] && (
                  <div className="ml-4">
                    <Input
                      placeholder="Tìm kiếm series..."
                      allowClear
                      onChange={handleSearch}
                      className="mb-4 border border-black rounded-md p-1 px-2 text-sm"
                      style={{ background: "transparent" }}
                    />
                    <div className="max-h-[300px] overflow-y-auto">
                      {seriesLoading ? (
                        <div className="flex justify-center py-2">
                          <Spin size="small" />
                        </div>
                      ) : allSeriesData[brand._id]?.length > 0 ? (
                        allSeriesData[brand._id]
                          .filter((series) =>
                            series.title.toLowerCase().includes(searchTerm)
                          )
                          .map((series) => (
                            <div key={series._id} className="mb-2">
                              <ConfigProvider
                                theme={{
                                  token: {
                                    colorBgContainer: "",
                                    colorBorder: "#000",
                                  },
                                }}
                              >
                                <Checkbox
                                  className="text-xs"
                                  onChange={() =>
                                    handleSelectSeries(series._id)
                                  }
                                  checked={selectedSeries === series._id}
                                >
                                  {series.title}
                                </Checkbox>
                              </ConfigProvider>
                            </div>
                          ))
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <ConfigProvider>
      <Card style={{ border: "none" }}>{renderBrandsList()}</Card>
    </ConfigProvider>
  );
};

export default ProductBrandFilter;
