export default function ImpactCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-gold bg-black px-4 py-5 transition-transform duration-200 hover:-translate-y-1">
      <h3 className="text-lg font-bold text-gold">{title}</h3>
      <p className="mt-2 text-justify text-sm leading-6 text-white/75">{description}</p>
    </div>
  );
}