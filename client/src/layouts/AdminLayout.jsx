import React from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/admin/layout/NavbarAdmin";

function AdminLayout() {
  return (
    <div className="flex">
      <NavbarAdmin />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
