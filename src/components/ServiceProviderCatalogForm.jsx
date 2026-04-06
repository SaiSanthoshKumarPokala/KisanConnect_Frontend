import { useMemo, useRef, useState } from "react";
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { farmerStorageTheme as C } from "./farmerStorageTheme";

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
    <>
      <style>{`
        .sp-catalog-form-layout {
          min-height: ${isModal ? "auto" : "100vh"};
          background: #081D0C;
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      <div className="sp-catalog-form-layout" style={{ background: isModal ? "transparent" : "#081D0C" }}>
        <header
          style={{
            background: "#000000",
            borderBottom: `1px solid ${C.border}`,
            padding: "14px 24px",
            borderRadius: isModal ? "22px 22px 0 0" : "0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={onBack}
              disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(212, 175, 55, 0.22)",
                background: "transparent",
                color: "#FFF085",
                borderRadius: 10,
                padding: "10px 14px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: 700,
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              <ArrowLeftIcon style={{ width: 18, height: 18 }} />
              Back
            </button>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FFF085" }}>{title}</div>
          </div>
        </header>

        <div style={{ padding: isModal ? "20px 24px 24px" : "24px" }}>
          <div
            style={{
              maxWidth: 860,
              background: isModal ? "transparent" : "#000000",
              border: isModal ? "none" : "1px solid #d4af37",
              borderRadius: isModal ? "0" : "18px",
              boxShadow: isModal ? "none" : "0 0 0 1px rgba(212, 175, 55, 0.2), 0 16px 36px rgba(0, 0, 0, 0.42)",
              padding: 24,
            }}
          >
            <div style={{ color: C.textSub, fontSize: 14, marginBottom: 22 }}>{introText}</div>

            <div style={{ display: "grid", gap: 16 }}>
              {fields.map((field) => (
                <div key={field.key}>
                  <div style={{ color: "#FFF085", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                    {field.label}
                    {field.required ? " *" : ""}
                  </div>

                  {field.type === "select" ? (
                    <select
                      value={formData[field.key] || ""}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        background: "#081D0C",
                        border: "1px solid rgba(212, 175, 55, 0.2)",
                        borderRadius: 12,
                        padding: "14px 16px",
                        color: "#ffffff",
                        outline: "none",
                        fontSize: 14,
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? "not-allowed" : "pointer",
                      }}
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
                      style={{
                        width: "100%",
                        background: "#081D0C",
                        border: "1px solid rgba(212, 175, 55, 0.2)",
                        borderRadius: 12,
                        padding: "14px 16px",
                        color: "#ffffff",
                        outline: "none",
                        fontSize: 14,
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? "not-allowed" : "text",
                        resize: "vertical",
                        minHeight: 120,
                      }}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        background: "#081D0C",
                        border: "1px solid rgba(212, 175, 55, 0.2)",
                        borderRadius: 12,
                        padding: "14px 16px",
                        color: "#ffffff",
                        outline: "none",
                        fontSize: 14,
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? "not-allowed" : "text",
                      }}
                    />
                  )}
                </div>
              ))}

              <div>
                <div style={{ color: "#FFF085", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  {imageLabel}
                </div>

                {imagePreview && (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 14,
                      overflow: "hidden",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      marginBottom: 12,
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormData((prev) => ({ ...prev, image: "" }));
                      }}
                      disabled={isLoading}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(0, 0, 0, 0.7)",
                        border: "none",
                        color: "#FFF085",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        padding: 0,
                      }}
                    >
                      <XMarkIcon style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "100%",
                    minHeight: 130,
                    borderRadius: 14,
                    border: "1px dashed rgba(212, 175, 55, 0.4)",
                    background: "#081D0C",
                    color: C.textSub,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <PhotoIcon style={{ width: 28, height: 28, color: "#FFF085" }} />
                  <span>{uploadText}</span>
                  <span style={{ fontSize: 12, color: C.textMuted }}>PNG, JPG, WEBP</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                  style={{ display: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isLoading}
                  style={{
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    background: "transparent",
                    color: "#FFF085",
                    fontSize: 15,
                    fontWeight: 800,
                    padding: "14px 22px",
                    borderRadius: 14,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    border: "none",
                    background: "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)",
                    color: "#111111",
                    fontSize: 15,
                    fontWeight: 800,
                    padding: "14px 22px",
                    borderRadius: 14,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Saving..." : submitText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
