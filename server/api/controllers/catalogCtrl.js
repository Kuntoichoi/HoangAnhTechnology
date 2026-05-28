const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");

const activeQuery = { $or: [{ status: "active" }, { status: { $exists: false } }] };
const publicProductQuery = {
  isDisabled: false,
  $or: [{ status: "published" }, { status: { $exists: false } }],
};

const toCategoryDTO = (category) => ({
  id: category._id,
  name: category.title,
  title: category.title,
  slug: category.slug,
  description: category.description || "",
  icon_url: category.icon?.[0]?.url || "",
});

const toBrandDTO = (brand) => ({
  id: brand._id,
  name: brand.title,
  title: brand.title,
  slug: brand.slug,
  description: brand.description || "",
  logo_url: brand.logo?.url || "",
});

const toProductCardDTO = (product) => ({
  id: product._id,
  sku: product.productID,
  productID: product.productID,
  name: product.title,
  title: product.title,
  slug: product.slug,
  image_url: product.images?.[0]?.url || "",
  short_description: product.shortDescription || "",
  price_text: product.priceText || "Liên hệ",
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find(activeQuery).sort("title").lean();
  res.json(categories.map(toCategoryDTO));
});

const getCategoryBrands = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;

  const category = await Category.findOne({
    slug: categorySlug,
    ...activeQuery,
  })
    .populate({
      path: "brandIDs",
      match: activeQuery,
      select: "title slug logo description status",
      options: { sort: { title: 1 } },
    })
    .lean();

  if (!category) {
    return res.status(404).json({ message: "Không tìm thấy danh mục" });
  }

  res.json({
    category: toCategoryDTO(category),
    brands: (category.brandIDs || []).map(toBrandDTO),
  });
});

const getCategoryBrandProducts = asyncHandler(async (req, res) => {
  const { categorySlug, brandSlug } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [category, brand] = await Promise.all([
    Category.findOne({ slug: categorySlug, ...activeQuery }).lean(),
    Brand.findOne({ slug: brandSlug, ...activeQuery }).lean(),
  ]);

  if (!category) {
    return res.status(404).json({ message: "Không tìm thấy danh mục" });
  }

  if (!brand) {
    return res.status(404).json({ message: "Không tìm thấy hãng" });
  }

  const brandBelongsToCategory = (category.brandIDs || []).some(
    (brandId) => brandId.toString() === brand._id.toString()
  );

  if (!brandBelongsToCategory) {
    return res.status(400).json({
      message: `Hãng này không thuộc danh mục ${category.title}.`,
    });
  }

  const query = {
    ...publicProductQuery,
    categoryID: category._id,
    brandID: brand._id,
  };

  const [products, totalProducts] = await Promise.all([
    Product.find(query).sort("-createdAt").skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  res.json({
    category: toCategoryDTO(category),
    brand: toBrandDTO(brand),
    products: products.map(toProductCardDTO),
    totalProducts,
    currentPage: page,
    pageSize: limit,
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { productSlug } = req.params;

  const product = await Product.findOne({
    slug: productSlug,
    ...publicProductQuery,
  })
    .populate("categoryID", "title slug description icon")
    .populate("brandID", "title slug description logo")
    .lean();

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  res.json(product);
});

const getProductStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    hiddenProducts,
    missingImages,
    missingSpecs,
    missingDatasheet,
    byCategory,
    byBrand,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "published", isDisabled: false }),
    Product.countDocuments({ status: "draft" }),
    Product.countDocuments({ $or: [{ status: "hidden" }, { isDisabled: true }] }),
    Product.countDocuments({ $or: [{ images: { $size: 0 } }, { images: { $exists: false } }] }),
    Product.countDocuments({ $or: [{ specifications: { $size: 0 } }, { specifications: { $exists: false } }] }),
    Product.countDocuments({ $or: [{ datasheetUrl: "" }, { datasheetUrl: { $exists: false } }] }),
    Product.aggregate([
      { $group: { _id: "$categoryID", count: { $sum: 1 } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, categoryId: "$_id", title: "$category.title", slug: "$category.slug", count: 1 } },
    ]),
    Product.aggregate([
      { $group: { _id: "$brandID", count: { $sum: 1 } } },
      { $lookup: { from: "brands", localField: "_id", foreignField: "_id", as: "brand" } },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, brandId: "$_id", title: "$brand.title", slug: "$brand.slug", count: 1 } },
    ]),
  ]);

  res.json({
    totalProducts,
    publishedProducts,
    draftProducts,
    hiddenProducts,
    missingImages,
    missingSpecs,
    missingDatasheet,
    byCategory,
    byBrand,
  });
});

module.exports = {
  getCategories,
  getCategoryBrands,
  getCategoryBrandProducts,
  getProductBySlug,
  getProductStats,
};
