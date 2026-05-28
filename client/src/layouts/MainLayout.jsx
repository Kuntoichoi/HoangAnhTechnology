// src/layouts/MainLayout.js
import React, { useState } from "react";
import Navbar from "../components/user/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/user/FooterLayout";
import RequestForm from "../components/user/RequestForm";

function MainLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full bg-secondary overflow-x-hidden">
      <Navbar />
      <div className="w-full pt-[125px] sm:pt-[145px] md:pt-[155px] lg:pt-[175px]">
        <Outlet />
      </div>
      <Footer />

      <div className="fixed bottom-4 left-4 z-50">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 text-center hover-scale pulse"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>

          <span>Yêu cầu tư vấn ngay</span>
        </a>
      </div>

      <RequestForm open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default MainLayout;
