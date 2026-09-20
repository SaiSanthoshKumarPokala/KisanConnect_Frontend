import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export default function FaqItem({ item, isOpen, onToggle }) {
  const contentId = `faq-answer-${item.id}`;
  const headerId = `faq-question-${item.id}`;

  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border transition-all duration-200 ${
        isOpen
          ? "border-gold bg-black shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
          : "border-white/10 bg-[#101f13]"
      }`}
    >
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
      >
        <span
          className={`text-base font-bold transition-colors md:text-xl ${
            isOpen ? "text-gold" : "text-white"
          }`}
        >
          {item.question}
        </span>
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isOpen ? "border-gold bg-darkgreen" : "border-gold/40 bg-black"
          }`}
        >
          {isOpen ? (
            <MinusIcon className="size-5 text-gold" aria-hidden="true" />
          ) : (
            <PlusIcon className="size-5 text-gold" aria-hidden="true" />
          )}
        </span>
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={headerId}
          className="px-5 pb-6 md:px-6"
        >
          <div className="mb-4 h-px bg-gold/20" />
          <p className="max-w-3xl text-sm leading-7 text-white/80 md:text-base">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}