import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mammoth from "mammoth";

const dummyBlogs = [
  {
    slug: "wifi-6-la-gi",
    title: "WiFi 6 là gì? Có nên nâng cấp?",
    excerpt:
      "Tìm hiểu công nghệ WiFi 6 và lý do tại sao nên nâng cấp hệ thống mạng doanh nghiệp.",
    date: "2025-05-01",
  },
  {
    slug: "giai-phap-toi-uu-cho-mot-he-thong-van-hanh-muot-ma",
    title: "Giải Pháp Tối Ưu Cho Một Hệ Thống Vận Hành Mượt Mà",
    excerpt:
      "Danh sách những switch, router và access point được nhiều khách hàng lựa chọn nhất.",
    date: "2025-05-05",
  },
  {
    slug: "h3c-r4700-r4900-dac-biet",
    title: "H3C R4700 & R4900 Có Gì Đặc Biệt So Với Các Server Đầu Bảng",
    excerpt: "So sánh và phân tích chi tiết 2 model server nổi bật của H3C.",
    image:
      "https://res.cloudinary.com/hac-cloud/image/upload/v1747987948/H3C-logo_pca1ja.png",
    date: "2025-05-23",
  },
];

function BlogDetail() {
  const { slug } = useParams();
  const [htmlContent, setHtmlContent] = useState("");
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const foundBlog = dummyBlogs.find((b) => b.slug === slug);
    if (!foundBlog) {
      setBlog(null);
      return;
    }
    setBlog(foundBlog);

    if (slug === "h3c-r4700-r4900-dac-biet") {
      fetch("/doc/blog-h3c.docx")
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => mammoth.convertToHtml({ arrayBuffer }))
        .then((result) => {
          const styledHtml = enhanceText(enhanceTables(result.value));
          setHtmlContent(styledHtml);
        });
    } else if (slug === "wifi-6-la-gi") {
      setHtmlContent(
        enhanceText(`
<section>
  <h2>Wi-Fi 6 là gì?</h2>
  <p><strong>Wi-Fi 6</strong> (802.11ax) là thế hệ mới nhất của công nghệ mạng không dây, được phát triển để cải thiện hiệu suất, tốc độ và khả năng kết nối trong môi trường có mật độ thiết bị cao. So với các phiên bản trước (Wi-Fi 4, Wi-Fi 5), Wi-Fi 6 mang lại tốc độ cao hơn, độ trễ thấp hơn và hiệu suất vượt trội trong các tình huống thực tế.</p>

  <h3>Những điểm nổi bật của Wi-Fi 6</h3>

  <h4>1. Tốc độ nhanh hơn</h4>
  <ul>
    <li>Tốc độ lý thuyết lên tới <strong>9,6 Gbps</strong> (so với 3,5 Gbps của Wi-Fi 5).</li>
    <li>Cải thiện mã hóa dữ liệu và sử dụng băng tần hiệu quả hơn.</li>
    <li>Hỗ trợ truyền tải ổn định khi có nhiều thiết bị kết nối cùng lúc.</li>
  </ul>

  <h4>2. Độ trễ thấp</h4>
  <ul>
    <li>Giảm độ trễ tới <strong>75%</strong> nhờ công nghệ OFDMA – cho phép nhiều thiết bị nhận dữ liệu đồng thời.</li>
    <li>Cải thiện trải nghiệm chơi game, gọi video và phát trực tuyến.</li>
  </ul>

  <h4>3. Công nghệ tiên tiến</h4>
  <ul>
    <li><strong>OFDMA</strong>: Chia nhỏ kênh truyền thành nhiều sóng mang phụ, truyền dữ liệu đến nhiều thiết bị cùng lúc.</li>
    <li><strong>OBSS (Overlapping BSS)</strong>: Cho phép bỏ qua nhiễu từ các mạng khác bằng "màu" tín hiệu – giúp giảm tắc nghẽn.</li>
    <li><strong>Beamforming</strong>: Hướng tín hiệu trực tiếp tới thiết bị, tăng cường tốc độ và độ ổn định kết nối.</li>
  </ul>

  <h4>4. Bảo mật cao hơn với WPA3</h4>
  <ul>
    <li>Hỗ trợ chuẩn bảo mật mới <strong>WPA3</strong>, tăng cường mã hóa và xác thực mật khẩu.</li>
    <li>Giúp mạng Wi-Fi an toàn hơn trước các cuộc tấn công dò mật khẩu.</li>
  </ul>

  <h4>5. Tiết kiệm pin với TWT</h4>
  <ul>
    <li><strong>Target Wake Time (TWT)</strong>: Lập lịch thời gian đánh thức thiết bị, giảm thời gian dò tín hiệu, kéo dài tuổi thọ pin cho thiết bị IoT, điện thoại và laptop.</li>
  </ul>

  <h3>Wi-Fi 6E: Bước mở rộng của Wi-Fi 6</h3>
  <p><strong>Wi-Fi 6E</strong> bổ sung băng tần <strong>6GHz</strong> (bên cạnh 2.4GHz và 5GHz), mang lại:</p>
  <ul>
    <li>Thêm băng thông (1.200 MHz).</li>
    <li>Ít nhiễu hơn, tốc độ cao hơn trong khoảng cách ngắn.</li>
    <li>Lý tưởng cho thực tế ảo, streaming 8K và môi trường mạng đông thiết bị.</li>
  </ul>
  <p><em>Lưu ý: Wi-Fi 6E yêu cầu thiết bị hỗ trợ riêng biệt – không phải mọi thiết bị Wi-Fi 6 đều có thể sử dụng băng tần 6GHz.</em></p>

  <h3>Làm sao để sử dụng Wi-Fi 6?</h3>
  <ol>
    <li><strong>Bộ định tuyến hỗ trợ Wi-Fi 6</strong>: Đây là yêu cầu cơ bản để phát tín hiệu Wi-Fi 6.</li>
    <li><strong>Thiết bị đầu cuối hỗ trợ Wi-Fi 6</strong>: Laptop, điện thoại, máy tính bảng… phải tích hợp chuẩn Wi-Fi 6.</li>
    <li><strong>PC có hỗ trợ Wi-Fi 6</strong>: Dùng bo mạch chủ mới hoặc card Wi-Fi rời nếu cần.</li>
  </ol>

  <h3>Kết luận</h3>
  <p>Wi-Fi 6 là một bước tiến lớn trong công nghệ mạng không dây, đặc biệt trong thời đại IoT, làm việc từ xa và giải trí kỹ thuật số. Với tốc độ cao hơn, độ trễ thấp hơn, bảo mật tốt hơn và hiệu quả cao hơn, Wi-Fi 6 sẽ là nền tảng chính cho kết nối không dây trong tương lai gần.</p>
</section>

        `)
      );
    } else if (slug === "giai-phap-toi-uu-cho-mot-he-thong-van-hanh-muot-ma") {
      setHtmlContent(
        enhanceText(`
<section>
  <p>Trong thời đại số hóa hiện nay, một hệ thống vận hành mượt mà không chỉ giúp doanh nghiệp nâng cao hiệu suất làm việc mà còn giảm thiểu tối đa rủi ro và chi phí phát sinh từ sự cố hệ thống. Việc tối ưu hóa hệ thống là một quá trình liên tục và đòi hỏi sự đầu tư đúng đắn về công nghệ, con người cũng như quy trình vận hành.</p>
  <p>Vậy làm thế nào để xây dựng và duy trì một hệ thống vận hành ổn định, hiệu quả trong môi trường thay đổi liên tục như hiện nay? Dưới đây là những giải pháp thiết thực và hiệu quả nhất.</p>

  <h2>1. Đơn Giản Hóa – Tối Ưu Từ Cốt Lõi</h2>
  <p>Không ít doanh nghiệp gặp phải tình trạng hệ thống ngày càng phức tạp do sự tích tụ nhiều công nghệ, phần mềm và thiết bị không đồng bộ. Điều này không chỉ làm giảm tốc độ xử lý mà còn làm khó khăn cho việc bảo trì và nâng cấp.</p>
  <p>Việc đơn giản hóa hệ thống bắt đầu từ việc rà soát, loại bỏ những thành phần dư thừa, không còn phù hợp với mục tiêu phát triển. Ví dụ, hợp nhất các công cụ quản lý hoặc chọn nền tảng có tính năng đa dạng thay vì dùng nhiều ứng dụng rời rạc sẽ giúp hệ thống nhẹ nhàng hơn, dễ kiểm soát và vận hành ổn định hơn.</p>

  <h2>2. Tự Động Hóa Các Quy Trình Lặp Lại</h2>
  <p>Tự động hóa là chìa khóa giúp giảm thiểu sai sót và nâng cao hiệu quả công việc. Thay vì phải thao tác thủ công cho các bước lặp lại, doanh nghiệp có thể sử dụng các công cụ tự động hóa quy trình (RPA – Robotic Process Automation), hệ thống cảnh báo tự động, hoặc các script xử lý dữ liệu tự động.</p>
  <p>Ví dụ, trong quản lý mạng, việc tự động cập nhật firmware, sao lưu cấu hình thiết bị hay phát hiện lỗi ngay khi có dấu hiệu bất thường sẽ giúp hệ thống luôn duy trì trạng thái tốt nhất mà không cần can thiệp thủ công liên tục.</p>

  <h2>3. Kết Nối Ổn Định – Tốc Độ Ổn Định</h2>
  <p>Hệ thống dù có mạnh mẽ đến đâu cũng sẽ gặp khó khăn nếu kết nối mạng không ổn định hoặc có các điểm nghẽn trong quá trình truyền tải dữ liệu. Do đó, việc đảm bảo mạng lưới kết nối với băng thông phù hợp, các thiết bị chuyển mạch (switch), bộ định tuyến (router) hoạt động ổn định là điều bắt buộc.</p>
  <p>Bên cạnh đó, việc sử dụng các giải pháp cân bằng tải (load balancing) và phân phối tài nguyên hợp lý cũng góp phần giúp hệ thống luôn có tốc độ phản hồi nhanh, đồng thời tăng khả năng chịu lỗi khi có sự cố xảy ra.</p>

  <h2>4. Giám Sát Liên Tục – Chủ Động Thay Vì Bị Động</h2>
  <p>Phòng bệnh hơn chữa bệnh – điều này hoàn toàn đúng trong việc vận hành hệ thống công nghệ thông tin. Hệ thống giám sát liên tục cho phép phát hiện các bất thường, lỗi phát sinh ngay từ giai đoạn đầu, từ đó đưa ra cảnh báo hoặc xử lý kịp thời trước khi gây ra hậu quả nghiêm trọng.</p>
  <p>Hiện nay, các nền tảng giám sát thường tích hợp AI để phân tích hành vi, dự đoán rủi ro và đề xuất giải pháp tự động, giúp doanh nghiệp duy trì hệ thống ổn định một cách chủ động và hiệu quả hơn.</p>

  <h2>5. Hỗ Trợ Và Bảo Trì Linh Hoạt</h2>
  <p>Không có hệ thống nào là hoàn hảo và vận hành mãi mãi không cần bảo trì. Việc thiết lập quy trình hỗ trợ kỹ thuật linh hoạt, nhanh chóng và chuyên nghiệp là cần thiết để đảm bảo khi có sự cố xảy ra, doanh nghiệp có thể nhanh chóng khắc phục mà không ảnh hưởng lớn đến hoạt động.</p>
  <p>Việc bảo trì định kỳ, cập nhật phần mềm, kiểm tra phần cứng định kỳ cũng là yếu tố quan trọng giúp hệ thống luôn ở trạng thái tối ưu nhất.</p>

  <h2>6. Đào Tạo Nhân Viên Và Văn Hóa Vận Hành</h2>
  <p>Một hệ thống vận hành hiệu quả không chỉ dựa vào công nghệ mà còn cần con người vận hành chuyên nghiệp và hiểu biết. Đào tạo nhân viên về kỹ năng vận hành, xử lý sự cố và nâng cao nhận thức về an toàn bảo mật giúp giảm thiểu lỗi do con người gây ra.</p>
  <p>Bên cạnh đó, xây dựng văn hóa vận hành theo quy trình chuẩn hóa, có sự phối hợp chặt chẽ giữa các phòng ban sẽ nâng cao hiệu quả chung của toàn hệ thống.</p>

  <h2>Tạm Kết</h2>
  <p>Tối ưu hệ thống vận hành là một hành trình dài, đòi hỏi sự đầu tư liên tục về công nghệ, quy trình và con người. Bằng việc áp dụng những giải pháp đơn giản nhưng thiết thực như trên, doanh nghiệp không chỉ duy trì được sự ổn định mà còn có nền tảng vững chắc để phát triển và mở rộng trong tương lai.</p>
  <blockquote>✅ Hãy bắt đầu từ những điều cơ bản và liên tục cải tiến từng ngày để hệ thống của bạn luôn vận hành mượt mà và bền bỉ!</blockquote>
</section>

        `)
      );
    } else {
      setHtmlContent(`<p>${foundBlog.excerpt}</p>`);
    }
  }, [slug]);

  const enhanceTables = (html) => {
    return html
      .replace(
        /<table>/g,
        '<table class="table-auto border-collapse border border-gray-300 w-full text-base my-6 rounded overflow-hidden">'
      )
      .replace(/<thead>/g, '<thead class="bg-gray-100"')
      .replace(
        /<th>/g,
        '<th class="border border-gray-300 px-4 py-2 font-semibold text-center bg-gray-50"'
      )
      .replace(/<tbody>/g, '<tbody class="bg-white"')
      .replace(
        /<td>/g,
        '<td class="border border-gray-300 px-4 py-2 text-center"'
      )
      .replace(
        /<img /g,
        '<img class="w-[50px] h-[50px] object-cover inline-block mx-auto" '
      );
  };

  function enhanceText(html) {
    return html
      .replace(/<p>/g, '<p class="mb-3 leading-relaxed">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-3">')
      .replace(/<li>/g, '<li class="ml-5">')
      .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-4 mt-8">')
      .replace(/<h3>/g, '<h3 class="text-xl font-semibold mb-3 mt-6">')
      .replace(/<h4>/g, '<h4 class="text-lg font-semibold mb-2 mt-4">')
      .replace(
        /<table>/g,
        '<table class="border border-gray-300 mb-6 w-full table-auto">'
      )
      .replace(/<tr>/g, '<tr class="border border-gray-300">')
      .replace(/<td>/g, '<td class="border border-gray-300 p-2">');
  }

  if (!blog) return <p>Không tìm thấy bài viết</p>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1500px] mx-auto mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 leading-tight">
          {blog.title}
        </h1>
      </div>
      <div className="w-full mx-auto mb-10">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full max-h-[250px] sm:max-h-[350px] md:max-h-[450px] object-contain bg-white p-4 sm:p-6 rounded-lg shadow"
          />
        ) : null}
      </div>

      <div className="max-w-[1500px] mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-xl">
        <div
          className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-slate dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

export default BlogDetail;
