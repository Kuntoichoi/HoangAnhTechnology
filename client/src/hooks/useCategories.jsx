import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";

const useCategories = () => {
  const [categoriesFetch, setCategoriesFetch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`category`);
        const data = await response.data;
        setCategoriesFetch(data);
      } catch (error) {
        setError(error);
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categoriesFetch, loading, error };
};

export default useCategories;
