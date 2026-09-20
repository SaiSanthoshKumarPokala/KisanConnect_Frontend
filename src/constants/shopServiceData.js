export const DEFAULT_PRODUCT_IMAGE = "/urea.png";

export const SHOP_SERVICE_CATEGORIES = [
  "Fertilizers",
  "Seeds",
  "Pesticides",
  "Equipment",
  "Other",
];

export const INITIAL_SHOP_SERVICE_FORM = {
  name: "",
  brand: "",
  category: "Fertilizers",
  price: "",
  stock: "",
  description: "",
  image: DEFAULT_PRODUCT_IMAGE,
};

export const SHOP_SERVICE_FIELDS = [
  {
    key: "name",
    label: "Product Name",
    placeholder: "Enter product name",
    required: true,
  },
  {
    key: "brand",
    label: "Brand / Seller",
    placeholder: "Enter brand or seller name",
    required: true,
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: SHOP_SERVICE_CATEGORIES,
    required: true,
  },
  {
    key: "price",
    label: "Price Per Kg",
    type: "number",
    placeholder: "Enter price per kg",
    required: true,
  },
  {
    key: "stock",
    label: "Available Stock (kg)",
    type: "number",
    placeholder: "e.g. 500",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Share product usage, brand quality, and stock notes",
    required: true,
  },
];