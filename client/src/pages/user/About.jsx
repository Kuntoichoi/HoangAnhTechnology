import React from "react";

function About() {
  return (
    <div className="w-full">
      {/* Banner section với hiệu ứng gradient tốt hơn */}
      <div className="w-full relative h-[500px] overflow-hidden">
        <img
          src="/images/banner/about-banner.png"
          alt="Hoang Anh Technology Banner"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/95 via-white/80 to-transparent backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 text-gray-700 py-4">
              <a
                href="/"
                className="hover:text-primary transition-colors duration-300 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Trang chủ
              </a>
              <span className="text-primary">/</span>
              <span className="text-primary font-medium">Giới thiệu</span>
            </div>

            <div className="mt-12 animate-fadeIn">
              <img
                src="/images/hac-logo/logo-sec.png"
                alt="Hoang Anh Technology Logo"
                className="w-[300px] mb-6 hover:opacity-90 transition-opacity"
              />

              <p className="text-gray-600 text-xl max-w-[600px] leading-relaxed animate-slideUp">
                Đồng hành cùng sự phát triển của doanh nghiệp bạn với những giải
                pháp công nghệ tối ưu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content section với thiết kế mới */}
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Phần giới thiệu công ty */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              CÔNG TY TNHH PHÁT TRIỂN CNTT HOÀNG ANH
            </h2>

            <div className="prose prose-lg">
              <p className="text-gray-600 leading-relaxed">
                Lời đầu tiên, công ty TNHH Phát triển CNTT Hoàng Anh (Hoàng Anh
                Technology) xin kính gửi tới Quý Khách hàng lời chào trân trọng
                cùng lời chúc sức khỏe và thành công.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Hoàng Anh Technology được thành lập và hoạt động với tôn chỉ
                <span className="font-semibold text-primary">
                  {" "}
                  "trao lợi ích – tích niềm tin"
                </span>
                .
              </p>
            </div>
          </div>

          {/* Phần thống kê và thành tựu */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Hỗ trợ khách hàng</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-gray-600">Sản phẩm cung cấp</div>
            </div>
          </div>
        </div>

        {/* Phần giá trị cốt lõi */}
        <div className="mt-16 bg-gray-50 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Giá Trị Cốt Lõi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-2xl text-primary"></i>
              </div>
              <h4 className="font-semibold mb-2">Uy Tín</h4>
              <p className="text-gray-600">
                Đặt chữ tín lên hàng đầu trong mọi giao dịch
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-2xl text-primary"></i>
              </div>
              <h4 className="font-semibold mb-2">Chất Lượng</h4>
              <p className="text-gray-600">
                Cam kết chất lượng sản phẩm và dịch vụ tốt nhất
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl text-primary"></i>
              </div>
              <h4 className="font-semibold mb-2">Đồng Hành</h4>
              <p className="text-gray-600">
                Luôn sát cánh cùng sự phát triển của khách hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
