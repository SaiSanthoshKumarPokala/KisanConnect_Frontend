import {
  BuildingStorefrontIcon,
  BriefcaseIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

export const REGISTRATION_STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Maharashtra",
  "Karnataka",
  "Kerala",
];

export const INITIAL_USER_INFO_FORM = {
  name: "",
  email: "",
  address: "",
  phonenumber: "",
  dateofbirth: "",
  pincode: "",
  state: "",
  farmName: "",
  farmSize: "",
  primaryCrop: "",
  farmingExperience: "",
  irrigationType: "",
  businessName: "",
  serviceType: "",
  serviceArea: "",
  alternatePhone: "",
  gstNumber: "",
};

export const SERVICE_PROVIDER_FIELDS = [
  {
    key: "businessName",
    label: "Business Name",
    icon: BuildingStorefrontIcon,
    type: "text",
    placeholder: "Enter your business name",
  },
  {
    key: "serviceType",
    label: "Service Type",
    icon: BriefcaseIcon,
    type: "text",
    placeholder: "E.g. Transport, Cold Storage, Rentals",
  },
  {
    key: "serviceArea",
    label: "Service Area",
    icon: MapPinIcon,
    type: "text",
    placeholder: "Cities or districts you cover",
  },
  {
    key: "alternatePhone",
    label: "Alternate Phone",
    icon: PhoneIcon,
    type: "tel",
    placeholder: "Secondary contact number",
  },
  {
    key: "gstNumber",
    label: "GST / Business ID",
    icon: BuildingStorefrontIcon,
    type: "text",
    placeholder: "Optional business registration number",
  },
];

export const FARMER_FIELDS = [
  {
    key: "farmName",
    label: "Farm Name",
    icon: BuildingStorefrontIcon,
    type: "text",
    placeholder: "Enter your farm name",
  },
  {
    key: "farmSize",
    label: "Farm Size",
    icon: BriefcaseIcon,
    type: "text",
    placeholder: "E.g. 8 acres",
  },
  {
    key: "primaryCrop",
    label: "Primary Crop",
    icon: BuildingStorefrontIcon,
    type: "text",
    placeholder: "E.g. Paddy, Cotton",
  },
  {
    key: "farmingExperience",
    label: "Farming Experience",
    icon: CalendarIcon,
    type: "text",
    placeholder: "E.g. 12 years",
  },
  {
    key: "irrigationType",
    label: "Irrigation Type",
    icon: HomeIcon,
    type: "text",
    placeholder: "E.g. Drip, Borewell, Canal",
  },
];