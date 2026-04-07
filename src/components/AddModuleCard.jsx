import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddModuleCard({
  onAdd,
  title,
  subtitle,
  minHeight = 300,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onAdd}
      style={{
        background: hovered ? "rgba(255, 240, 133, 0.08)" : "transparent",
        border: hovered ? "1px solid #FFF085" : "1px dashed rgba(212, 175, 55, 0.4)",
        borderRadius: 14,
        boxShadow: hovered ? "0 0 0 1px rgba(241, 216, 106, 0.36), 0 18px 40px rgba(0, 0, 0, 0.5)" : "none",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 40,
        textAlign: "center",
        cursor: "pointer",
        minHeight,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#111111",
        }}
      >
        <PlusIcon style={{ width: 48, height: 48, fontWeight: 700 }} />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#FFF085", marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.56)" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
