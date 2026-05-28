const express = require("express");
const {
  getCategories,
  getCategoryBrands,
  getCategoryBrandProducts,
  getProductBySlug,
  getProductStats,
} = require("../controllers/catalogCtrl");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:categorySlug/brands", getCategoryBrands);
router.get(
  "/categories/:categorySlug/brands/:brandSlug/products",
  getCategoryBrandProducts
);
router.get("/products/:productSlug", getProductBySlug);
router.get("/admin/stats/products", getProductStats);

module.exports = router;
