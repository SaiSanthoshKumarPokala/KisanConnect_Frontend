import { useEffect, useMemo, useState } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ToolkitPanel from "../components/ai-toolkit/ToolkitPanel";
import ResultCard from "../components/ai-toolkit/ResultCard";
import useGeolocation from "../hooks/useGeolocation";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { submitToolRequest } from "../services/aiToolkitService";
import { validateToolInput } from "../utils/aiToolkitHelpers";
import {
  TOOL_TABS,
  INITIAL_TOOL_FORM_STEPS,
  INITIAL_TOOL_FORMS,
  INITIAL_RESULTS,
} from "../constants/aiToolkitData";

export default function AIToolkit() {
  useDocumentTitle("AI Toolkit");

  const { isOpen, setIsOpen, role, navigate } = UseAppContext();
  const { gpsLocation, captureLocation } = useGeolocation();

  const [activeTool, setActiveTool] = useState("price");
  const [uploadPreviews, setUploadPreviews] = useState({ disease: "", recommendation: "" });
  const [selectedFiles, setSelectedFiles] = useState({ disease: null, recommendation: null });
  const [toolFormSteps, setToolFormSteps] = useState(INITIAL_TOOL_FORM_STEPS);
  const [toolForms, setToolForms] = useState(INITIAL_TOOL_FORMS);
  const [toolResults, setToolResults] = useState(INITIAL_RESULTS);
  const [toolErrors, setToolErrors] = useState(INITIAL_RESULTS);
  const [submittingTool, setSubmittingTool] = useState("");

  const currentRole = role === "serviceprovider" ? "serviceprovider" : "farmer";
  const selectedTool = useMemo(
    () => TOOL_TABS.find((tool) => tool.id === activeTool) || TOOL_TABS[0],
    [activeTool]
  );

  // Revoke object URLs to prevent browser memory leaks
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
      if (prev[toolId]) URL.revokeObjectURL(prev[toolId]);
      return { ...prev, [toolId]: URL.createObjectURL(file) };
    });

    setSelectedFiles((prev) => ({ ...prev, [toolId]: file }));
    setToolErrors((prev) => ({ ...prev, [toolId]: null }));
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

      return { ...prev, [toolId]: nextStep };
    });
  };

  const handleGenerate = async (requestValues = toolForms[selectedTool.id] || {}) => {
    setSubmittingTool(selectedTool.id);
    setToolErrors((prev) => ({ ...prev, [selectedTool.id]: null }));

    try {
      validateToolInput(selectedTool, requestValues, selectedFiles[selectedTool.id]);

      const payload = await submitToolRequest(
        selectedTool,
        requestValues,
        selectedFiles[selectedTool.id]
      );

      setToolResults((prev) => ({ ...prev, [selectedTool.id]: payload }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Unable to connect to the prediction service. Check your connection and try again.";

      setToolErrors((prev) => ({ ...prev, [selectedTool.id]: errorMessage }));
    } finally {
      setSubmittingTool("");
    }
  };

  return (
    <div className="min-h-dvh bg-black">
      <SideNav />

      <div
        className={`flex min-h-dvh flex-col bg-black transition-[margin] duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <div className="flex flex-1 flex-col px-4 py-5 md:px-8 md:py-6">
            
            {/* Mobile Header Bar */}
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

            {/* Page Header */}
            <div className="mb-5 rounded-[22px] border border-gold/20 bg-[#050505] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:mb-6 md:px-8">
              <h1 className="text-center font-montserrat text-[32px] font-extrabold leading-none text-amber-200 drop-shadow-[0_0_12px_rgba(255,240,133,0.22)] md:text-[40px]">
                AI Toolkit
              </h1>
            </div>

            {/* Main Workspace Layout */}
            <div className="grid flex-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              {/* Tool Navigation Sidebar */}
              <div className="flex flex-col gap-3 rounded-3xl border border-gold/20 bg-[#050505] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-4">
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

              {/* Active Tool Stage */}
              <div className="grid min-h-105 grid-rows-[auto_minmax(0,1fr)_auto_auto] rounded-3xl border border-gold/20 bg-[url('/ai_bg.png')] bg-cover bg-center bg-black px-6 py-6 shadow-[0_18px_48px_rgba(0,0,0,0.45)] md:min-h-130 md:px-10 md:py-8">
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

                {/* GPS Panel (Conditional) */}
                {selectedTool.id === "recommendation" && (
                  <div className="mt-6 rounded-[18px] border border-white/10 bg-[#050505]/95 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                          GPS Weather Input
                        </p>
                        <p className="mt-2 font-montserrat text-sm text-white/70">{gpsLocation.status}</p>
                        {gpsLocation.latitude && gpsLocation.longitude && (
                          <p className="mt-1 font-montserrat text-sm text-gold/85">
                            {gpsLocation.latitude}, {gpsLocation.longitude}
                          </p>
                        )}
                        {gpsLocation.error && (
                          <p className="mt-1 font-montserrat text-sm text-red-400">{gpsLocation.error}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={captureLocation}
                        className="rounded-xl border border-gold/30 bg-black px-5 py-3 font-montserrat text-sm font-bold text-amber-200 transition hover:border-gold/60 hover:bg-white/5"
                      >
                        Use Current Location
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <ResultCard
                    result={toolResults[selectedTool.id]}
                    error={toolErrors[selectedTool.id]}
                    isSubmitting={submittingTool === selectedTool.id}
                    mode={selectedTool.id}
                  />
                </div>

                {/* Submit Action */}
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
                          ? { latitude: gpsLocation.latitude, longitude: gpsLocation.longitude }
                          : toolForms[selectedTool.id] || {}
                      );
                    }}
                    disabled={submittingTool === selectedTool.id}
                    className="min-w-55 cursor-pointer rounded-lg border border-gold/30 bg-gold px-4.5 py-2.25 font-montserrat text-xl font-bold tracking-[0.2px] text-[#0a1a0c] transition-all duration-200 ease-in hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
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