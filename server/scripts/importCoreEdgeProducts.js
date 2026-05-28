require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const slugify = require("slugify");

const Category = require("../api/models/categoryModel");
const Brand = require("../api/models/brandModel");
const Product = require("../api/models/productModel");

const ROOT_DIR = path.resolve(__dirname, "../..");
const IMAGE_SOURCE_DIR = path.join(ROOT_DIR, "ANH SAN PHAM COREEDGE");
const DATASHEET_SOURCE_DIR = path.join(ROOT_DIR, "DATA SHEET_2026");
const PUBLIC_BASE_DIR = path.join(ROOT_DIR, "client/public/product-import/coreedge");

const brandInfo = {
  title: "CoreEdge",
  slug: "coreedge",
};

const productDescription = (productID, datasheetUrl) => {
  const lines = [
    `<p><strong>${productID}</strong> là sản phẩm CoreEdge chính hãng do HAC cung cấp.</p>`,
    "<p>Vui lòng liên hệ HAC để được tư vấn cấu hình, báo giá dự án và thời gian giao hàng tốt nhất.</p>",
  ];

  if (datasheetUrl) {
    lines.push(
      `<p><a href="${datasheetUrl}" target="_blank" rel="noopener noreferrer">Tải datasheet sản phẩm</a></p>`
    );
  }

  return lines.join("\n");
};

const toSafeFilename = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext);
  const safeBase =
    slugify(base, { lower: false, strict: true, locale: "vi" }) ||
    base.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") ||
    "asset";

  return `${safeBase}${ext}`;
};

const normalizeProductID = (value) =>
  value
    .replace(/_Datasheet.*$/i, "")
    .replace(/_Technical_Specification.*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const getCategoryInfo = (productID) => {
  if (/^CEN-/i.test(productID)) {
    return { title: "Module quang", slug: "module-quang" };
  }

  if (/^(CW|AC)/i.test(productID)) {
    return { title: "Wireless", slug: "wireless" };
  }

  return { title: "Switch", slug: "switch" };
};

const listFilesRecursive = (directory, matcher) => {
  if (!fs.existsSync(directory)) return [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFilesRecursive(fullPath, matcher);
    return matcher(fullPath) ? [fullPath] : [];
  });
};

const getImageGroups = () => {
  if (!fs.existsSync(IMAGE_SOURCE_DIR)) return new Map();

  const groups = new Map();
  const productFolders = fs
    .readdirSync(IMAGE_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const folder of productFolders) {
    const productID = normalizeProductID(folder.name);
    const productDir = path.join(IMAGE_SOURCE_DIR, folder.name);
    const allImages = listFilesRecursive(productDir, (filePath) =>
      /\.(png|jpe?g|webp)$/i.test(filePath)
    );
    const sortedImages = allImages.sort((a, b) => {
      const aEdited = /chỉnh|chỉnh|chinh/i.test(a) ? 0 : 1;
      const bEdited = /chỉnh|chỉnh|chinh/i.test(b) ? 0 : 1;
      if (aEdited !== bEdited) return aEdited - bEdited;
      return a.localeCompare(b);
    });

    groups.set(productID, sortedImages);
  }

  return groups;
};

const getFallbackProductID = (productID) => {
  const rules = [
    [/^AC3300/i, "CW2000-6I"],
    [/^C3100-48/i, "C3100-48TS"],
    [/^C3100-24/i, "C3100-24TL"],
    [/^C3100-8/i, "C3100-8P"],
    [/^C3300-/i, "C3300-24TS"],
    [/^C3700-/i, "C3300-24TS"],
    [/^C5100-/i, "C3300-24TS"],
    [/^C9000-/i, "CS2000-24T"],
    [/^CG2000-/i, "CS2000-24T"],
    [/^IN3100-8TG/i, "IN3100-8PG"],
  ];

  return rules.find(([pattern]) => pattern.test(productID))?.[1] || null;
};

const getDatasheets = () => {
  const pdfFiles = listFilesRecursive(DATASHEET_SOURCE_DIR, (filePath) =>
    /\.pdf$/i.test(filePath)
  );
  const datasheets = new Map();

  for (const filePath of pdfFiles) {
    const productID = normalizeProductID(path.basename(filePath, path.extname(filePath)));
    datasheets.set(productID, filePath);
  }

  return datasheets;
};

const copyProductImages = (productID, files) => {
  const destinationDir = path.join(PUBLIC_BASE_DIR, "images", productID);
  fs.mkdirSync(destinationDir, { recursive: true });

  return files.map((filePath, index) => {
    const safeFilename = `${String(index + 1).padStart(2, "0")}-${toSafeFilename(
      path.basename(filePath)
    )}`;
    const destination = path.join(destinationDir, safeFilename);
    fs.copyFileSync(filePath, destination);

    const publicUrl = `/product-import/coreedge/images/${encodeURIComponent(
      productID
    )}/${encodeURIComponent(safeFilename)}`;

    return {
      url: publicUrl,
      public_id: `local/coreedge/images/${productID}/${safeFilename}`,
    };
  });
};

const copyDatasheet = (productID, filePath) => {
  if (!filePath) return null;

  const destinationDir = path.join(PUBLIC_BASE_DIR, "datasheets");
  fs.mkdirSync(destinationDir, { recursive: true });
  const safeFilename = `${productID}-${toSafeFilename(path.basename(filePath))}`;
  const destination = path.join(destinationDir, safeFilename);
  fs.copyFileSync(filePath, destination);

  return `/product-import/coreedge/datasheets/${encodeURIComponent(safeFilename)}`;
};

const ensureCategory = async ({ title, slug }) =>
  Category.findOneAndUpdate(
    { slug },
    {
      $setOnInsert: {
        title,
        slug,
        icon: [],
        filterIDs: [],
      },
    },
    { new: true, upsert: true }
  );

const ensureBrand = async (categories) => {
  const brand = await Brand.findOneAndUpdate(
    { slug: brandInfo.slug },
    {
      $setOnInsert: {
        title: brandInfo.title,
        slug: brandInfo.slug,
        logo: {},
      },
      $addToSet: { categoryIDs: { $each: categories.map((category) => category._id) } },
    },
    { new: true, upsert: true }
  );

  await Promise.all(
    categories.map((category) =>
      Category.updateOne(
        { _id: category._id },
        { $addToSet: { brandIDs: brand._id } }
      )
    )
  );

  return brand;
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in server/.env");
  }

  const imageGroups = getImageGroups();
  const datasheets = getDatasheets();
  const productIDs = Array.from(
    new Set([...imageGroups.keys(), ...datasheets.keys()])
  ).sort();

  await mongoose.connect(process.env.MONGO_URI);

  const categoryInfos = [
    { title: "Switch", slug: "switch" },
    { title: "Wireless", slug: "wireless" },
    { title: "Module quang", slug: "module-quang" },
  ];
  const categories = await Promise.all(categoryInfos.map(ensureCategory));
  const categoryBySlug = Object.fromEntries(
    categories.map((category) => [category.slug, category])
  );
  const brand = await ensureBrand(categories);

  let imported = 0;
  let withImages = 0;
  let withDatasheets = 0;

  const imageCache = new Map();

  for (const productID of productIDs) {
    const categoryInfo = getCategoryInfo(productID);
    const category = categoryBySlug[categoryInfo.slug];
    const imageFiles = imageGroups.get(productID) || [];
    const datasheetUrl = copyDatasheet(productID, datasheets.get(productID));
    const images = imageFiles.length ? copyProductImages(productID, imageFiles) : [];
    imageCache.set(productID, images);
    const slug = slugify(`${productID} ${brandInfo.title}`, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    await Product.findOneAndUpdate(
      { productID },
      {
        $set: {
          productID,
          title: `${brandInfo.title} ${productID}`,
          description: productDescription(productID, datasheetUrl),
          shortDescription: "",
          datasheetUrl: datasheetUrl || "",
          priceText: "Liên hệ",
          prices: 0,
          quantity: 1,
          images,
          slug,
          categoryID: category._id,
          brandID: brand._id,
          optionIDs: [],
          relatedProducts: [],
          matchingProducts: [],
          isDisabled: false,
          status: "draft",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    imported += 1;
    if (images.length) withImages += 1;
    if (datasheetUrl) withDatasheets += 1;
  }

  for (const productID of productIDs) {
    if (imageCache.get(productID)?.length) continue;

    const fallbackProductID = getFallbackProductID(productID);
    const fallbackImages = fallbackProductID ? imageCache.get(fallbackProductID) : null;
    if (!fallbackImages?.length) continue;

    await Product.updateOne(
      { productID },
      {
        $set: {
          images: fallbackImages.map((image) => ({
            ...image,
            public_id: `${image.public_id}-fallback-${productID}`,
          })),
        },
      }
    );
    withImages += 1;
  }

  await mongoose.disconnect();

  console.log("CoreEdge import completed:");
  console.log(`- Products imported/upserted: ${imported}`);
  console.log(`- Products with images: ${withImages}`);
  console.log(`- Products with datasheets: ${withDatasheets}`);
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
