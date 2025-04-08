// FilterDataContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect } from "react";

interface FilterData {
  categories: any[]; // Sử dụng kiểu dữ liệu phù hợp
  brands: any[];
}

const FilterDataContext = createContext<FilterData | undefined>(undefined);

export function FilterDataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    // Gọi API danh mục
    fetch("http://localhost:5000/api/Category/Get-all-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data))
      .catch((err) => console.log(err));

    // Gọi API thương hiệu
    fetch("http://localhost:5000/api/Brand/GetAllBrand")
      .then((res) => res.json())
      .then((data) => setBrands(data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <FilterDataContext.Provider value={{ categories, brands }}>
      {children}
    </FilterDataContext.Provider>
  );
}

export function useFilterData() {
  const context = useContext(FilterDataContext);
  if (!context) {
    throw new Error("useFilterData phải được sử dụng bên trong FilterDataProvider");
  }
  return context;
}
