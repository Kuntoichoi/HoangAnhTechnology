import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import { Input, Button, List, message, Card, Modal, Select } from "antd";

function ManageOption() {
  const [filters, setFilters] = useState([]);
  const [filterTitle, setFilterTitle] = useState("");
  const [editingFilterId, setEditingFilterId] = useState(null);
  const [optionTitles, setOptionTitles] = useState({});
  const [editingOption, setEditingOption] = useState(null);
  const [modalOptionTitle, setModalOptionTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const itemsPerPage = 5;
  const adminToken = localStorage.getItem("adminToken");

  const fetchFilters = async () => {
    try {
      const response = await axios.get("/filter", {
        headers: { Authorization: `Bearer ${adminToken}` },
        params: selectedCategory ? { categoryID: selectedCategory } : {},
      });
      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
      message.error("Lỗi khi lấy danh sách filter");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Lỗi khi lấy danh sách danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [selectedCategory]);

  const handleFilterSave = async () => {
    if (!filterTitle.trim()) {
      message.warning("Tiêu đề filter không được để trống");
      return;
    }

    try {
      if (editingFilterId) {
        const currentFilter = filters.find(
          (filter) => filter._id === editingFilterId
        );
        await axios.put(
          `/filter/${editingFilterId}`,
          {
            title: filterTitle,
            optionIDs: currentFilter.optionIDs,
          },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        setEditingFilterId(null);
      } else {
        await axios.post(
          "/filter",
          {
            title: filterTitle,
            optionIDs: [],
          },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
      }
      fetchFilters();
      setFilterTitle("");
    } catch (error) {
      console.error("Error creating/updating filter:", error);
      message.error("Lỗi khi thêm/cập nhật filter");
    }
  };

  const handleFilterDelete = async (filterID) => {
    try {
      await axios.delete(`/filter/${filterID}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchFilters();
    } catch (error) {
      console.error("Error creating/updating filter:", error);
      message.error("Lỗi khi thêm/cập nhật filter");
    }
  };

  const handleOptionCreate = async (filterID) => {
    const newOptionTitle = optionTitles[filterID] || "";
    if (!newOptionTitle.trim()) {
      message.warning("Tên option không được để trống");
      return;
    }

    try {
      const response = await axios.post(
        `/option`,
        { title: newOptionTitle, filterID },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      message.success("Đã thêm option thành công");

      const newOption = response.data;
      setFilters((prevFilters) =>
        prevFilters.map((filter) =>
          filter._id === filterID
            ? {
                ...filter,
                optionIDs: [...filter.optionIDs, newOption],
              }
            : filter
        )
      );

      setOptionTitles((prev) => ({ ...prev, [filterID]: "" }));
    } catch (error) {
      console.error("Error creating option:", error);
      message.error("Lỗi khi thêm option");
    }
  };

  const handleOptionEdit = async () => {
    if (!editingOption) return;

    try {
      await axios.put(
        `/option/${editingOption._id}`,
        { title: modalOptionTitle },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      message.success("Đã cập nhật option thành công");
      setFilters((prevFilters) =>
        prevFilters.map((filter) =>
          filter._id === editingOption.filterID
            ? {
                ...filter,
                optionIDs: filter.optionIDs.map((option) =>
                  option._id === editingOption._id
                    ? { ...option, title: modalOptionTitle }
                    : option
                ),
              }
            : filter
        )
      );

      setEditingOption(null);
    } catch (error) {
      console.error("Error updating option:", error);
      message.error("Lỗi khi cập nhật option");
    }
  };

  const handleOptionDelete = async (optionId) => {
    try {
      await axios.delete(`/option/${optionId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      message.success("Đã xóa option thành công");

      fetchFilters();
    } catch (error) {
      console.error("Error deleting option:", error);
      message.error("Lỗi khi xóa option");
    }
  };

  const moveOption = async (filterID, index, direction) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) => {
        if (filter._id !== filterID) return filter;

        const newOptionIDs = [...filter.optionIDs];
        const newIndex = index + direction;

        // Đổi chỗ hai option
        [newOptionIDs[index], newOptionIDs[newIndex]] = [
          newOptionIDs[newIndex],
          newOptionIDs[index],
        ];

        return { ...filter, optionIDs: newOptionIDs };
      })
    );

    try {
      const response = await axios.put(
        `/filter/${filterID}`,
        {
          optionIDs: filters
            .find((f) => f._id === filterID)
            .optionIDs.map((opt) => opt._id),
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      message.success("Đã cập nhật thứ tự thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật thứ tự option:", error);
      message.error("Lỗi khi lưu thứ tự mới");
    }
  };

  const showEditModal = (option) => {
    setEditingOption(option);
    setModalOptionTitle(option.title);
  };

  const indexOfLastFilter = currentPage * itemsPerPage;
  const indexOfFirstFilter = indexOfLastFilter - itemsPerPage;
  const currentFilters = filters.slice(indexOfFirstFilter, indexOfLastFilter);
  const totalPages = Math.ceil(filters.length / itemsPerPage);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Quản lý Filter và Option
      </h1>

      <Card className="mb-8 shadow-lg rounded-xl border-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Quản lý Filter
          </h2>
          <div className="flex gap-3">
            <Select
              placeholder="Chọn danh mục"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              className="w-64"
              size="large"
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.title}
                </Select.Option>
              ))}
            </Select>

            <Input
              placeholder="Tiêu đề filter"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              className="w-64"
              size="large"
            />
            <Button
              type="primary"
              onClick={handleFilterSave}
              size="large"
              className="bg-blue-500 hover:bg-blue-600"
            >
              {editingFilterId ? "Cập nhật Filter" : "Thêm Filter"}
            </Button>
          </div>
        </div>

        <List
          bordered={false}
          dataSource={currentFilters}
          className="bg-white rounded-xl divide-y"
          renderItem={(filter) => (
            <List.Item className="hover:bg-gray-50 p-6 first:rounded-t-xl last:rounded-b-xl">
              <div className="flex flex-col w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium text-gray-700">
                    {filter.title}
                  </span>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleFilterDelete(filter._id)}
                      danger
                      className="hover:opacity-90 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Xóa
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingFilterId(filter._id);
                        setFilterTitle(filter.title);
                      }}
                      type="primary"
                      ghost
                      className="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filter.optionIDs.length === 0 ? (
                    <span className="text-gray-500 italic">
                      Không có option nào.
                    </span>
                  ) : (
                    filter.optionIDs.map((option, index) => (
                      <div
                        key={option._id}
                        className="flex justify-between items-center border rounded-md p-2 hover:border-blue-400 transition-colors"
                      >
                        <p
                          className="truncate flex-1 mr-2"
                          title={option.title}
                        >
                          {option.title}
                        </p>
                        <div className="flex shrink-0">
                          {/* Nút Di chuyển lên */}
                          <Button
                            type="text"
                            onClick={() => moveOption(filter._id, index, -1)}
                            disabled={index === 0}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            🔼
                          </Button>
                          {/* Nút Di chuyển xuống */}
                          <Button
                            type="text"
                            onClick={() => moveOption(filter._id, index, 1)}
                            disabled={index === filter.optionIDs.length - 1}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            🔽
                          </Button>
                          <Button
                            type="text"
                            onClick={() => handleOptionDelete(option._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </Button>
                          <Button
                            type="text"
                            onClick={() =>
                              showEditModal({ ...option, filterID: filter._id })
                            }
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tên option mới"
                      value={optionTitles[filter._id] || ""}
                      onChange={(e) =>
                        setOptionTitles((prev) => ({
                          ...prev,
                          [filter._id]: e.target.value,
                        }))
                      }
                      className="flex-1"
                    />
                    <Button
                      type="primary"
                      onClick={() => handleOptionCreate(filter._id)}
                      className="flex items-center justify-center h-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />

        <div className="flex justify-between items-center mt-6">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            type="default"
            className="flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Trước
          </Button>
          <span className="text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            type="default"
            className="flex items-center gap-1"
          >
            Sau
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Button>
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa Option"
        open={!!editingOption}
        onOk={handleOptionEdit}
        onCancel={() => setEditingOption(null)}
        className="rounded-xl"
        okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600" }}
      >
        <Input
          value={modalOptionTitle}
          onChange={(e) => setModalOptionTitle(e.target.value)}
          className="mt-4"
          size="large"
        />
      </Modal>
    </div>
  );
}

export default ManageOption;
