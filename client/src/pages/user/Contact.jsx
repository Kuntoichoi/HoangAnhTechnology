import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="w-full flex justify-center items-center px-4 lg:px-0">
      <div className="max-w-[1200px] flex flex-col gap-3 w-full">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang Chủ</Link> },
            { title: "Liên Hệ" },
          ]}
          className="w-full py-3"
        />

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Thông Tin Liên Hệ</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-2">
                HOANG ANH IT DEVELOPMENT CO.,LTD
              </h2>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
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
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  74/28 Trương Quốc Dung, Phường 10, Quận Phú Nhuận, Tp HCM
                </p>

                <p className="flex items-center gap-2">
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
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  Tel: (028) 399 70 399 hoặc: (028) 399 70 398
                </p>

                <p className="flex items-center gap-2">
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
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  Email: info@hac.com.vn
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Các Bộ Phận</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Phòng kinh doanh:</h3>
                  <p className="text-gray-600">Mr Trung Trần</p>
                  <p className="text-gray-600">SĐT: 090 830 1313</p>
                  <p className="text-gray-600">Email: trungtran@hac.com.vn</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">
                    Phòng kỹ thuật - Hỗ trợ bảo hành:
                  </h3>
                  <p className="text-gray-600">Mr Hưng</p>
                  <p className="text-gray-600">SĐT: 097 405 3061</p>
                  <p className="text-gray-600">Email: hungnguyen@hac.com.vn</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Phòng kế toán:</h3>
                  <p className="text-gray-600">SĐT: 028 399 70 399</p>
                  <p className="text-gray-600">Email: info@hac.com.vn</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Thông Tin Khác</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Tài khoản số: 1670342339 Tại Ngân Hàng ACB-CN Nguyễn Văn Trỗi
                </p>
                <p>Mã số thuế: 0312474252</p>
                <a href="https://hac.com.vn">
                  Website:{" "}
                  <span className="underline text-primary">
                    https://hac.com.vn
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
