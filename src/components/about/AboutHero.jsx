export default function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-gold/20 bg-[url('/aboutSectionImage.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-linear-to-b from-darkgreen/50 via-darkgreen/70 to-darkgreen" />
      
      <div className="relative mx-auto flex min-h-128 w-11/12 max-w-6xl flex-col items-center justify-center py-16 text-center md:min-h-152 md:py-24">
        <h1 className="text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
          <span className="text-white">About </span>
          <span className="text-gold">Kisan Connect</span>
        </h1>
        <p className="mt-6 max-w-4xl text-justify text-base leading-7 text-white/90 md:text-lg">
          Kisan Connect is built to support agriculture with a more connected, practical, and technology-enabled experience. We bring important farming services together so users can discover opportunities faster, access resources more easily, and make decisions with greater confidence.
        </p>
        <p className="mt-4 max-w-4xl text-justify text-base leading-7 text-white/80 md:text-lg">
          Our goal is to reduce the gap between farmers and the support systems they depend on every season. By combining service discovery, agricultural assistance, and digital tools in one platform, Kisan Connect aims to make everyday farming operations more efficient, organized, and dependable.
        </p>
        <p className="mt-4 max-w-4xl text-justify text-base leading-7 text-white/80 md:text-lg">
          This project is centered around accessibility, trust, and practical value. Rather than adding complexity, we focus on creating a clean and useful experience that helps farmers spend less time searching for support and more time acting on what matters.
        </p>
      </div>
    </section>
  );
}