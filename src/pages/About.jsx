import {
    ArrowTrendingUpIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    Squares2X2Icon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function About() {
    const pillars = [
        {
            id: 1,
            title: "Connected Services",
            description: "We bring transport, rentals, fertilizers, storage, and market support into one place so farmers can discover the right help without switching across disconnected channels.",
            icon: Squares2X2Icon,
        },
        {
            id: 2,
            title: "Practical Intelligence",
            description: "Our platform is designed around useful agricultural support, helping users move from uncertainty to better planning with guidance that is simple, relevant, and actionable.",
            icon: CpuChipIcon,
        },
        {
            id: 3,
            title: "Trusted Coordination",
            description: "Kisan Connect strengthens the connection between farmers and service providers by improving access, visibility, and timing throughout the farming cycle.",
            icon: ShieldCheckIcon,
        },
    ];

    const impact = [
        { id: 1, title: "One unified platform", description: "for services, support, and discovery." },
        { id: 2, title: "Better decision support", description: "for timing, planning, and execution." },
        { id: 3, title: "Stronger ecosystem links", description: "between farmers and providers." },
    ];

    const vision = [
        {
            id: 1,
            title: "Our Mission",
            description: "To simplify agricultural support by making important services and technology easier to access for every farmer.",
            icon: UserGroupIcon,
        },
        {
            id: 2,
            title: "Our Vision",
            description: "To build a stronger agricultural ecosystem where services are connected, decisions are smarter, and support is available when it matters most.",
            icon: ArrowTrendingUpIcon,
        },
    ];

    return (
        <div className="min-h-screen bg-darkgreen font-montserrat text-white">
            <NavBar />

            <section className="relative overflow-hidden border-b border-gold/20 bg-[url(/aboutSectionImage.jpg)] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 bg-linear-to-b from-darkgreen/50 via-darkgreen/70 to-darkgreen" />
                <div className="relative mx-auto flex min-h-[32rem] w-11/12 max-w-6xl flex-col items-center justify-center py-16 text-center md:min-h-[38rem] md:py-24">
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

            <section className="relative -mt-1 overflow-hidden bg-darkgreen px-5 py-12 md:px-10 md:py-16">
                <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[2rem] border border-gold bg-black p-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)] md:p-8">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">About Us</p>
                        <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
                            Empowering agriculture through connected services and useful technology.
                        </h2>
                        <p className="mt-5 text-justify text-base leading-7 text-white/80 md:text-lg">
                            Agriculture works best when support is easy to reach and simple to understand. Farmers often need access to equipment, transport, inputs, storage, and reliable information at the right time, but these needs are usually spread across different platforms and processes.
                        </p>
                        <p className="mt-4 text-justify text-base leading-7 text-white/80 md:text-lg">
                            Kisan Connect brings these needs into one platform with a strong focus on clarity, accessibility, and usefulness. We want the experience to feel straightforward for users while still offering meaningful value through modern digital support.
                        </p>
                        <p className="mt-4 text-justify text-base leading-7 text-white/80 md:text-lg">
                            By making services easier to discover and coordination easier to manage, Kisan Connect supports a more connected agricultural ecosystem for both farmers and service providers.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {impact.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-gold bg-black px-4 py-5">
                                    <h3 className="text-lg font-bold text-gold">{item.title}</h3>
                                    <p className="mt-2 text-justify text-sm leading-6 text-white/75">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {vision.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.id} className="rounded-[1.75rem] border border-gold bg-black p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-2xl border border-gold bg-darkgreen p-3">
                                            <Icon className="size-8 text-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gold">{item.title}</h3>
                                            <p className="mt-2 text-justify text-sm leading-7 text-white/75 md:text-base">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="rounded-[1.75rem] border border-gold bg-black p-6">
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Why It Matters</p>
                            <p className="mt-3 text-justify text-base leading-8 text-white/80 md:text-lg">
                                Strong agriculture depends on strong coordination. When farmers can access the right support at the right time, everyday operations become smoother, decisions become better informed, and outcomes become more dependable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-darkgreen px-5 py-4 pb-16 md:px-10 md:py-8 md:pb-24">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-8 flex items-center justify-center gap-3">
                        <div className="h-px w-full max-w-40 bg-gold/45" />
                        <h2 className="text-center text-3xl font-extrabold text-gold md:text-4xl">What Defines Kisan Connect</h2>
                        <div className="h-px w-full max-w-40 bg-gold/45" />
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        {pillars.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.id} className="rounded-[1.75rem] border border-gold bg-black p-6">
                                    <div className="w-fit rounded-2xl border border-gold bg-darkgreen p-3">
                                        <Icon className="size-8 text-gold" />
                                    </div>
                                    <h3 className="mt-5 text-2xl font-bold text-gold">{item.title}</h3>
                                    <p className="mt-3 text-justify text-sm leading-7 text-white/75 md:text-base">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
