export const DEFAULT_TRANSPORT_IMAGE = "/DCM.png";

export const TRANSPORT_SERVICE_CATEGORIES = [
  "Truck",
  "Mini Truck",
  "Pickup",
  "Tempo",
  "Reefer",
];

export const INITIAL_TRANSPORT_SERVICE_FORM = {
  name: "",
  category: "Truck",
  price: "",
  route: "",
  capacity: "",
  description: "",
  image: DEFAULT_TRANSPORT_IMAGE,
};

export const TRANSPORT_SERVICE_FIELDS = [
  {
    key: "name",
    label: "Vehicle Name",
    placeholder: "Enter vehicle name",
    required: true,
  },
  {
    key: "category",
    label: "Vehicle Type",
    type: "select",
    options: TRANSPORT_SERVICE_CATEGORIES,
    required: true,
  },
  {
    key: "price",
    label: "Price Per Km (Rs.)",
    type: "number",
    placeholder: "Enter price per km",
    required: true,
  },
  {
    key: "capacity",
    label: "Carrying Capacity",
    placeholder: "e.g. 5 Tonnes",
    required: true,
  },
  {
    key: "route",
    label: "Route / Coverage",
    placeholder: "Hyderabad to Warangal",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Share route, condition, driver support, and timing details",
    required: true,
  },
];