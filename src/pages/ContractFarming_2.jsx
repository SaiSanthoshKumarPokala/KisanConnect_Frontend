import { useRef, useState, useMemo } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import {
    MagnifyingGlassIcon, MapPinIcon, FunnelIcon,
    ChevronDownIcon, CheckCircleIcon, XCircleIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelSolid, CheckBadgeIcon } from "@heroicons/react/24/solid";

// ─── Sample Contracts (replace with API call) ─────────────────────────────────
const SAMPLE_CONTRACTS = [
    {
        id: 1,
        company: "AgroCorp India Pvt. Ltd.",
        companyType: "Food Processing",
        crop: "Basmati Rice", variety: "Pusa 1121",
        region: "Telangana, Andhra Pradesh",
        minLand: 5, totalLandNeeded: 500, contractedLand: 320,
        farmersNeeded: 50, farmersContracted: 32,
        duration: "6 months", season: "Kharif 2025",
        priceMin: 2200, priceMax: 2800,
        qualityStd: "Grade A, moisture < 14%",
        inputSupport: true, paymentTerms: "Within 15 days of delivery",
        postedDate: "Apr 1, 2025", status: "Active",
    },
    {
        id: 2,
        company: "AgroCorp India Pvt. Ltd.",
        companyType: "Food Processing",
        crop: "Cotton", variety: "Bt Cotton",
        region: "Telangana",
        minLand: 3, totalLandNeeded: 300, contractedLand: 90,
        farmersNeeded: 30, farmersContracted: 9,
        duration: "5 months", season: "Kharif 2025",
        priceMin: 5500, priceMax: 6200,
        qualityStd: "Long staple, clean, no moisture",
        inputSupport: false, paymentTerms: "On delivery",
        postedDate: "Apr 2, 2025", status: "Active",
    },
    {
        id: 3,
        company: "NutriHarvest Foods Ltd.",
        companyType: "Agri Export",
        crop: "Turmeric", variety: "Salem / Alleppey",
        region: "Telangana, Karnataka",
        minLand: 2, totalLandNeeded: 150, contractedLand: 40,
        farmersNeeded: 20, farmersContracted: 5,
        duration: "8 months", season: "Kharif 2025",
        priceMin: 7000, priceMax: 9500,
        qualityStd: "Dry, clean, curcumin > 3%",
        inputSupport: true, paymentTerms: "50% advance + 50% on delivery",
        postedDate: "Apr 3, 2025", status: "Active",
    },
    {
        id: 4,
        company: "GreenField Organics Pvt. Ltd.",
        companyType: "Organic Processing",
        crop: "Groundnut", variety: "Bold / Java",
        region: "Andhra Pradesh, Telangana",
        minLand: 4, totalLandNeeded: 400, contractedLand: 200,
        farmersNeeded: 40, farmersContracted: 20,
        duration: "4 months", season: "Rabi 2025-26",
        priceMin: 5000, priceMax: 6000,
        qualityStd: "Moisture < 8%, no aflatoxin",
        inputSupport: true, paymentTerms: "Within 7 days of delivery",
        postedDate: "Apr 4, 2025", status: "Active",
    },
    {
        id: 5,
        company: "SunRise Agro Exports",
        companyType: "Agri Export",
        crop: "Chilli", variety: "Teja / 334",
        region: "Telangana, AP",
        minLand: 3, totalLandNeeded: 250, contractedLand: 50,
        farmersNeeded: 35, farmersContracted: 7,
        duration: "6 months", season: "Rabi 2025-26",
        priceMin: 9000, priceMax: 12000,
        qualityStd: "Dry, bright red, no mould",
        inputSupport: false, paymentTerms: "On delivery",
        postedDate: "Apr 5, 2025", status: "Active",
    },
    {
        id: 6,
        company: "FreshFarm Dairy Co.",
        companyType: "Dairy & Feed",
        crop: "Maize", variety: "Hybrid 1000",
        region: "Telangana",
        minLand: 2, totalLandNeeded: 600, contractedLand: 120,
        farmersNeeded: 60, farmersContracted: 12,
        duration: "3 months", season: "Kharif 2025",
        priceMin: 1800, priceMax: 2200,
        qualityStd: "Moisture < 14%, clean grain",
        inputSupport: true, paymentTerms: "Within 15 days of delivery",
        postedDate: "Apr 5, 2025", status: "Active",
    },
];

const CROPS    = ["All Crops", "Basmati Rice", "Cotton", "Turmeric", "Groundnut", "Chilli", "Maize", "Wheat"];
const REGIONS  = ["All Regions", "Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra"];
const SEASONS  = ["All Seasons", "Kharif 2025", "Rabi 2025-26", "Zaid 2026"];

// ─── Contract Card (Farmer view) ──────────────────────────────────────────────
function ContractFarmingCard({ contract, onApply, applied }) {
    const [showDetails, setShowDetails] = useState(false);
    const spotsLeft = contract.farmersNeeded - contract.farmersContracted;
    const fillPct   = Math.min(100, Math.round((contract.contractedLand / contract.totalLandNeeded) * 100));

    return (
        <div className="rounded-xl font-montserrat flex flex-col border-2 border-gold bg-darkgreen/70 w-80">
            {/* Card image area — contract icon */}
            <div className="bg-darkgreen rounded-t-xl flex items-center justify-center h-40 relative">
                <img src="/contractdoc.svg" alt="Contract" className="size-24 opacity-80" />
                {/* Status badge */}
                <span className="absolute top-3 right-3 bg-green-500/20 border border-green-400 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                    {contract.status}
                </span>
                {spotsLeft <= 5 && spotsLeft > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500/20 border border-red-400 text-red-400 text-xs font-bold px-2 py-1 rounded-full">
                        {spotsLeft} spots left!
                    </span>
                )}
            </div>

            {/* Card body */}
            <div className="flex flex-col items-start justify-evenly p-4 text-white bg-darkgreen rounded-b-xl gap-2">
                {/* Crop + company */}
                <div className="w-full">
                    <h1 className="text-lg font-bold text-gold">{contract.crop}
                        {contract.variety && <span className="text-gold/70 text-sm font-normal"> — {contract.variety}</span>}
                    </h1>
                    <p className="text-white/70 text-sm">{contract.company}</p>
                    <p className="text-white/50 text-xs">{contract.companyType}</p>
                </div>

                {/* Price highlight */}
                <div className="w-full bg-black/30 border border-gold/30 rounded-lg px-3 py-2 flex justify-between items-center">
                    <div>
                        <p className="text-gold font-bold text-base">₹{contract.priceMin.toLocaleString()} – ₹{contract.priceMax.toLocaleString()}</p>
                        <p className="text-white/50 text-xs">per quintal</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white text-sm font-semibold">{contract.duration}</p>
                        <p className="text-white/50 text-xs">{contract.season}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="w-full text-sm text-white/80 space-y-1">
                    <div className="flex justify-between">
                        <span>📍 Region</span>
                        <span className="text-white/60 text-xs text-right max-w-40 truncate">{contract.region}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>🌾 Min Land</span>
                        <span className="text-white/60 text-xs">{contract.minLand} acres / farmer</span>
                    </div>
                    <div className="flex justify-between">
                        <span>👥 Farmers</span>
                        <span className="text-white/60 text-xs">{contract.farmersNeeded} needed</span>
                    </div>
                    <div className="flex justify-between">
                        <span>💳 Payment</span>
                        <span className="text-white/60 text-xs text-right max-w-40 truncate">{contract.paymentTerms}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 w-full">
                    <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${contract.inputSupport ? "border-gold/60 text-gold bg-gold/10" : "border-white/20 text-white/40"}`}>
                        {contract.inputSupport ? "✓ Input Support" : "No Input Support"}
                    </span>
                </div>

                {/* Fill progress */}
                <div className="w-full">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>Contracts filled</span>
                        <span className="text-gold">{fillPct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full">
                        <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${fillPct}%` }} />
                    </div>
                </div>

                {/* Show more details toggle */}
                <button
                    onClick={() => setShowDetails(d => !d)}
                    className="flex flex-row items-center gap-1 text-xs text-gold hover:text-gold/70 transition-all"
                >
                    {showDetails ? "Hide details" : "View full details"}
                    <ChevronDownIcon className={`size-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
                </button>

                {showDetails && (
                    <div className="w-full bg-black/30 border border-gold/20 rounded-lg p-3 text-xs text-white/70 space-y-2">
                        <div>
                            <p className="text-gold font-bold uppercase tracking-wider text-[10px] mb-1">Quality Standards</p>
                            <p>{contract.qualityStd || "Not specified"}</p>
                        </div>
                        <div className="border-t border-gold/10 pt-2">
                            <p className="text-gold font-bold uppercase tracking-wider text-[10px] mb-1">Posted</p>
                            <p>{contract.postedDate}</p>
                        </div>
                    </div>
                )}

                {/* Action button */}
                {applied ? (
                    <div className="flex flex-row items-center justify-center gap-2 bg-green-600/20 border border-green-400/40 text-green-400 font-bold py-2 px-2 w-full rounded-lg text-sm">
                        <CheckBadgeIcon className="size-5" /> Application Submitted
                    </div>
                ) : (
                    <button
                        onClick={() => onApply(contract)}
                        className="bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full rounded-lg transition-all ease-in duration-150"
                    >
                        Apply Now →
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── My Applications Card ─────────────────────────────────────────────────────
function MyApplicationRow({ app, contracts }) {
    const contract = contracts.find(c => c.id === app.contractId);
    if (!contract) return null;
    const statusStyle = {
        Pending:  "bg-amber-400/20 border-amber-400 text-amber-400",
        Accepted: "bg-green-400/20 border-green-400 text-green-400",
        Rejected: "bg-red-400/20  border-red-400  text-red-400",
    };
    return (
        <div className="flex flex-row flex-wrap items-center gap-4 px-5 py-4 border-b border-gold/10 last:border-0">
            <img src="/contractdoc.svg" alt="" className="size-10 opacity-70" />
            <div className="flex-1 min-w-0">
                <p className="text-gold font-bold text-sm">{contract.crop} {contract.variety ? `— ${contract.variety}` : ""}</p>
                <p className="text-white/60 text-xs">{contract.company} · {contract.region}</p>
                <p className="text-white/40 text-xs mt-0.5">Applied {app.appliedOn}</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-gold text-sm font-bold">₹{contract.priceMin.toLocaleString()}–{contract.priceMax.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">per quintal</p>
                </div>
                <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${statusStyle[app.status]}`}>
                    {app.status}
                </span>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContractFarming2() {
    const { isOpen } = UseAppContext();

    const applyRef          = useRef(null);
    const [showFilters, setShowFilters]         = useState(true);
    const [targetContract, setTargetContract]   = useState(null);
    const [applications, setApplications]       = useState([]);
    const [submitted, setSubmitted]             = useState(false);
    const [search, setSearch]                   = useState("");
    const [cropFilter, setCropFilter]           = useState("All Crops");
    const [regionFilter, setRegionFilter]       = useState("All Regions");
    const [seasonFilter, setSeasonFilter]       = useState("All Seasons");

    // Form state
    const [fName, setFName]             = useState("");
    const [fPhone, setFPhone]           = useState("");
    const [fState, setFState]           = useState("");
    const [fDistrict, setFDistrict]     = useState("");
    const [fLand, setFLand]             = useState("");
    const [fExperience, setFExperience] = useState("");
    const [fCrop, setFCrop]             = useState("");
    const [fMessage, setFMessage]       = useState("");

    const appliedIds = applications.map(a => a.contractId);

    const handleOpenApply = (contract) => {
        setTargetContract(contract);
        setSubmitted(false);
        setFName(""); setFPhone(""); setFState(""); setFDistrict("");
        setFLand(""); setFExperience(""); setFCrop(""); setFMessage("");
        applyRef.current.showModal();
    };

    const handleSubmit = () => {
        if (!fName || !fPhone || !fLand || !fExperience) return;
        const newApp = {
            id: Date.now(),
            contractId: targetContract.id,
            name: fName,
            phone: fPhone,
            location: `${fDistrict}, ${fState}`,
            land: Number(fLand),
            experience: `${fExperience} yrs`,
            crop: fCrop,
            message: fMessage,
            appliedOn: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            status: "Pending",
            rating: 4.0,
        };
        setApplications(prev => [...prev, newApp]);
        setSubmitted(true);
    };

    const filtered = useMemo(() => {
        let list = [...SAMPLE_CONTRACTS];
        if (search) list = list.filter(c =>
            c.crop.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase()) ||
            c.region.toLowerCase().includes(search.toLowerCase())
        );
        if (cropFilter   !== "All Crops")   list = list.filter(c => c.crop === cropFilter);
        if (regionFilter !== "All Regions") list = list.filter(c => c.region.includes(regionFilter));
        if (seasonFilter !== "All Seasons") list = list.filter(c => c.season === seasonFilter);
        return list;
    }, [search, cropFilter, regionFilter, seasonFilter]);

    return (
        <>
            {/* Mobile filter toggle */}
            <button
                className="flex md:hidden flex-row gap-1 cursor-pointer items-center bg-linear-to-br from-gold to-yellow-200 border border-black p-2 rounded-full bottom-2 left-2 fixed z-50"
                onClick={() => setShowFilters(!showFilters)}
            >
                <FunnelSolid className="stroke-2 size-6 stroke-darkgreen fill-darkgreen" />
                <p>Filters</p>
            </button>

            <SideNav />

            <div className={`flex flex-col ${isOpen ? "md:ml-52" : "md:ml-16"}`}>

                {/* Filter bar */}
                {showFilters && (
                    <div className="filters md:sticky md:top-0 w-full h-fit m-auto bg-linear-to-r from-gold to-yellow-200 border-b border-darkgreen z-10">
                        <div className="flex flex-row flex-wrap w-11/12 h-fit m-auto rounded-md items-center my-4 gap-2 justify-center">
                            {/* Search */}
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <MagnifyingGlassIcon className="size-5 stroke-2 stroke-gold" />
                                <input
                                    type="search" placeholder="Search crop, company..."
                                    className="focus:outline-0 font-normal text-black w-40"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            {/* Crop */}
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <select className="focus:outline-0 font-normal text-black" value={cropFilter} onChange={e => setCropFilter(e.target.value)}>
                                    {CROPS.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            {/* Region */}
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <MapPinIcon className="size-5 stroke-2 stroke-gold" />
                                <select className="focus:outline-0 font-normal text-black" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            {/* Season */}
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <select className="focus:outline-0 font-normal text-black" value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)}>
                                    {SEASONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* My Applications section */}
                {applications.length > 0 && (
                    <div className="w-11/12 m-auto my-4">
                        <div className="border-2 border-gold rounded-xl overflow-hidden font-montserrat">
                            <div className="bg-gold px-5 py-3 flex items-center justify-between">
                                <p className="text-darkgreen font-black text-sm uppercase tracking-widest">My Applications</p>
                                <span className="text-darkgreen text-xs font-bold">{applications.length} submitted</span>
                            </div>
                            <div className="bg-darkgreen/70">
                                {applications.map(app => (
                                    <MyApplicationRow key={app.id} app={app} contracts={SAMPLE_CONTRACTS} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contracts grid */}
                {filtered.length > 0 ? (
                    <div className="flex flex-row flex-wrap items-center justify-center w-10/12 md:w-11/12 gap-8 m-auto my-4">
                        {filtered.map(c => (
                            <ContractFarmingCard
                                key={c.id}
                                contract={c}
                                applied={appliedIds.includes(c.id)}
                                onApply={handleOpenApply}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center w-11/12 m-auto my-8">
                        <DocumentTextIcon className="size-16 stroke-gold opacity-30" />
                        <p className="text-white/50 font-montserrat font-bold text-lg">No contracts match your filters</p>
                        <button
                            onClick={() => { setSearch(""); setCropFilter("All Crops"); setRegionFilter("All Regions"); setSeasonFilter("All Seasons"); }}
                            className="text-gold underline underline-offset-4 font-semibold text-sm"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Apply dialog */}
            <dialog ref={applyRef} className="m-auto p-0 rounded-xl bg-transparent backdrop:backdrop-blur-sm w-full max-w-lg">
                <div className="bg-darkgreen border-2 border-gold rounded-xl font-montserrat overflow-hidden">
                    {/* Dialog header */}
                    <div className="bg-gold px-6 py-4 flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-darkgreen font-black text-lg">Apply for Contract</h2>
                            {targetContract && (
                                <p className="text-darkgreen/70 text-sm mt-0.5">
                                    {targetContract.crop} {targetContract.variety ? `— ${targetContract.variety}` : ""} · {targetContract.company}
                                </p>
                            )}
                        </div>
                        <button type="button" onClick={() => applyRef.current.close()}>
                            <XCircleIcon className="size-8 cursor-pointer hover:rotate-90 transition-all ease-in duration-200 hover:scale-105 fill-darkgreen hover:fill-red-600" />
                        </button>
                    </div>

                    <div className="p-6">
                        {!submitted ? (
                            <>
                                {/* Quick contract summary */}
                                {targetContract && (
                                    <div className="bg-black/30 border border-gold/30 rounded-lg px-4 py-3 mb-5 grid grid-cols-3 gap-3 text-center">
                                        {[
                                            ["Price", `₹${targetContract.priceMin.toLocaleString()}–${targetContract.priceMax.toLocaleString()}`],
                                            ["Min Land", `${targetContract.minLand} acres`],
                                            ["Duration", targetContract.duration],
                                        ].map(([k, v]) => (
                                            <div key={k}>
                                                <p className="text-gold font-bold text-sm">{v}</p>
                                                <p className="text-white/50 text-[10px] mt-0.5">{k}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Form fields */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0">Full Name: <span className="text-red-400">*</span></label>
                                        <input type="text" value={fName} onChange={e => setFName(e.target.value)} placeholder="Your full name"
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0">Mobile: <span className="text-red-400">*</span></label>
                                        <input type="tel" value={fPhone} onChange={e => setFPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0">State:</label>
                                        <input type="text" value={fState} onChange={e => setFState(e.target.value)} placeholder="e.g. Telangana"
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0">District:</label>
                                        <input type="text" value={fDistrict} onChange={e => setFDistrict(e.target.value)} placeholder="e.g. Nalgonda"
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0">Land (acres): <span className="text-red-400">*</span></label>
                                        <input type="number" min="0" step="0.5" value={fLand} onChange={e => setFLand(e.target.value)}
                                            placeholder={targetContract ? `Min ${targetContract.minLand} acres` : "Your land size"}
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0">Experience (yrs): <span className="text-red-400">*</span></label>
                                        <input type="number" min="0" value={fExperience} onChange={e => setFExperience(e.target.value)} placeholder="e.g. 8"
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0">Current Crop:</label>
                                        <input type="text" value={fCrop} onChange={e => setFCrop(e.target.value)} placeholder="e.g. Paddy, Cotton..."
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                    </div>
                                    <div className="flex flex-row gap-2 items-start">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0 pt-1">Message:</label>
                                        <textarea rows={2} value={fMessage} onChange={e => setFMessage(e.target.value)}
                                            placeholder="Why are you a good fit for this contract?"
                                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 resize-none transition-all" />
                                    </div>

                                    {targetContract && fLand && Number(fLand) < targetContract.minLand && (
                                        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                                            ⚠ Your land ({fLand} acres) is below the minimum required ({targetContract.minLand} acres).
                                        </p>
                                    )}

                                    <div className="flex flex-row gap-3 mt-2 text-center">
                                        <button type="button" onClick={() => applyRef.current.close()}
                                            className="flex-1 p-2 px-4 rounded-lg border-2 border-gold text-gold hover:bg-gold hover:text-darkgreen cursor-pointer font-bold transition-all ease-in duration-150">
                                            Cancel
                                        </button>
                                        <button type="button" onClick={handleSubmit}
                                            disabled={!fName || !fPhone || !fLand || !fExperience}
                                            className={`flex-1 p-2 px-4 rounded-lg border-2 font-bold transition-all ease-in duration-150
                                                ${fName && fPhone && fLand && fExperience
                                                    ? "bg-gold hover:bg-yellow-200 text-darkgreen border-gold cursor-pointer"
                                                    : "bg-gold/30 text-darkgreen/40 border-gold/30 cursor-not-allowed"}`}>
                                            Submit Application
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <CheckCircleIcon className="size-16 stroke-green-400 mx-auto mb-4" />
                                <h3 className="text-gold font-black text-xl mb-2">Application Sent!</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-1">
                                    Your application for <span className="text-white font-semibold">{targetContract?.crop}</span> with <span className="text-white font-semibold">{targetContract?.company}</span> has been submitted.
                                </p>
                                <p className="text-white/40 text-xs mb-6">The company will review and respond soon.</p>
                                <button onClick={() => applyRef.current.close()}
                                    className="bg-gold hover:bg-yellow-200 text-darkgreen font-bold py-2 px-8 rounded-lg cursor-pointer transition-all ease-in duration-150">
                                    Back to Contracts
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </dialog>
        </>
    );
}
