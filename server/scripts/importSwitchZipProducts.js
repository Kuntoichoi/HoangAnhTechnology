require("dotenv").config();

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const slugify = require("slugify");

const Category = require("../api/models/categoryModel");
const Brand = require("../api/models/brandModel");
const Product = require("../api/models/productModel");

const ROOT_DIR = path.resolve(__dirname, "../..");
const PUBLIC_DIR = path.join(ROOT_DIR, "client/public/product-import");

const SOURCES = [
  {
    brandTitle: "Cisco",
    brandSlug: "cisco",
    folder: "cisco-catalyst",
    zipPath: "/Users/kun/Desktop/tool lấy ảnh/CISCO_CATALYS_Images.zip",
    shouldImport: (name) => /^C9(200|300)/i.test(name),
  },
  {
    brandTitle: "HPE Aruba",
    brandSlug: "hpe-aruba",
    folder: "aruba-switch",
    zipPath: "/Users/kun/Desktop/tool lấy ảnh/ARUBA_SWITCH_Images.zip",
    shouldImport: (name) => {
      const upperName = name.toUpperCase();
      const blockedWords = [
        "EMAIL",
        "TEL",
        "MOBILE",
        "ZALO",
        "THANH",
        "NGAN",
        "KHOAN",
        "THANK",
        "CAM",
        "PHU TRACH",
        "BAO HANH",
        "DIEU KHOAN",
        "GIA ",
      ];

      if (blockedWords.some((word) => upperName.includes(word))) {
        return false;
      }

      return (
        /SWITCH/i.test(name) ||
        /^J(L|G|H|D|9|8|7)/i.test(name)
      );
    },
  },
];

const productDescription =
  "Sản phẩm chính hãng, bảo hành theo tiêu chuẩn nhà sản xuất. Vui lòng liên hệ HAC để được tư vấn cấu hình, báo giá và thời gian giao hàng.";

const listZipEntries = (zipPath) => {
  const output = childProcess.execFileSync("unzip", ["-Z1", zipPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10,
  });

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /\.(png|jpe?g|webp)$/i.test(line));
};

const toProductName = (entry) => path.basename(entry).replace(/\.[^.]+$/, "").trim();

const toSafeFilename = (name) => {
  const ext = path.extname(name).toLowerCase() || ".png";
  const base = path.basename(name, ext);
  const safeBase =
    slugify(base, { lower: false, strict: true, locale: "vi" }) ||
    base.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") ||
    "product";

  return `${safeBase}${ext}`;
};

const copyZipEntry = (zipPath, entry, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const imageBuffer = childProcess.execFileSync("unzip", ["-p", zipPath, entry], {
    maxBuffer: 1024 * 1024 * 20,
  });
  fs.writeFileSync(destination, imageBuffer);
};

const ensureCatalog = async () => {
  const category = await Category.findOneAndUpdate(
    { slug: "switch" },
    {
      $setOnInsert: {
        title: "Switch",
        slug: "switch",
        icon: [],
        filterIDs: [],
      },
    },
    { new: true, upsert: true }
  );

  const brands = {};

  for (const source of SOURCES) {
    const brand = await Brand.findOneAndUpdate(
      { slug: source.brandSlug },
      {
        $setOnInsert: {
          title: source.brandTitle,
          slug: source.brandSlug,
          logo: {},
        },
        $addToSet: { categoryIDs: category._id },
      },
      { new: true, upsert: true }
    );

    brands[source.brandSlug] = brand;
    await Category.updateOne(
      { _id: category._id },
      { $addToSet: { brandIDs: brand._id } }
    );
  }

  return { category, brands };
};

const importSource = async (source, category, brand) => {
  const destinationDir = path.join(PUBLIC_DIR, source.folder);
  const entries = listZipEntries(source.zipPath);
  const selected = entries.filter((entry) => source.shouldImport(toProductName(entry)));
  let imported = 0;

  for (const entry of selected) {
    const productName = toProductName(entry);
    const productID = productName.replace(/\s+/g, " ").trim();
    const safeFilename = toSafeFilename(entry);
    const destination = path.join(destinationDir, safeFilename);
    const publicUrl = `/product-import/${source.folder}/${encodeURIComponent(
      safeFilename
    )}`;

    copyZipEntry(source.zipPath, entry, destination);

    const slug = slugify(`${productID} ${source.brandTitle}`, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    await Product.findOneAndUpdate(
      { productID },
      {
        $set: {
          productID,
          title: productID,
          description: productDescription,
          shortDescription: "",
          datasheetUrl: "",
          priceText: "Liên hệ",
          prices: 0,
          quantity: 1,
          images: [{ url: publicUrl, public_id: `local/${source.folder}/${safeFilename}` }],
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
  }

  return { selected: selected.length, imported };
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in server/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const { category, brands } = await ensureCatalog();

  const results = [];
  for (const source of SOURCES) {
    const result = await importSource(source, category, brands[source.brandSlug]);
    results.push({ brand: source.brandTitle, ...result });
  }

  await mongoose.disconnect();

  console.log("Import completed:");
  results.forEach((result) => {
    console.log(`- ${result.brand}: ${result.imported} products`);
  });
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
