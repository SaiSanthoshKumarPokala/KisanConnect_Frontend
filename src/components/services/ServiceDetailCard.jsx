export default function ServiceDetailCard({ service }) {
  const isImageRight = service.imagePosition === "right";

  return (
    <article className="flex flex-col items-center rounded-xl border-2 border-gold bg-black p-4 font-montserrat shadow-[0_12px_28px_rgba(0,0,0,0.35)] lg:p-6">
      <h2 className="my-2 text-center text-3xl font-extrabold text-gold md:text-4xl">
        {service.title}
      </h2>

      <div className="mt-4 flex w-full flex-col items-center justify-center gap-8 md:flex-row md:items-center md:justify-around md:gap-10">
        {/* Visual Media (Order configured for clean mobile-first responsiveness) */}
        <div
          className={`flex shrink-0 items-center justify-center ${
            isImageRight ? "md:order-2" : "md:order-1"
          }`}
        >
          <img
            src={service.image}
            alt={service.imageAlt || service.title}
            className="h-auto w-64 object-contain sm:w-72 md:w-80 lg:w-96"
          />
        </div>

        {/* Informational Points */}
        <div
          className={`flex flex-1 justify-center px-4 ${
            isImageRight ? "md:order-1" : "md:order-2"
          }`}
        >
          <ul className="list-outside list-disc space-y-3 text-sm leading-relaxed text-white/90 sm:text-base md:text-base lg:text-lg">
            {service.points.map((point, index) => (
              <li key={index} className="pl-1">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}