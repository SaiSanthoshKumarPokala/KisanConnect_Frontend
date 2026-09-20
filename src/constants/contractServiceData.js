export const CROP_OPTIONS = [
  "Rice / Paddy",
  "Wheat",
  "Cotton",
  "Maize",
  "Sugarcane",
  "Soybean",
  "Groundnut",
  "Turmeric",
  "Chilli",
  "Tomato",
  "Onion",
  "Banana",
  "Mango",
  "Other",
];

export const SEASON_OPTIONS = [
  "Kharif 2025",
  "Rabi 2025-26",
  "Zaid 2026",
  "Kharif 2026",
];

export const DURATION_OPTIONS = [
  "1 month",
  "2 months",
  "3 months",
  "4 months",
  "5 months",
  "6 months",
  "1 year",
  "2 years",
];

export const PAYMENT_OPTIONS = [
  "On delivery",
  "Within 7 days",
  "Within 15 days",
  "Within 30 days",
  "50% advance + 50% on delivery",
];

export const INITIAL_POST_FORM = {
  company: "",
  companyType: "",
  crop: "",
  variety: "",
  region: "",
  season: "Kharif 2025",
  minLand: "",
  totalLand: "",
  farmersNeeded: "",
  duration: "6 months",
  priceMin: "",
  priceMax: "",
  qualityStd: "",
  inputSupport: "Yes",
  paymentTerms: "Within 15 days of delivery",
  notes: "",
};

export const normalizeServiceContract = (contract = {}) => ({
  ...contract,
  _id: contract._id || `contract-${Date.now()}`,
  crop: contract.crop || "Contract Crop",
  variety: contract.variety || "",
  company: contract.company || "Kisan Connect Partner",
  region: contract.region || "Region not specified",
  season: contract.season || "Current season",
  minLand: Number(contract.minLand || 0),
  totalLand: Number(contract.totalLand || 0),
  farmersNeeded: Number(contract.farmersNeeded || 0),
  duration: contract.duration || "Flexible",
  priceMin: Number(contract.priceMin || 0),
  priceMax: Number(contract.priceMax || 0),
  paymentTerms: contract.paymentTerms || "To be discussed",
  inputSupport: Boolean(contract.inputSupport),
  status: contract.status || "Active",
  applications: Array.isArray(contract.applications) ? contract.applications : [],
});