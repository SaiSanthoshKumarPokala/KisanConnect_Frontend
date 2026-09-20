export default function Tooltip({ text, children, position = "top" }) {
  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="group relative inline-flex items-center">
      {children}
      {text && (
        <div
          role="tooltip"
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-[#d4af37]/30 bg-black/90 px-2.5 py-1 font-montserrat text-[11px] font-semibold text-[#FFF085] shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${
            positionStyles[position] || positionStyles.top
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
}