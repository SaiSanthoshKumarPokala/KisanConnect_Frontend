import { useState } from "react";
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
    <div
      className={`font-montserrat ${
        isModal ? "min-h-auto bg-transparent" : "min-h-screen bg-darkgreen"
      }`}
    >
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
            className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#d4af37]/22 bg-transparent px-3.5 py-2.5 font-bold text-[#FFF085] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeftIcon className="size-4.5" />
            Back
          </button>
          <div className="font-montserrat text-[22px] font-extrabold text-[#FFF085]">
            Add Cold Storage
          </div>
        </div>
      </header>

      <div className={isModal ? "p-[20px_24px_24px]" : "p-6"}>
        <div
          className={`max-w-215 p-6 ${
            isModal
              ? "bg-transparent border-none rounded-none shadow-none"
              : "rounded-[18px] border border-[#d4af37] bg-black shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_16px_36px_rgba(0,0,0,0.42)]"
          }`}
        >
          <div className="mb-5.5 text-sm text-white/70">
            Fill the basic details for your storage listing. We can add advanced fields in the next step.
          </div>

          <div className="grid gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <div className="mb-2 text-sm font-bold text-[#FFF085]">
                  {field.label}
                </div>
                <input
                  type={field.key === "capacity" || field.key === "price" ? "number" : "text"}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-[#d4af37]/20 bg-darkgreen p-[14px_16px] text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            ))}

            <div>
              <div className="mb-2 text-sm font-bold text-[#FFF085]">
                Upload images
              </div>
              
              {imagePreview.length > 0 && (
                <div className="mb-3 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
                  {imagePreview.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-xl border border-[#d4af37]/30"
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="h-25 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        disabled={isLoading}
                        className="absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full border-none bg-black/70 p-0 text-[#FFF085] disabled:cursor-not-allowed"
                      >
                        <XMarkIcon className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                disabled={isLoading}
                onClick={() => document.getElementById("image-upload").click()}
                className="flex min-h-32.5 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[14px] border border-dashed border-[#d4af37]/40 bg-darkgreen text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <PhotoIcon className="size-7 text-[#FFF085]" />
                <span>Click to upload storage images</span>
                <span className="text-xs text-white/45">PNG, JPG, WEBP (max 5MB each)</span>
              </button>
              
              <input
                id="image-upload"
                type="file"
                multiple
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
                className="cursor-pointer rounded-[14px] border border-[#d4af37]/30 bg-transparent px-5.5 py-3.5 font-montserrat text-[15px] font-extrabold text-[#FFF085] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="cursor-pointer rounded-[14px] border-none bg-linear-to-br from-[#FFF085] to-gold px-5.5 py-3.5 font-montserrat text-[15px] font-extrabold text-[#111111] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save Storage"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}