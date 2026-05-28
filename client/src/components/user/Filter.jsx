import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card, Checkbox, Spin, Empty, ConfigProvider, Radio } from "antd";
import axios from "../../utils/axiosConfig";

const Filter = ({
  filterData,
  onFilterChange,
  selectedTags = [],
  isMobile = false,
  onTempFilterChange = null,
}) => {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedOptions, setSelectedOptions] = useState(selectedTags);
  const [tempSelectedOptions, setTempSelectedOptions] = useState(selectedTags);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    isMobile
      ? setTempSelectedOptions(selectedTags)
      : setSelectedOptions(selectedTags);
  }, [selectedTags, isMobile]);

  useEffect(() => {
    if (filterData.length === 0) return;
    setOptions({});
    setSelectedOptions([]);
    filterData.forEach(({ _id }) => fetchOptions(_id));
  }, [filterData]);

  const fetchOptions = useCallback(async (filterID) => {
    setLoading((prev) => ({ ...prev, [filterID]: true }));
    try {
      const response = await axios.get(`/option?filterID=${filterID}`);
      setOptions((prev) => ({
        ...prev,
        [filterID]: {
          items: response.data
            .map(({ _id, title, count = 0 }) => ({ id: _id, title, count }))
            .sort((a, b) => {
              const titleA = a.title.toLowerCase();
              const titleB = b.title.toLowerCase();
              if (titleA === titleB) return a.count - b.count;
              return titleA.localeCompare(titleB, undefined, { numeric: true });
            }),
        },
      }));
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptions((prev) => ({
        ...prev,
        [filterID]: { hierarchical: false, items: [] },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [filterID]: false }));
    }
  }, []);

  const handleOptionChange = useCallback(
    (optionId, optionTitle, filterTitle) => {
      let newOptions;

      if (
        filterTitle === "Số Cổng" ||
        filterTitle === "Switch Type" ||
        filterTitle == "Routing/Switching Feature"
      ) {
        // Chỉ cho phép chọn một giá trị duy nhất
        newOptions = [
          ...selectedOptions.filter((opt) => opt.filterTitle !== filterTitle),
          { id: optionId, title: optionTitle, filterTitle },
        ];
      } else {
        newOptions = selectedOptions.some((opt) => opt.id === optionId)
          ? selectedOptions.filter((opt) => opt.id !== optionId)
          : [
              ...selectedOptions,
              { id: optionId, title: optionTitle, filterTitle },
            ];
      }

      if (isMobile) {
        setTempSelectedOptions(newOptions);
        onTempFilterChange?.(newOptions);
      } else {
        setSelectedOptions(newOptions);
        onFilterChange(newOptions);
      }
    },
    [isMobile, selectedOptions, onFilterChange, onTempFilterChange]
  );

  const toggleExpanded = useCallback((filterID) => {
    setExpanded((prev) => ({
      ...prev,
      [filterID]: !prev[filterID],
    }));
  }, []);

  const renderFilter = useCallback(
    (filterData, filterTitle, filterID) => {
      if (!filterData?.items?.length) {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có tùy chọn"
            className="py-4"
          />
        );
      }

      const isRadioFilter =
        filterTitle === "Số Cổng" ||
        filterTitle === "Switch Type" ||
        filterTitle === "Routing/Switching Feature";
      const selectedValue = (
        isMobile ? tempSelectedOptions : selectedOptions
      ).find((opt) => opt.filterTitle === filterTitle)?.id;

      return (
        <div className="grid gap-2 border-b-[1px] border-grey py-3 pt-4">
          <div
            className="text-base font-medium cursor-pointer flex justify-between"
            onClick={() => toggleExpanded(filterID)}
          >
            <span>{filterTitle}</span>
            <span className="text-lg">{expanded[filterID] ? "-" : "+"}</span>
          </div>
          {expanded[filterID] &&
            (isRadioFilter ? (
              <Radio.Group
                onChange={(e) =>
                  handleOptionChange(
                    e.target.value,
                    filterData.items.find((item) => item.id === e.target.value)
                      ?.title,
                    filterTitle
                  )
                }
                value={selectedValue} // Đặt value đúng với Radio
                className={`grid gap-2 items-center ${
                  filterTitle == "Switch Type" ||
                  filterTitle == "Routing/Switching Feature"
                    ? "grid-cols-1"
                    : "grid-cols-2"
                }`}
              >
                {filterData.items.map(({ id, title }) => (
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBorder: "#000",
                      },
                    }}
                  >
                    <Radio key={id} value={id} className="text-sm">
                      {title}
                    </Radio>
                  </ConfigProvider>
                ))}
              </Radio.Group>
            ) : (
              filterData.items.map(({ id, title }) => (
                <ConfigProvider
                  theme={{
                    token: {
                      colorBorder: "#000",
                    },
                  }}
                >
                  <Checkbox
                    key={id}
                    className="text-sm"
                    onChange={() => handleOptionChange(id, title, filterTitle)}
                    checked={(isMobile
                      ? tempSelectedOptions
                      : selectedOptions
                    ).some((opt) => opt.id === id)}
                  >
                    {title}
                  </Checkbox>
                </ConfigProvider>
              ))
            ))}
        </div>
      );
    },
    [
      handleOptionChange,
      isMobile,
      selectedOptions,
      tempSelectedOptions,
      expanded,
      toggleExpanded,
    ]
  );

  return (
    <Card
      bordered={false}
      className=" rounded-lg shadow-sm pb-10"
      style={{ background: "transparent" }}
    >
      <ConfigProvider
        theme={{
          components: {
            Checkbox: { colorPrimary: "#1890ff" },
          },
        }}
      >
        <div className="px-4">
          {filterData.map(({ _id, title }) => (
            <div key={_id}>
              {loading[_id] ? (
                <div className="flex justify-center items-center py-6">
                  <Spin tip="Đang tải..." />
                </div>
              ) : (
                renderFilter(options[_id], title, _id)
              )}
            </div>
          ))}
        </div>
      </ConfigProvider>
    </Card>
  );
};

export default React.memo(Filter);
