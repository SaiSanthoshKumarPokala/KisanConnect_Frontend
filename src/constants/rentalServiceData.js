export const RENTAL_CATEGORIES = ["Harvester", "Tractor", "Seeder", "Rotavator"];

export const INITIAL_RENTAL_FORM = {
  name: "",
  category: "Harvester",
  price: "",
  location: "",
  description: "",
  image: "",
};

export const RENTAL_FORM_FIELDS = [
  {
    key: "name",
    label: "Machine Name",
    placeholder: "Enter machine name",
    required: true,
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: RENTAL_CATEGORIES,
    required: true,
  },
  {
    key: "price",
    label: "Price Per Day",
    type: "number",
    placeholder: "Enter price per day",
    required: true,
  },
  {
    key: "location",
    label: "Location",
    placeholder: "Enter machine location",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Share rental details, condition, and usage notes",
    required: true,
  },
];