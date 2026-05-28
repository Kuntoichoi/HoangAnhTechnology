import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { message } from "antd";

export const useFetchData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url || url.includes("undefined")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(url, { headers });
      setData(response.data);
    } catch (error) {
      setError(error);
      console.error("Fetch error:", error);
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData, setData };
};
