import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [options, setOptions] = useState([]);
  const [series, setSeries] = useState(null);

  return (
    <DataContext.Provider
      value={{
        category,
        setCategory,
        categories,
        setCategories,
        brand,
        setBrand,
        filters,
        setFilters,
        options,
        setOptions,
        selectedSeries,
        setSelectedSeries,
        series,
        setSeries,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
