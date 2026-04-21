import { useEffect, useMemo, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const PROXY_SOIL_MAP = {
  Alluvial: { n: 60, p: 45, k: 45, ph: 7.0 },
  Black: { n: 40, p: 50, k: 50, ph: 7.5 },
  Clay: { n: 30, p: 40, k: 45, ph: 7.2 },
  Laterite: { n: 15, p: 10, k: 10, ph: 5.0 },
  Loamy: { n: 50, p: 40, k: 40, ph: 6.5 },
  Red: { n: 20, p: 20, k: 20, ph: 6.0 },
  Sandy: { n: 10, p: 15, k: 15, ph: 5.5 },
};

const TOOL_TABS = [
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
      [{ key: "dayOfWeek", label: "Day of Week", placeholder: "0 = Monday, 6 = Sunday", type: "number" }],
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

const INITIAL_TOOL_FORM_STEPS = {
  price: 0,
  yield: 0,
};

const INITIAL_TOOL_FORMS = {
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

const INITIAL_RESULTS = {
  price: null,
  yield: null,
  disease: null,
  recommendation: null,
};

const NUMERIC_FIELDS = new Set([
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

function FormField({ field, value, onChange }) {
  return (
    <label className="block rounded-[18px] border border-white/10 bg-[#050505] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="mb-2 block font-montserrat text-sm font-bold text-gold md:text-base">
        {field.label}
      </span>
      <input
        type={field.type || "text"}
        required
        inputMode={field.type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder}
        className="kc-ai-input w-full rounded-[12px] border border-white/18 bg-black px-4 py-3 font-montserrat text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none transition-all placeholder:text-white/40 focus:border-gold/45 md:text-lg"
      />
    </label>
  );
}

function ResultCard({ result, isSubmitting, error, mode }) {
  const recommendationProxy =
    mode === "recommendation"
      ? result?.proxyMap || PROXY_SOIL_MAP[result?.soilType] || null
      : null;

  return (
    <div className="rounded-[18px] border border-white/10 bg-[#050505]/95 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-gold/25 bg-black px-3 py-1 font-montserrat text-xs font-bold uppercase tracking-[0.24em] text-gold/85">
          Model response
        </span>
        {isSubmitting ? (
          <span className="font-montserrat text-sm text-white/55">Running inference...</span>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 font-montserrat text-sm leading-6 text-[#ff9d9d]">{error}</p>
      ) : null}

      {!error && !result && !isSubmitting ? (
        <p className="mt-3 font-montserrat text-sm leading-6 text-white/55">
          Submit the current tool to see the prediction here.
        </p>
      ) : null}

      {result ? (
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
              Primary result
            </p>
            <p className="mt-2 font-montserrat text-2xl font-black capitalize text-[#FFF085] md:text-3xl">
              {typeof result.prediction === "number"
                ? `${result.prediction} ${result.unit || ""}`.trim()
                : result.prediction}
            </p>
            {result.confidence !== null && result.confidence !== undefined ? (
              <p className="mt-1 font-montserrat text-sm text-white/60">
                Confidence: {result.confidence}%
              </p>
            ) : null}
            {result.message ? (
              <p className="mt-2 font-montserrat text-sm leading-6 text-white/70">{result.message}</p>
            ) : null}
          </div>

          {mode === "recommendation" && result.soilType ? (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-montserrat text-sm uppercase tracking-[0.2em] text-white/45">
                  Soil classifier
                </p>
                <p className="mt-2 font-montserrat text-lg font-bold text-white">{result.soilType}</p>
                <p className="mt-1 font-montserrat text-sm text-gold/85">
                  Confidence: {result.soilConfidence}%
                </p>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-montserrat text-sm uppercase tracking-[0.2em] text-white/45">
                  GPS location
                </p>
                <p className="mt-2 font-montserrat text-sm text-white/75">
                  Lat: {result.weather?.latitude}
                </p>
                <p className="mt-1 font-montserrat text-sm text-white/75">
                  Lon: {result.weather?.longitude}
                </p>
                {result.weather?.city ? (
                  <p className="mt-1 font-montserrat text-sm text-gold/85">{result.weather.city}</p>
                ) : null}
              </div>
              <div className="rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-montserrat text-sm uppercase tracking-[0.2em] text-white/45">
                  OpenWeather
                </p>
                <p className="mt-2 font-montserrat text-sm text-white/75">
                  Temp: {result.weather?.temperature} deg C
                </p>
                <p className="mt-1 font-montserrat text-sm text-white/75">
                  Humidity: {result.weather?.humidity}%
                </p>
                <p className="mt-1 font-montserrat text-sm text-white/75">
                  Rainfall: {result.weather?.rainfall} mm
                </p>
                {result.weather?.description ? (
                  <p className="mt-1 font-montserrat text-sm capitalize text-gold/85">
                    {result.weather.description}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {mode === "recommendation" && recommendationProxy ? (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                Proxy soil map
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  ["N", recommendationProxy.n],
                  ["P", recommendationProxy.p],
                  ["K", recommendationProxy.k],
                  ["pH", recommendationProxy.ph],
                ].map(([label, value]) => (
                  <div
                    key={`${mode}-${label}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-sm text-white/50">{label}</p>
                    <p className="mt-1 font-montserrat text-base font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "recommendation" && result.inferredFeatures ? (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                Model inputs
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  ["N", result.inferredFeatures.nitrogen],
                  ["P", result.inferredFeatures.phosphorus],
                  ["K", result.inferredFeatures.potassium],
                  ["pH", result.inferredFeatures.ph],
                ].map(([label, value]) => (
                  <div
                    key={`${mode}-feature-${label}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-sm text-white/50">{label}</p>
                    <p className="mt-1 font-montserrat text-base font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {[
                  ["Temperature", result.inferredFeatures.temperature],
                  ["Humidity", result.inferredFeatures.humidity],
                  ["Rainfall", result.inferredFeatures.rainfall],
                ].map(([label, value]) => (
                  <div
                    key={`${mode}-weather-feature-${label}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-sm text-white/50">{label}</p>
                    <p className="mt-1 font-montserrat text-base font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "recommendation" && Array.isArray(result.featureArray) ? (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                7-feature array
              </p>
              <div className="mt-3 rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-mono text-sm text-gold/90">[{result.featureArray.join(", ")}]</p>
              </div>
            </div>
          ) : null}

          {Array.isArray(result.topMatches) && result.topMatches.length > 0 ? (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                Top matches
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {result.topMatches.map((match) => (
                  <div
                    key={`${mode}-${match.classId}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-base font-bold capitalize text-white">
                      {match.label}
                    </p>
                    <p className="mt-1 font-montserrat text-sm text-gold/85">{match.confidence}%</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ToolkitPanel({
  tool,
  uploadPreview,
  onUploadChange,
  formValue,
  onFormChange,
  formStep,
  onNextStep,
  onPrevStep,
  selectedFileName,
}) {
  if (tool.mode === "upload") {
    return (
      <label className="flex h-full min-h-[260px] cursor-pointer flex-col items-center justify-center gap-6 rounded-[24px] border border-dashed border-white/20 bg-[#050505] px-6 py-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-gold/60 hover:bg-[#0b0b0b]">
        <input type="file" accept="image/*" required className="hidden" onChange={onUploadChange} />
        {uploadPreview ? (
          <img
            src={uploadPreview}
            alt={tool.id === "recommendation" ? "Uploaded soil" : "Uploaded crop"}
            className="max-h-[280px] w-auto cursor-pointer rounded-2xl object-contain shadow-[0_18px_48px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <div className="cursor-pointer rounded-[28px] border border-white/14 bg-black px-10 py-10 shadow-[0_18px_48px_rgba(0,0,0,0.4)]">
            <ArrowUpTrayIcon className="mx-auto size-28 stroke-[1.2]" />
          </div>
        )}
        <div className="text-center">
          <p className="text-3xl font-medium tracking-wide md:text-4xl">
            {tool.id === "recommendation" ? "Upload soil image" : "Upload image"}
          </p>
          <p className="mt-3 text-sm text-white/60">
            {selectedFileName || "Choose an image from your device to continue"}
          </p>
        </div>
      </label>
    );
  }

  const totalSteps = tool.steps.length;
  const currentStepFields = tool.steps[formStep] || [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto rounded-[24px] border border-white/10 bg-[#050505] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="font-montserrat text-sm text-white/55 md:text-base">
          Step {formStep + 1} of {totalSteps}
        </div>
        <div className="flex gap-2">
          {tool.steps.map((_, index) => (
            <span
              key={`${tool.id}-step-${index}`}
              className={`h-2.5 w-8 rounded-full ${index === formStep ? "bg-gold" : "bg-white/15"}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {currentStepFields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={formValue[field.key] || ""}
            onChange={onFormChange}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevStep}
          disabled={formStep === 0}
          className="rounded-[12px] border border-white/14 bg-transparent px-5 py-3 font-montserrat text-sm font-bold text-[#FFF085] transition hover:border-gold/45 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNextStep}
          disabled={formStep === totalSteps - 1}
          className="rounded-[12px] border border-gold/30 bg-[#D4AF37] px-5 py-3 font-montserrat text-sm font-black text-[#0a1a0c] transition hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function buildPayload(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      NUMERIC_FIELDS.has(key) ? Number(value) : value.trim(),
    ])
  );
}

async function runTool(tool, values, file) {
  const endpoint = `${API_BASE_URL}${tool.endpoint}`;

  if (tool.mode === "upload") {
    const formData = new FormData();
    formData.append("file", file);
    if (tool.id === "recommendation") {
      formData.append("latitude", String(values.latitude));
      formData.append("longitude", String(values.longitude));
    }
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    return response;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildPayload(values)),
  });

  return response;
}

function validateToolInput(tool, values, file) {
  if (tool.mode === "upload") {
    if (!file) {
      throw new Error("Please upload an image before running this model.");
    }
    if (tool.id === "recommendation" && (!values.latitude || !values.longitude)) {
      throw new Error("Capture your GPS latitude and longitude before generating a recommendation.");
    }
    return;
  }

  const emptyField = tool.steps
    .flat()
    .find((field) => `${values?.[field.key] ?? ""}`.trim() === "");

  if (emptyField) {
    throw new Error(`Please fill in ${emptyField.label} before running this model.`);
  }
}

export default function AIToolkit() {
  const { isOpen, setIsOpen, role, navigate } = UseAppContext();
  const [activeTool, setActiveTool] = useState("price");
  const [uploadPreviews, setUploadPreviews] = useState({
    disease: "",
    recommendation: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({
    disease: null,
    recommendation: null,
  });
  const [toolFormSteps, setToolFormSteps] = useState(INITIAL_TOOL_FORM_STEPS);
  const [toolForms, setToolForms] = useState(INITIAL_TOOL_FORMS);
  const [toolResults, setToolResults] = useState(INITIAL_RESULTS);
  const [toolErrors, setToolErrors] = useState(INITIAL_RESULTS);
  const [submittingTool, setSubmittingTool] = useState("");
  const [gpsLocation, setGpsLocation] = useState({
    latitude: "",
    longitude: "",
    status: "GPS not captured yet.",
    error: "",
  });

  const currentRole = role === "serviceprovider" ? "serviceprovider" : "farmer";
  const selectedTool = useMemo(
    () => TOOL_TABS.find((tool) => tool.id === activeTool) || TOOL_TABS[0],
    [activeTool]
  );

  useEffect(() => {
    return () => {
      Object.values(uploadPreviews).forEach((previewUrl) => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      });
    };
  }, [uploadPreviews]);

  const handleUploadChange = (toolId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadPreviews((prev) => {
      if (prev[toolId]) {
        URL.revokeObjectURL(prev[toolId]);
      }

      return {
        ...prev,
        [toolId]: URL.createObjectURL(file),
      };
    });
    setSelectedFiles((prev) => ({
      ...prev,
      [toolId]: file,
    }));
    setToolErrors((prev) => ({
      ...prev,
      [toolId]: null,
    }));
  };

  const handleFormChange = (toolId, field, value) => {
    setToolForms((prev) => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        [field]: value,
      },
    }));
  };

  const handleToolStepChange = (toolId, direction) => {
    setToolFormSteps((prev) => {
      const tool = TOOL_TABS.find((item) => item.id === toolId);
      const maxStep = Math.max((tool?.steps?.length || 1) - 1, 0);
      const nextStep =
        direction === "next"
          ? Math.min((prev[toolId] || 0) + 1, maxStep)
          : Math.max((prev[toolId] || 0) - 1, 0);

      return {
        ...prev,
        [toolId]: nextStep,
      };
    });
  };

  const handleGenerate = async (requestValues = toolForms[selectedTool.id] || {}) => {
    setSubmittingTool(selectedTool.id);
    setToolErrors((prev) => ({
      ...prev,
      [selectedTool.id]: null,
    }));

    try {
      validateToolInput(selectedTool, requestValues, selectedFiles[selectedTool.id]);

      const response = await runTool(
        selectedTool,
        requestValues,
        selectedFiles[selectedTool.id]
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || "The model request failed.");
      }

      setToolResults((prev) => ({
        ...prev,
        [selectedTool.id]: payload,
      }));
    } catch (error) {
      setToolErrors((prev) => ({
        ...prev,
        [selectedTool.id]:
          error.message ||
          "Unable to connect to the FastAPI service. Start the backend and try again.",
      }));
    } finally {
      setSubmittingTool("");
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported in this browser.",
        status: "Unable to read GPS.",
      }));
      return;
    }

    setGpsLocation((prev) => ({
      ...prev,
      error: "",
      status: "Capturing current location...",
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          status: "GPS location captured.",
          error: "",
        });
      },
      (error) => {
        setGpsLocation((prev) => ({
          ...prev,
          error: error.message || "Unable to access location.",
          status: "Unable to read GPS.",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <div className="min-h-dvh bg-black">
      <style>{`
        .kc-ai-input::-webkit-outer-spin-button,
        .kc-ai-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .kc-ai-input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
      <SideNav />
      <div
        className={`flex min-h-dvh flex-col bg-black ${
          isOpen ? "md:ml-[250px]" : "md:ml-[80px]"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <div className="flex flex-1 flex-col px-4 py-5 md:px-8 md:py-6">
            <div className="mb-8 flex items-center justify-between gap-3 md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full border border-gold/30 bg-[#050505] px-4 py-2 text-sm font-semibold text-gold"
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => navigate(`/${currentRole}`)}
                className="rounded-full border border-gold/30 bg-[#050505] px-4 py-2 text-sm font-semibold text-white"
              >
                Dashboard
              </button>
            </div>

            <div className="mb-5 rounded-[22px] border border-gold/20 bg-[#050505] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:mb-6 md:px-8">
              <h1
                className="text-center font-montserrat text-[32px] font-extrabold text-[#FFF085] md:text-[40px]"
                style={{
                  textShadow: "0 0 18px rgba(255, 240, 133, 0.22), 0 0 8px rgba(212, 175, 55, 0.18)",
                  lineHeight: 1,
                }}
              >
                AI Toolkit
              </h1>
            </div>

            <div className="grid flex-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="flex flex-col gap-3 rounded-[24px] border border-gold/20 bg-[#050505] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-4">
                {TOOL_TABS.map((tool) => {
                  const isActive = tool.id === activeTool;

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setActiveTool(tool.id)}
                      className={`flex items-center gap-4 rounded-[20px] border px-5 py-5 text-left font-montserrat transition-all duration-200 ${
                        isActive
                          ? "border-gold/35 bg-gold text-darkgreen shadow-[0_12px_30px_rgba(212,175,55,0.18)]"
                          : "border-white/10 bg-[#050505] text-white hover:border-gold/20 hover:bg-[#0f0f0f]"
                      }`}
                    >
                      <div className={`rounded-full p-2.5 ${isActive ? "bg-white/70" : "bg-white"}`}>
                        <img src={tool.icon} alt="" className="size-8" />
                      </div>
                      <span className="text-lg font-bold md:text-[1.35rem]">{tool.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid min-h-[420px] grid-rows-[auto_minmax(0,1fr)_auto_auto] rounded-[24px] border border-gold/20 bg-[url(/ai_bg.png)] bg-cover bg-center bg-black px-6 py-6 shadow-[0_18px_48px_rgba(0,0,0,0.45)] md:min-h-[520px] md:px-10 md:py-8">
                <div className="mb-5 rounded-[18px] border border-white/10 bg-[#050505]/95 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="mt-2 max-w-3xl font-montserrat text-sm leading-6 text-white/65 md:text-base">
                    {selectedTool.description}
                  </p>
                </div>
                <div className="min-h-0">
                  <ToolkitPanel
                    tool={selectedTool}
                    uploadPreview={uploadPreviews[selectedTool.id]}
                    onUploadChange={(event) => handleUploadChange(selectedTool.id, event)}
                    formValue={toolForms[selectedTool.id] || {}}
                    onFormChange={(field, value) => handleFormChange(selectedTool.id, field, value)}
                    formStep={toolFormSteps[selectedTool.id] || 0}
                    onNextStep={() => handleToolStepChange(selectedTool.id, "next")}
                    onPrevStep={() => handleToolStepChange(selectedTool.id, "prev")}
                    selectedFileName={selectedFiles[selectedTool.id]?.name}
                  />
                </div>
                {selectedTool.id === "recommendation" ? (
                  <div className="rounded-[18px] border border-white/10 bg-[#050505]/95 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                          GPS Weather Input
                        </p>
                        <p className="mt-2 font-montserrat text-sm text-white/70">{gpsLocation.status}</p>
                        {gpsLocation.latitude && gpsLocation.longitude ? (
                          <p className="mt-1 font-montserrat text-sm text-gold/85">
                            {gpsLocation.latitude}, {gpsLocation.longitude}
                          </p>
                        ) : null}
                        {gpsLocation.error ? (
                          <p className="mt-1 font-montserrat text-sm text-[#ff9d9d]">{gpsLocation.error}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="rounded-[12px] border border-gold/30 bg-black px-5 py-3 font-montserrat text-sm font-bold text-[#FFF085] transition hover:border-gold/60 hover:bg-white/5"
                      >
                        Use Current Location
                      </button>
                    </div>
                  </div>
                ) : null}
                <div className="pt-6">
                  <ResultCard
                    result={toolResults[selectedTool.id]}
                    error={toolErrors[selectedTool.id]}
                    isSubmitting={submittingTool === selectedTool.id}
                    mode={selectedTool.id}
                  />
                </div>
                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        selectedTool.id === "recommendation" &&
                        (!gpsLocation.latitude || !gpsLocation.longitude)
                      ) {
                        setToolErrors((prev) => ({
                          ...prev,
                          recommendation: "Capture your current GPS location before generating a recommendation.",
                        }));
                        return;
                      }

                      handleGenerate(
                        selectedTool.id === "recommendation"
                          ? {
                              latitude: gpsLocation.latitude,
                              longitude: gpsLocation.longitude,
                            }
                          : toolForms[selectedTool.id] || {}
                      );
                    }}
                    disabled={submittingTool === selectedTool.id}
                    className="min-w-[220px] cursor-pointer rounded-lg border border-gold/30 bg-gold px-[18px] py-[9px] font-montserrat text-xl font-bold tracking-[0.2px] text-[#0a1a0c] transition-all duration-200 ease-in hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingTool === selectedTool.id ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
