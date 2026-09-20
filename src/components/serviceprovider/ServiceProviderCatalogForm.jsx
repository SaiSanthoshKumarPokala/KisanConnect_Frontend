import { useMemo, useRef, useState } from "react";
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ServiceProviderCatalogForm({
  title,
  introText,
  imageLabel,
  uploadText,
  submitText,
  initialData,
  fields,
  onBack,
  onSave,
  isModal = false,
}) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData.image || "");

  const requiredFields = useMemo(
    () => fields.filter((field) => field.required).map((field) => field.key),
    [fields]
  );

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setFormData((prev) => ({
        ...prev,
        image: base64String,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    const hasEmptyRequiredField = requiredFields.some(
      (key) => !String(formData[key] ?? "").trim()
    );

    if (hasEmptyRequiredField) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
    }, 250);
  };

  return (
    <div
      className={`font-montserrat ${
        isModal ? "min-h-auto bg-transparent" : "min-h-screen bg-darkgreen"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b border-[#c9a84c]/20 bg-black px-6 py-3.5 ${
          isModal ? "rounded-t-[22px]" : "rounded-none"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-[10px] border border-[#d4af37]/22 bg-transparent px-3.5 py-2.5 font-bold text-[#FFF085] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeftIcon className="size-4.5" />
            Back
          </button>
          <div className="text-[22px] font-extrabold text-[#FFF085]">{title}</div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className={isModal ? "p-[20px_24px_24px]" : "p-6"}>
        <div
          className={`max-w-215 p-6 ${
            isModal
              ? "bg-transparent border-none rounded-none shadow-none"
              : "rounded-[18px] border border-[#d4af37] bg-black shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_16px_36px_rgba(0,0,0,0.42)]"
          }`}
        >
          <div className="mb-5.5 text-sm text-white/70">{introText}</div>

          <div className="grid gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <div className="mb-2 text-sm font-bold text-[#FFF085]">
                  {field.label}
                  {field.required ? " *" : ""}
                </div>

                {field.type === "select" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-[#d4af37]/20 bg-darkgreen p-[14px_16px] text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    disabled={isLoading}
                    className="min-h-30 w-full resize-y rounded-xl border border-[#d4af37]/20 bg-darkgreen p-[14px_16px] text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-[#d4af37]/20 bg-darkgreen p-[14px_16px] text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                )}
              </div>
            ))}

            <div>
              <div className="mb-2 text-sm font-bold text-[#FFF085]">
                {imageLabel}
              </div>

              {imagePreview && (
                <div className="relative mb-3 overflow-hidden rounded-[14px] border border-[#d4af37]/30">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-55 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setFormData((prev) => ({ ...prev, image: "" }));
                    }}
                    disabled={isLoading}
                    className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full border-none bg-black/70 p-0 text-[#FFF085] disabled:cursor-not-allowed cursor-pointer"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-32.5 w-full flex-col items-center justify-center gap-2.5 rounded-[14px] border border-dashed border-[#d4af37]/40 bg-darkgreen text-white/70 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <PhotoIcon className="size-7 text-[#FFF085]" />
                <span>{uploadText}</span>
                <span className="text-xs text-white/45">PNG, JPG, WEBP</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isLoading}
                className="hidden"
              />
            </div>

            <div className="mt-1.5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="rounded-[14px] border border-[#d4af37]/30 bg-transparent px-5.5 py-3.5 text-[15px] font-extrabold text-[#FFF085] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="rounded-[14px] border-none bg-linear-to-br from-[#FFF085] to-gold px-5.5 py-3.5 text-[15px] font-extrabold text-[#111111] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer transition hover:brightness-105"
              >
                {isLoading ? "Saving..." : submitText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}