import { useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import FaqItem from "../components/faq/FaqItem";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { FAQS } from "../data/faqData";

export default function Faqs() {
  useDocumentTitle("FAQs");

  const [openId, setOpenId] = useState(1);

  const handleToggle = (id) => {
    setOpenId((prevId) => (prevId === id ? 0 : id));
  };

  return (
    <div className="min-h-screen bg-darkgreen font-montserrat text-white">
      <NavBar />

      <section className="relative overflow-hidden border-b border-gold/20 bg-darkgreen px-5 py-14 md:px-10 md:py-20">
        {/* Ambient Grid and Glow Effects */}
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-size-[88px_88px]" />
        <div className="pointer-events-none absolute left-0 top-16 size-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 size-80 rounded-full bg-gradstart/50 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Trusted by agriculture
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Frequently
            <span className="block text-gold">Asked Questions</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
            Find quick answers about Kisan Connect, how the platform works, and how farmers and service providers can use it more effectively.
          </p>
        </div>

        <div className="relative mx-auto mt-14 w-full max-w-4xl space-y-4">
          {FAQS.map((item) => (
            <FaqItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}