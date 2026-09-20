import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import FormField from "./FormField";

export default function ToolkitPanel({
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
      <label className="flex h-full min-h-65 cursor-pointer flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-white/20 bg-[#050505] px-6 py-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-gold/60 hover:bg-[#0b0b0b]">
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onUploadChange}
        />
        {uploadPreview ? (
          <img
            src={uploadPreview}
            alt={tool.id === "recommendation" ? "Uploaded soil preview" : "Uploaded crop preview"}
            className="max-h-70 w-auto rounded-2xl object-contain shadow-[0_18px_48px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <div className="rounded-[28px] border border-white/15 bg-black px-10 py-10 shadow-[0_18px_48px_rgba(0,0,0,0.4)]">
            <ArrowUpTrayIcon className="size-24 stroke-[1.2] text-gold/80" aria-hidden="true" />
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
    <div className="flex h-full min-h-0 flex-col overflow-auto rounded-3xl border border-white/10 bg-[#050505] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="font-montserrat text-sm text-white/55 md:text-base">
          Step {formStep + 1} of {totalSteps}
        </div>
        <div className="flex gap-2">
          {tool.steps.map((_, index) => (
            <span
              key={`${tool.id}-step-${index}`}
              className={`h-2.5 w-8 rounded-full transition-colors ${
                index === formStep ? "bg-gold" : "bg-white/15"
              }`}
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
          className="rounded-xl border border-white/15 bg-transparent px-5 py-3 font-montserrat text-sm font-bold text-amber-200 transition hover:border-gold/45 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNextStep}
          disabled={formStep === totalSteps - 1}
          className="rounded-xl border border-gold/30 bg-gold px-5 py-3 font-montserrat text-sm font-black text-[#0a1a0c] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next
        </button>
      </div>
    </div>
  );
}