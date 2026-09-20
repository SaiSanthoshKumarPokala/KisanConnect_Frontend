import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AboutHero from "../components/about/AboutHero";
import ImpactCard from "../components/about/ImpactCard";
import FeatureCard from "../components/about/FeatureCard";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { PILLARS, IMPACT_METRICS, VISION_ITEMS } from "../data/aboutData";

export default function About() {
  useDocumentTitle("About Us");

  return (
    <div className="min-h-screen bg-darkgreen font-montserrat text-white">
      <NavBar />

      <AboutHero />

      {/* Main Narrative & Vision Section */}
      <section className="relative -mt-1 overflow-hidden bg-darkgreen px-5 py-12 md:px-10 md:py-16">
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Main Story & Impact */}
          <div className="rounded-4xl border border-gold bg-black p-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)] md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">About Us</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Empowering agriculture through connected services and useful technology.
            </h2>
            <div className="mt-5 space-y-4 text-justify text-base leading-7 text-white/80 md:text-lg">
              <p>
                Agriculture works best when support is easy to reach and simple to understand. Farmers often need access to equipment, transport, inputs, storage, and reliable information at the right time, but these needs are usually spread across different platforms and processes.
              </p>
              <p>
                Kisan Connect brings these needs into one platform with a strong focus on clarity, accessibility, and usefulness. We want the experience to feel straightforward for users while still offering meaningful value through modern digital support.
              </p>
              <p>
                By making services easier to discover and coordination easier to manage, Kisan Connect supports a more connected agricultural ecosystem for both farmers and service providers.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {IMPACT_METRICS.map((item) => (
                <ImpactCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          {/* Vision, Mission, and Purpose */}
          <div className="grid gap-4">
            {VISION_ITEMS.map((item) => (
              <FeatureCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                layout="horizontal"
              />
            ))}

            <div className="rounded-[1.75rem] border border-gold bg-black p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Why It Matters</p>
              <p className="mt-3 text-justify text-base leading-8 text-white/80 md:text-lg">
                Strong agriculture depends on strong coordination. When farmers can access the right support at the right time, everyday operations become smoother, decisions become better informed, and outcomes become more dependable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-darkgreen px-5 py-4 pb-16 md:px-10 md:py-8 md:pb-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-full max-w-40 bg-gold/45" />
            <h2 className="text-center text-3xl font-extrabold text-gold md:text-4xl">
              What Defines Kisan Connect
            </h2>
            <div className="h-px w-full max-w-40 bg-gold/45" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {PILLARS.map((item) => (
              <FeatureCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                layout="stacked"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}