import React, { useEffect, useMemo, useState } from "react";
import axios from "../../utils/axiosConfig";
import {
  Breadcrumb,
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Rate,
  Spin,
} from "antd";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Product from "../../components/user/Product";
import DetailDescription from "../../components/user/DetailDescription";

const SaleContactTPHCM = [
  { title: "Kinh doanh 01", phone: "0908301313", email: "trungtran@hac.com.vn" },
  { title: "Kinh doanh 02", phone: "0931054605", email: "lanhha@hac.com.vn" },
  { title: "Kinh doanh 03", phone: "0703582508", email: "giaule@hac.com.vn" },
  { title: "Kinh doanh 04", phone: "0938176262", email: "thaole@hac.com.vn" },
  { title: "Kinh doanh 05", phone: "0392856885", email: "nhunguyen@hac.com.vn" },
];

const TechniqueContact = [
  { title: "Hỗ trợ kỹ thuật", phone: "0974053061", email: "hungnguyen@hac.com.vn" },
];

const policies = [
  "Sản phẩm chính hãng, đầy đủ CO CQ",
  "Tư vấn giải pháp, kỹ thuật miễn phí",
  "Giá cạnh tranh nhất thị trường",
  "Hỗ trợ giá cho đại lý, dự án",
  "Hỗ trợ kỹ thuật tận tâm",
  "Giao hàng toàn quốc",
];

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState();
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [totalProducts, setTotalProducts] = useState(1);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productRes = await axios.get(`/product/${slug}`);
        setProduct(productRes.data);
        setMainImage(productRes.data.images?.[0]?.url);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const specRows = useMemo(() => {
    if (!product?.specifications?.length) return [];

    return product.specifications.flatMap((spec) =>
      spec.details.map((detail) => ({
        topic: spec.topic,
        title: detail.title,
        description: detail.description,
      }))
    );
  }, [product]);

  const quickSpecs = useMemo(() => {
    if (specRows.length) {
      return specRows.slice(0, 5).map((row) => `${row.title}: ${stripHtml(row.description)}`);
    }

    const description = stripHtml(product?.description || "");
    return description
      ? [description.length > 240 ? `${description.slice(0, 240)}...` : description]
      : ["Sản phẩm chính hãng, vui lòng liên hệ HAC để được tư vấn cấu hình và báo giá tốt nhất."];
  }, [product, specRows]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post("prodform/", {
        ...values,
        productTitle: product.title,
      });

      if (response.status === 200) {
        message.success("Gửi yêu cầu thành công!");
        setIsContactModalOpen(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra khi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (!product) return <p className="p-6 text-center">Sản phẩm không tồn tại.</p>;

  const relatedProducts = product.relatedProducts || [];
  const matchingProducts = product.matchingProducts || [];
  const hasSpecs = specRows.length > 0;
  const productImage = mainImage || product.images?.[0]?.url;

  return (
    <div className="w-full bg-white px-4 py-4 lg:px-0">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5">
        <Breadcrumb
          className="text-sm"
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            {
              title: (
                  <Link to={`/${product.categoryID?.slug}`}>
                  {product.categoryID?.title || "Danh mục"}
                </Link>
              ),
            },
            {
              title: (
                <Link to={`/${product.categoryID?.slug}/${product.brandID?.slug}`}>
                  {product.brandID?.title || "Thương hiệu"}
                </Link>
              ),
            },
            { title: product.title },
          ]}
        />

        <section className="grid gap-6 border-b border-gray-200 pb-8 lg:grid-cols-[420px_1fr_280px]">
          <div className="flex flex-col gap-4">
            <div className="flex min-h-[320px] items-center justify-center bg-white">
              {productImage ? (
                <Image
                  src={productImage}
                  alt={product.title}
                  preview={false}
                  className="max-h-[320px] w-full object-contain"
                />
              ) : (
                <div className="flex h-[260px] w-full items-center justify-center border border-gray-200 text-gray-400">
                  No image
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {product.images.slice(0, 5).map((image, index) => (
                  <button
                    key={image.url}
                    type="button"
                    onClick={() => setMainImage(image.url)}
                    className={`h-16 w-16 border bg-white p-1 ${
                      productImage === image.url ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <img src={image.url} alt={`${product.title} ${index + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
                <Button onClick={() => setIsImageModalOpen(true)}>Xem ảnh</Button>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 lg:text-[28px]">
              {product.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Rate disabled defaultValue={5} className="text-base text-amber-400" />
              <span className="text-gray-500">5/5</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">Mã sản phẩm: {product.productID}</span>
            </div>

            <div className="mt-4 border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              <span className="font-semibold">SKU:</span> {product.productID}
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold">Tình trạng:</span> Còn hàng
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold">Hãng:</span> {product.brandID?.title || "N/A"}
            </div>

            <div className="mt-4 text-sm leading-7 text-gray-700">
              <p className="font-medium text-gray-900">
                {product.title} - Thiết bị mạng chính hãng:
              </p>
              <ul className="mt-1 list-disc pl-5">
                {quickSpecs.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 text-2xl font-bold text-primary">Liên hệ</div>

            {product.datasheetUrl && (
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-fit rounded border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Tải datasheet
              </a>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr]">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                Số lượng:
                <InputNumber min={1} defaultValue={1} size="small" />
              </div>
              <Button
                icon={<ShoppingCartOutlined />}
                className="h-10 border-primary text-primary"
              >
                Thêm vào giỏ hàng
              </Button>
            </div>

            <div className="mt-4 grid gap-3">
              <Button
                type="primary"
                className="h-12 bg-primary text-base font-semibold uppercase"
                onClick={() => setIsContactModalOpen(true)}
              >
                Mua ngay
                <span className="ml-2 text-xs font-normal normal-case">Gọi điện xác nhận và giao hàng tận nơi</span>
              </Button>
              <Button
                type="primary"
                className="h-12 bg-primary text-base font-semibold uppercase"
                onClick={() => setIsContactModalOpen(true)}
              >
                Liên hệ báo giá tốt
                <span className="ml-2 text-xs font-normal normal-case">Tư vấn và báo giá chi tiết về sản phẩm</span>
              </Button>
            </div>
          </div>

          <aside className="border border-gray-200">
            <div className="bg-primary px-4 py-3 font-semibold text-white">
              Hỗ trợ trực tuyến
            </div>
            <div className="divide-y divide-gray-100 p-3">
              <ContactGroup title="Kinh doanh" contacts={SaleContactTPHCM} />
              <ContactGroup title="Kỹ thuật" contacts={TechniqueContact} />
            </div>
          </aside>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <main className="min-w-0">
            <SectionTitle title="Mô tả sản phẩm" />
            <div className="prose max-w-none">
              <DetailDescription description={product.description} />
            </div>

            {hasSpecs && (
              <div className="mt-6 overflow-hidden border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {specRows.slice(0, 10).map((row, index) => (
                      <tr key={`${row.title}-${index}`} className="border-b border-gray-100">
                        <td className="w-1/3 bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                          {row.title}
                        </td>
                        <td
                          className="px-4 py-3 text-gray-700"
                          dangerouslySetInnerHTML={{ __html: row.description }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
                {specRows.length > 10 && (
                  <div className="flex justify-center p-3">
                    <Button onClick={() => setIsSpecModalOpen(true)}>Xem thêm</Button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 rounded border border-gray-200 p-5">
              <h3 className="text-lg font-bold text-gray-900">
                Bạn đang cần tư vấn về sản phẩm {product.title}
              </h3>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span>Đánh giá của bạn</span>
                <Rate defaultValue={5} className="text-base text-amber-400" />
                <span className="ml-auto text-gray-500">Điểm 5/5 trên 1 đánh giá</span>
              </div>
              <Form className="mt-4" layout="vertical" onFinish={handleSubmit} initialValues={{ prodID: product.productID }}>
                <Form.Item name="message">
                  <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi / bình luận / nhận xét của bạn" />
                </Form.Item>
                <div className="grid gap-4 md:grid-cols-2">
                  <Form.Item name="name" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
                    <Input placeholder="Họ tên *" />
                  </Form.Item>
                  <Form.Item name="phone" rules={[{ required: true, message: "Vui lòng nhập điện thoại!" }]}>
                    <Input placeholder="Điện thoại *" />
                  </Form.Item>
                </div>
                <Button type="primary" htmlType="submit" className="bg-primary">
                  Gửi bình luận
                </Button>
              </Form>
            </div>

            <div className="mt-8">
              <SectionTitle title="Sản phẩm cùng loại" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <Product
                  category={product.categoryID}
                  selectedBrand={product.brandID}
                  page={1}
                  limit={4}
                  sortType="default"
                  setTotalProducts={setTotalProducts}
                  recentProduct={product._id}
                />
              </div>
            </div>
          </main>

          <aside className="flex flex-col gap-5">
            <div>
              <SectionTitle title="Thông số kỹ thuật" />
              <div className="text-sm leading-6 text-gray-700">
                {quickSpecs.slice(0, 5).map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
              {hasSpecs && (
                <Button className="mt-4 w-full rounded-full" onClick={() => setIsSpecModalOpen(true)}>
                  Xem thêm thông số kỹ thuật
                </Button>
              )}
            </div>

            <div className="border border-gray-200 p-4">
              <h3 className="mb-3 text-lg font-bold text-gray-900">Chính sách bán hàng</h3>
              <div className="space-y-3">
                {policies.map((policy) => (
                  <div key={policy} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircleOutlined className="mt-1 text-green-500" />
                    <span>{policy}</span>
                  </div>
                ))}
              </div>
            </div>

            {matchingProducts.length > 0 && (
              <SideProductList title="Sản phẩm phù hợp" products={matchingProducts} setTotalProducts={setTotalProducts} />
            )}
            {relatedProducts.length > 0 && (
              <SideProductList title="Sản phẩm liên quan" products={relatedProducts} setTotalProducts={setTotalProducts} />
            )}
          </aside>
        </section>

        <Modal
          title="Thông số kỹ thuật đầy đủ"
          open={isSpecModalOpen}
          onCancel={() => setIsSpecModalOpen(false)}
          footer={null}
          width={900}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <tbody>
                {product.specifications?.map((spec, index) => (
                  <React.Fragment key={index}>
                    {spec.topic && (
                      <tr className="bg-primary/5">
                        <td colSpan="2" className="border border-gray-200 px-4 py-2 text-lg font-semibold">
                          {spec.topic}
                        </td>
                      </tr>
                    )}
                    {spec.details.map((detail, detailIndex) => (
                      <tr key={detailIndex}>
                        <td className="w-1/3 border border-gray-200 bg-gray-50 px-4 py-2 font-medium">
                          {detail.title}
                        </td>
                        <td
                          className="border border-gray-200 px-4 py-2"
                          dangerouslySetInnerHTML={{ __html: detail.description }}
                        />
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>

        <Modal
          title="Thư viện hình ảnh sản phẩm"
          open={isImageModalOpen}
          onCancel={() => setIsImageModalOpen(false)}
          footer={null}
          width={1000}
          centered
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {product.images?.map((image, index) => (
              <Image key={image.url} src={image.url} alt={`${product.title} - Hình ${index + 1}`} />
            ))}
          </div>
        </Modal>

        <Modal
          title={`Yêu cầu giá tốt sản phẩm ${product.productID}`}
          open={isContactModalOpen}
          onCancel={() => setIsContactModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <p className="mb-4 text-sm">
            Quý khách vui lòng để lại thông tin. Bộ phận kinh doanh của chúng tôi sẽ liên hệ trong thời gian sớm nhất.
          </p>
          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ prodID: product.productID }}>
            <Form.Item label="Mã sản phẩm" name="prodID">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Lời nhắn" name="message">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="h-10 w-full bg-primary" disabled={loading}>
              Gửi yêu cầu
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

const SectionTitle = ({ title }) => (
  <div className="mb-4 border-b border-gray-200 pb-2">
    <h2 className="relative inline-block text-xl font-bold text-gray-900 after:absolute after:-bottom-[9px] after:left-0 after:h-[2px] after:w-12 after:bg-primary">
      {title}
    </h2>
  </div>
);

const ContactGroup = ({ title, contacts }) => (
  <div className="py-3">
    <div className="mb-2 bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-800">{title}</div>
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div key={`${contact.title}-${contact.phone}`} className="text-sm">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <UserOutlined />
            {contact.title}
          </div>
          <div className="mt-1 flex items-center gap-2 text-gray-700">
            <PhoneOutlined className="text-primary" />
            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          </div>
          <div className="mt-1 flex items-center gap-2 text-gray-700">
            <MailOutlined className="text-primary" />
            <a className="truncate" href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SideProductList = ({ title, products, setTotalProducts }) => (
  <div className="border border-gray-200 p-4">
    <h3 className="mb-3 text-lg font-bold text-gray-900">{title}</h3>
    <div className="flex max-h-[460px] flex-col gap-3 overflow-y-auto">
      <Product relatedProducts={products} page={1} limit={6} sortType="default" setTotalProducts={setTotalProducts} layoutType="horizontal" />
    </div>
  </div>
);

export default ProductDetail;
