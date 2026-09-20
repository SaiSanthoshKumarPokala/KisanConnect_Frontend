export default function FeatureCard({ icon: Icon, title, description, layout = "stacked" }) {
  if (layout === "horizontal") {
    return (
      <div className="rounded-[1.75rem] border border-gold bg-black p-6 transition-all duration-200 hover:border-gold/80">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-2xl border border-gold bg-darkgreen p-3">
            <Icon className="size-8 text-gold" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gold">{title}</h3>
            <p className="mt-2 text-justify text-sm leading-7 text-white/75 md:text-base">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-gold bg-black p-6 transition-all duration-200 hover:border-gold/80">
      <div className="w-fit rounded-2xl border border-gold bg-darkgreen p-3">
        <Icon className="size-8 text-gold" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-gold">{title}</h3>
      <p className="mt-3 text-justify text-sm leading-7 text-white/75 md:text-base">
        {description}
      </p>
    </div>
  );
}