const localBrandLogos = {
  aruba: "/images/partners/logo-aruba.png",
  cisco: "/images/partners/logo-cisco.png",
  coreedge: "/images/partners/logo-coreedge.svg",
  "core-edge": "/images/partners/logo-coreedge.svg",
  dell: "/images/partners/logo-dell.png",
  "dell-emc": "/images/partners/logo-dell.png",
  h3c: "/images/partners/logo-h3c.png",
  hpe: "/images/partners/logo-hpe.png",
  "hpe-aruba": "/images/partners/logo-hpe.png",
};

const brandAliases = {
  "dell emc": "dell-emc",
  "core edge": "core-edge",
  "hp enterprise": "hpe",
  "hpe aruba": "hpe-aruba",
  "hewlett packard enterprise": "hpe",
};

export const normalizeBrandKey = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getBrandLogoUrl = (brand = {}) => {
  if (brand.logo_url) return brand.logo_url;
  if (brand.logo?.url) return brand.logo.url;

  const slugKey = normalizeBrandKey(brand.slug);
  const nameKey = normalizeBrandKey(brand.name || brand.title);
  const aliasKey = brandAliases[(brand.name || brand.title || "").toLowerCase()];

  return localBrandLogos[slugKey] || localBrandLogos[nameKey] || localBrandLogos[aliasKey] || "";
};

export const getBrandName = (brand = {}) => brand.name || brand.title || "";

export const getBrandLetters = (name = "") =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
