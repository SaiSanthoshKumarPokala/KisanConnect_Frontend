export const PROXY_SOIL_MAP = {
  Alluvial: { n: 60, p: 45, k: 45, ph: 7.0 },
  Black: { n: 40, p: 50, k: 50, ph: 7.5 },
  Clay: { n: 30, p: 40, k: 45, ph: 7.2 },
  Laterite: { n: 15, p: 10, k: 10, ph: 5.0 },
  Loamy: { n: 50, p: 40, k: 40, ph: 6.5 },
  Red: { n: 20, p: 20, k: 20, ph: 6.0 },
  Sandy: { n: 10, p: 15, k: 15, ph: 5.5 },
};

export const TOOL_TABS = [
  {
    id: "price",
    label: "Crop Price Prediction",
    icon: "/prize.svg",
    mode: "form",
    endpoint: "/api/price-prediction",
    description:
      "Enter the latest market and crop details to estimate likely pricing outcomes for the selected commodity.",
    steps: [
      [
        { key: "stateCode", label: "State Code", placeholder: "E.g. 32", type: "number" },
        { key: "districtCode", label: "District Code", placeholder: "E.g. 554", type: "number" },
        { key: "marketCode", label: "Market Code", placeholder: "E.g. 10926", type: "number" },
        { key: "commodity", label: "Commodity", placeholder: "E.g. Amphophalus", type: "text" },
      ],
      [
        { key: "variety", label: "Variety", placeholder: "E.g. Other", type: "text" },
        { key: "arrivalsTonnes", label: "Arrivals (tonnes)", placeholder: "E.g. 2.0", type: "number" },
        { key: "year", label: "Year", placeholder: "E.g. 2026", type: "number" },
        { key: "month", label: "Month", placeholder: "E.g. 2", type: "number" },
      ],
      [
        { key: "dayOfWeek", label: "Day of Week", placeholder: "0 = Monday, 6 = Sunday", type: "number" },
      ],
    ],
  },
  {
    id: "yield",
    label: "Crop Yield Prediction",
    icon: "/yield.svg",
    mode: "form",
    endpoint: "/api/yield-prediction",
    description:
      "Share your crop, season, and cultivation area so the toolkit can prepare a projected yield estimate.",
    steps: [
      [
        { key: "stateName", label: "State Name", placeholder: "E.g. Telangana", type: "text" },
        { key: "districtName", label: "District Name", placeholder: "E.g. Adilabad", type: "text" },
        { key: "season", label: "Season", placeholder: "E.g. Kharif", type: "text" },
        { key: "cropName", label: "Crop Name", placeholder: "E.g. Arhar/Tur", type: "text" },
      ],
      [
        { key: "cropType", label: "Crop Type", placeholder: "E.g. Pulses", type: "text" },
        { key: "startYear", label: "Start Year", placeholder: "E.g. 2024", type: "number" },
        { key: "area", label: "Area", placeholder: "E.g. 35000.0", type: "number" },
      ],
    ],
  },
  {
    id: "disease",
    label: "Crop Disease Prediction",
    icon: "/disease.svg",
    mode: "upload",
    endpoint: "/api/disease-prediction",
    description:
      "Upload a clear crop image so the toolkit can inspect visible symptoms and prepare a disease prediction.",
  },
  {
    id: "recommendation",
    label: "Crop Recommendation",
    icon: "/best.svg",
    mode: "upload",
    endpoint: "/api/crop-recommendation",
    description:
      "Upload a soil image, capture GPS latitude and longitude, fetch live OpenWeather conditions, derive proxy NPK and pH from the classified soil type, and generate a crop recommendation.",
  },
];

export const INITIAL_TOOL_FORM_STEPS = {
  price: 0,
  yield: 0,
};

export const INITIAL_TOOL_FORMS = {
  price: {
    stateCode: "",
    districtCode: "",
    marketCode: "",
    commodity: "",
    variety: "",
    arrivalsTonnes: "",
    year: "",
    month: "",
    dayOfWeek: "",
  },
  yield: {
    stateName: "",
    districtName: "",
    season: "",
    cropName: "",
    cropType: "",
    startYear: "",
    area: "",
  },
};

export const INITIAL_RESULTS = {
  price: null,
  yield: null,
  disease: null,
  recommendation: null,
};

export const NUMERIC_FIELDS = new Set([
  "stateCode",
  "districtCode",
  "marketCode",
  "arrivalsTonnes",
  "year",
  "month",
  "dayOfWeek",
  "startYear",
  "area",
]);