import { useMemo, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";

const TOOL_TABS = [
  {
    id: "price",
    label: "Crop Price Prediction",
    icon: "/prize.svg",
    mode: "form",
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
        { key: "dayOfWeek", label: "Day of Week", placeholder: "E.g. 5", type: "number" },
      ],
    ],
  },
  {
    id: "yield",
    label: "Crop Yield Prediction",
    icon: "/yield.svg",
    mode: "form",
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
    description:
      "Upload a clear crop image so the toolkit can inspect visible symptoms and prepare a disease prediction.",
  },
  {
    id: "recommendation",
    label: "Crop Recomendation",
    icon: "/best.svg",
    mode: "upload",
    description:
      "Upload a crop image to receive smart recommendations that can guide the next farming decision.",
  },
];

function FormField({ field, value, onChange }) {
  return (
    <label className="block rounded-[18px] border border-white/10 bg-[#050505] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="mb-2 block font-montserrat text-sm font-bold text-gold md:text-base">
        {field.label}
      </span>
      <input
        type={field.type || "text"}
        inputMode={field.type === "number" ? "numeric" : undefined}
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder}
        className="kc-ai-input w-full rounded-[12px] border border-white/18 bg-black px-4 py-3 font-montserrat text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none transition-all placeholder:text-white/40 focus:border-gold/45 md:text-lg"
      />
    </label>
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
}) {
  if (tool.mode === "upload") {
    return (
      <label className="flex h-full min-h-[260px] cursor-pointer flex-col items-center justify-center gap-6 rounded-[24px] border border-dashed border-white/20 bg-[#050505] px-6 py-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-gold/60 hover:bg-[#0b0b0b]">
        <input type="file" accept="image/*" className="hidden" onChange={onUploadChange} />
        {uploadPreview ? (
          <img
            src={uploadPreview}
            alt="Uploaded crop"
            className="max-h-[280px] w-auto cursor-pointer rounded-2xl object-contain shadow-[0_18px_48px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <div className="cursor-pointer rounded-[28px] border border-white/14 bg-black px-10 py-10 shadow-[0_18px_48px_rgba(0,0,0,0.4)]">
            <ArrowUpTrayIcon className="mx-auto size-28 stroke-[1.2]" />
          </div>
        )}
        <div className="text-center">
          <p className="text-3xl font-medium tracking-wide md:text-4xl">Upload img</p>
          <p className="mt-3 text-sm text-white/60">Choose an image from your device to continue</p>
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

export default function AIToolkit() {
  const { isOpen, setIsOpen, role, navigate } = UseAppContext();
  const [activeTool, setActiveTool] = useState("price");
  const [uploadPreviews, setUploadPreviews] = useState({
    disease: "",
    recommendation: "",
  });
  const [toolFormSteps, setToolFormSteps] = useState({
    price: 0,
    yield: 0,
  });
  const [toolForms, setToolForms] = useState({
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
  });

  const currentRole = role === "serviceprovider" ? "serviceprovider" : "farmer";
  const selectedTool = useMemo(
    () => TOOL_TABS.find((tool) => tool.id === activeTool) || TOOL_TABS[0],
    [activeTool]
  );

  const handleUploadChange = (toolId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setUploadPreviews((prev) => ({
      ...prev,
      [toolId]: previewUrl,
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

              <div className="grid min-h-[420px] grid-rows-[auto_minmax(0,1fr)_auto] rounded-[24px] border border-gold/20 bg-[url(/ai_bg.png)] bg-cover bg-center bg-black px-6 py-6 shadow-[0_18px_48px_rgba(0,0,0,0.45)] md:min-h-[520px] md:px-10 md:py-8">
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
                  />
                </div>
                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    className="min-w-[220px] cursor-pointer rounded-lg border border-gold/30 bg-gold px-[18px] py-[9px] font-montserrat text-xl font-bold tracking-[0.2px] text-[#0a1a0c] transition-all duration-200 ease-in hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
                  >
                    Generate
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
