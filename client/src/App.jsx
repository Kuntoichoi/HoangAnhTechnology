import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";

import { ADMIN_URL } from "./constants/adminConstants";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import LoginAdmin from "./pages/admin/auth/LoginAdmin";
import HomeAdmin from "./pages/admin/dashboard/HomeAdmin";
import {
  ManageProduct,
  AddProduct,
  EditProduct,
  ViewProduct,
} from "./pages/admin/products";
import ManageBrand from "./pages/admin/brands/ManageBrand";
import ManageCategory from "./pages/admin/categories/ManageCategory";
import ManageFilter from "./pages/admin/filters/ManageFilter";
import ManageForm from "./pages/admin/resform/ManageForm";
import ManageSeries from "./pages/admin/series/ManageSeries";

// User Pages
import HomePage from "./pages/user/HomePage";
import ProductList from "./pages/user/ProductList";
import ProductDetail from "./pages/user/ProductDetail";
import CategoryBrands from "./pages/user/CategoryBrands";
import BrandProducts from "./pages/user/BrandProducts";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";

// Components
import ScrollToTop from "./components/user/ScrollToTop";
import BlogDetail from "./pages/user/blog/BlogDetail";
import BlogList from "./pages/user/blog/BlogList";

// Routes Configuration
const userRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "product-list/:categorySlug/:brandSlug?", element: <ProductList /> },
  { path: "product/:slug", element: <ProductDetail /> },
  { path: "about", element: <About /> },
  { path: "contact", element: <Contact /> },
  { path: "blog", element: <BlogList /> },
  { path: "blog/:slug", element: <BlogDetail /> },
  { path: ":categorySlug", element: <CategoryBrands /> },
  { path: ":categorySlug/:brandSlug", element: <BrandProducts /> },
];

const adminRoutes = [
  { path: "home-admin", element: <HomeAdmin /> },
  { path: "manage-product", element: <ManageProduct /> },
  { path: "manage-category", element: <ManageCategory /> },
  { path: "manage-brand", element: <ManageBrand /> },
  { path: "manage-option", element: <ManageFilter /> },
  { path: "manage-series", element: <ManageSeries /> },
  { path: "form", element: <ManageForm /> },
  { path: "manage-product/add-product", element: <AddProduct /> },
  { path: "manage-product/product/:productSlug", element: <EditProduct /> },
  {
    path: "manage-product/product/view/:productSlug",
    element: <ViewProduct />,
  },
];

function App() {
  const isLoggedIn = !!localStorage.getItem("adminToken");

  return (
    <DataProvider>
      <ScrollToTop />

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<MainLayout />}>
          {userRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Admin Login */}
        <Route
          path={`/${ADMIN_URL}/admin-login`}
          element={
            isLoggedIn ? (
              <Navigate to={`/${ADMIN_URL}/admin-login`} />
            ) : (
              <LoginAdmin />
            )
          }
        />

        {/* Admin Routes */}
        <Route path={ADMIN_URL} element={<AdminLayout />}>
          <Route
            index
            element={
              <Navigate
                to={isLoggedIn ? "home-admin" : "admin-login"}
                replace
              />
            }
          />
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;
