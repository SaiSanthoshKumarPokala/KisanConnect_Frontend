import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function Faqs() {
    const faqs = [
        {
            id: 1,
            question: "What is Kisan Connect and who is it for?",
            answer: "Kisan Connect is a digital agriculture platform designed to support farmers and service providers in one place. It helps users discover services like rentals, transport, fertilizers, storage, and AI-based farming support through a simple and connected experience.",
        },
        {
            id: 2,
            question: "What services can I access through Kisan Connect?",
            answer: "Users can explore agricultural support such as machinery rentals, transportation services, fertilizers, contract farming support, storage-related features, and AI toolkit services that assist with planning and farm-related decisions.",
        },
        {
            id: 3,
            question: "Do I need to create an account to use the platform?",
            answer: "You can browse parts of the landing experience without logging in, but creating an account gives you access to the full platform experience, including role-based features, dashboards, and service interactions.",
        },
        {
            id: 4,
            question: "How does Kisan Connect help farmers make better decisions?",
            answer: "Kisan Connect brings useful tools and services into one platform, reducing the effort required to search across multiple sources. This helps farmers act faster, compare options more clearly, and access support with better confidence.",
        },
        {
            id: 5,
            question: "Can service providers also use Kisan Connect?",
            answer: "Yes. The platform is designed for both farmers and service providers. Service providers can use it to present their offerings, connect with users more efficiently, and become part of a stronger agricultural support network.",
        },
    ];

    const [openId, setOpenId] = useState(1);

    return (
        <div className="min-h-screen bg-darkgreen font-montserrat text-white">
            <NavBar />

            <section className="relative overflow-hidden border-b border-gold/20 bg-darkgreen px-5 py-14 md:px-10 md:py-20">
                <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px)] [background-size:88px_88px]" />
                <div className="pointer-events-none absolute left-0 top-16 size-72 rounded-full bg-gold/10 blur-3xl" />
                <div className="pointer-events-none absolute right-0 bottom-10 size-80 rounded-full bg-gradstart/50 blur-3xl" />

                <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Trusted by agriculture</p>
                    <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                        Frequently
                        <span className="block text-gold">Asked Questions</span>
                    </h1>
                    <p className="mt-6 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
                        Find quick answers about Kisan Connect, how the platform works, and how farmers and service providers can use it more effectively.
                    </p>
                </div>

                <div className="relative mx-auto mt-14 w-full max-w-4xl space-y-4">
                    {faqs.map((item) => {
                        const isOpen = openId === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`overflow-hidden rounded-[1.75rem] border transition-all duration-200 ${isOpen
                                    ? "border-gold bg-black shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
                                    : "border-white/10 bg-[#101f13]"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenId(isOpen ? 0 : item.id)}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                                >
                                    <span className={`text-base font-bold md:text-xl ${isOpen ? "text-gold" : "text-white"}`}>
                                        {item.question}
                                    </span>
                                    <span className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${isOpen ? "border-gold bg-darkgreen" : "border-gold/40 bg-black"}`}>
                                        {isOpen ? (
                                            <MinusIcon className="size-5 text-gold" />
                                        ) : (
                                            <PlusIcon className="size-5 text-gold" />
                                        )}
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-6 md:px-6">
                                        <div className="mb-4 h-px bg-gold/20" />
                                        <p className="max-w-3xl text-sm leading-7 text-white/80 md:text-base">
                                            {item.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </div>
    );
}
