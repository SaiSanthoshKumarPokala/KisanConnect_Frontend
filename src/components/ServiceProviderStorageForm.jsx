import { useState } from "react";
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { farmerStorageTheme as C } from "./farmerStorageTheme";

export default function ServiceProviderStorageForm({ onBack, onSave, initialData = null, isModal = false }) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    location: "",
    capacity: "",
    price: "",
    images: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.images || []);

  const fields = [
    { key: "name", label: "Storage Name", placeholder: "Enter storage name" },
    { key: "location", label: "Location", placeholder: "Enter location" },
    { key: "capacity", label: "Capacity", placeholder: "Enter total capacity" },
    { key: "price", label: "Price per day", placeholder: "Enter price per day" },
  ];

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview((prev) => [...prev, base64String]);
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), base64String],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.name.trim() || !formData.location.trim() || !formData.capacity.trim() || !formData.price.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSave({
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseInt(formData.price),
        available: parseInt(formData.capacity),
        status: "available",
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <style>{`
        .sp-form-layout {
          min-height: ${isModal ? "auto" : "100vh"};
          background: #081D0C;
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      <div className="sp-form-layout" style={{ background: isModal ? "transparent" : "#081D0C" }}>
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
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800, color: "#FFF085" }}>
              Add Cold Storage
            </div>
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
            <div style={{ color: C.textSub, fontSize: 14, marginBottom: 22 }}>
              Fill the basic details for your storage listing. We can add advanced fields in the next step.
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {fields.map((field) => (
                <div key={field.key}>
                  <div style={{ color: "#FFF085", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                    {field.label}
                  </div>
                  <input
                    type={field.key === "capacity" || field.key === "price" ? "number" : "text"}
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
                </div>
              ))}

              <div>
                <div style={{ color: "#FFF085", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  Upload images
                </div>
                
                {imagePreview.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10, marginBottom: 12 }}>
                    {imagePreview.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: "relative",
                          borderRadius: 12,
                          overflow: "hidden",
                          border: `1px solid rgba(212, 175, 55, 0.3)`,
                        }}
                      >
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          disabled={isLoading}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            width: 24,
                            height: 24,
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
                          <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => document.getElementById("image-upload").click()}
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
                  <span>Click to upload storage images</span>
                  <span style={{ fontSize: 12, color: C.textMuted }}>PNG, JPG, WEBP (max 5MB each)</span>
                </button>
                
                <input
                  id="image-upload"
                  type="file"
                  multiple
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
                    fontFamily: "'Montserrat', sans-serif",
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
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 15,
                    fontWeight: 800,
                    padding: "14px 22px",
                    borderRadius: 14,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Saving..." : "Save Storage"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
