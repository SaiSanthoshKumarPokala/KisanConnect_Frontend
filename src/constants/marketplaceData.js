export const DEFAULT_MARKETPLACE_IMAGE = "/shop.avif";

export const MARKETPLACE_FILTERS = [
  "All",
  "Vegetables",
  "Fruits",
  "Crops",
  "Spices",
  "Dairy",
  "Other",
];

export const MARKETPLACE_FORM_FIELDS = [
  {
    key: "name",
    label: "Item Name",
    placeholder: "Enter crop or produce name",
    required: true,
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: ["Vegetables", "Fruits", "Crops", "Spices", "Dairy", "Other"],
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
    key: "location",
    label: "Farm Location",
    placeholder: "Enter your location",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Share quality, harvest timing, or handling details",
    required: true,
  },
];

export const INITIAL_MARKETPLACE_FORM = {
  name: "",
  category: "Vegetables",
  price: "",
  stock: "",
  location: "",
  description: "",
  image: DEFAULT_MARKETPLACE_IMAGE,
};

export function formatStock(stock) {
  if (stock > 0) return `${stock} kg`;
  if (stock === 0) return "Out of Stock";
  return "—";
}