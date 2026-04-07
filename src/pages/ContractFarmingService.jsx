import { useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ModuleHeader from "../components/ModuleHeader";
import {
    ChevronDownIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import AddModuleCard from "../components/AddModuleCard";

const CROP_OPTIONS     = ["Rice / Paddy","Wheat","Cotton","Maize","Sugarcane","Soybean","Groundnut","Turmeric","Chilli","Tomato","Onion","Banana","Mango","Other"];
const SEASON_OPTIONS   = ["Kharif 2025","Rabi 2025-26","Zaid 2026","Kharif 2026"];
const DURATION_OPTIONS = ["1 month","2 months","3 months","4 months","5 months","6 months","1 year","2 years"];
const PAYMENT_OPTIONS  = ["On delivery","Within 7 days","Within 15 days","Within 30 days","50% advance + 50% on delivery"];
const SAMPLE_CONTRACTS = [
    {
        _id: "sample-1",
        crop: "Maize",
        variety: "Hybrid Yellow",
        company: "AgroCorp India Pvt. Ltd.",
        region: "Warangal, Telangana",
        season: "Kharif 2025",
        minLand: 5,
        totalLand: 120,
        farmersNeeded: 18,
        duration: "6 months",
        priceMin: 2200,
        priceMax: 2800,
        paymentTerms: "Within 15 days",
        inputSupport: true,
        status: "Active",
        applications: [
            { _id: "a-1", name: "Ramesh Goud", location: "Warangal", experience: "6 years", land: 8, phone: "9876543210", message: "Ready to join this season.", status: "Pending" },
            { _id: "a-2", name: "Meena Bai", location: "Hanamkonda", experience: "4 years", land: 6, phone: "9988776655", message: "Interested if seed support is included.", status: "Accepted" },
        ],
    },
    {
        _id: "sample-2",
        crop: "Chilli",
        variety: "Teja",
        company: "FreshRoots Processors",
        region: "Guntur, Andhra Pradesh",
        season: "Rabi 2025-26",
        minLand: 3,
        totalLand: 60,
        farmersNeeded: 12,
        duration: "4 months",
        priceMin: 5100,
        priceMax: 5900,
        paymentTerms: "50% advance + 50% on delivery",
        inputSupport: false,
        status: "Active",
        applications: [
            { _id: "a-3", name: "Venkatesh Rao", location: "Guntur", experience: "8 years", land: 5, phone: "9123456780", message: "Need quality grade details.", status: "Pending" },
        ],
    },
];

// ─── Farmer Application Row ───────────────────────────────────────────────────
function ApplicationRow({ app, onDecision }) {
    const statusStyle = {
        Pending:  "text-amber-400 border-amber-400 bg-amber-400/10",
        Accepted: "text-green-400 border-green-400 bg-green-400/10",
        Rejected: "text-red-400  border-red-400  bg-red-400/10",
    };
    return (
        <div className={`p-3 rounded-lg border mb-2 last:mb-0 ${app.status === "Accepted" ? "border-green-400/30 bg-green-900/10" : app.status === "Rejected" ? "border-red-400/30 bg-red-900/10" : "border-white/10 bg-black/20"}`}>
            <div className="flex items-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-black text-xs shrink-0">
                    {app.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{app.name}</p>
                    <p className="text-white/50 text-xs">{app.location} · {app.experience} · {app.land} acres</p>
                    <p className="text-white/40 text-xs mt-0.5">{app.phone}</p>
                    {app.message && <p className="text-white/50 text-xs mt-1 italic">"{app.message}"</p>}
                </div>
                <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full shrink-0 ${statusStyle[app.status]}`}>{app.status}</span>
            </div>
            {app.status === "Pending" && (
                <div className="flex gap-2 pl-10">
                    <button onClick={() => onDecision(app._id, "Accepted")}
                        className="flex flex-row items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                        <CheckCircleIcon className="size-4" /> Accept
                    </button>
                    <button onClick={() => onDecision(app._id, "Rejected")}
                        className="flex flex-row items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                        <XMarkIcon className="size-4" /> Reject
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Contract Card ────────────────────────────────────────────────────────────
function ContractFarmingServiceCard({ contract, onDecision, onClose }) {
    const [showApps, setShowApps] = useState(false);
    const fillPct  = contract.totalLand > 0 ? Math.min(100, Math.round((contract.applications.filter(a => a.status === "Accepted").reduce((s, a) => s + a.land, 0) / contract.totalLand) * 100)) : 0;
    const pending  = contract.applications.filter(a => a.status === "Pending").length;
    const accepted = contract.applications.filter(a => a.status === "Accepted").length;

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat transition-all duration-200 hover:-translate-y-1"
            style={{ borderColor: "#d4af37", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)" }}>
            {/* Image area */}
            <div className="bg-darkgreen rounded-t-xl flex items-center justify-center h-40 relative border-b border-gold/20">
                <img src="/contractdoc.svg" alt="Contract" className="size-24 opacity-80" />
                <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full border ${contract.status === "Active" ? "bg-green-500/20 border-green-400 text-green-400" : "bg-gray-500/20 border-gray-400 text-gray-400"}`}>
                    {contract.status}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col items-start gap-3 bg-black p-4 text-white">
                {/* Crop + company */}
                <div className="w-full">
                    <h1 className="text-lg font-bold text-gold">
                        {contract.crop}
                        {contract.variety && <span className="text-gold/60 text-sm font-normal"> — {contract.variety}</span>}
                    </h1>
                    <p className="text-white/70 text-sm">{contract.company}</p>
                </div>

                {/* Price box */}
                <div className="w-full bg-black/30 border border-gold/30 rounded-lg px-3 py-2 flex justify-between items-center">
                    <div>
                        <p className="text-gold font-bold">₹{contract.priceMin.toLocaleString()} – ₹{contract.priceMax.toLocaleString()}</p>
                        <p className="text-white/40 text-xs">per quintal</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white text-sm font-semibold">{contract.duration}</p>
                        <p className="text-white/40 text-xs">{contract.season}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="w-full text-sm space-y-1">
                    {[
                        ["📍 Region", contract.region],
                        ["🌾 Min Land", `${contract.minLand} acres/farmer`],
                        ["👥 Farmers Needed", contract.farmersNeeded],
                        ["💳 Payment", contract.paymentTerms],
                    ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-white/80">
                            <span>{k}</span>
                            <span className="text-white/50 text-xs text-right max-w-44 truncate">{v}</span>
                        </div>
                    ))}
                </div>

                {/* Tags */}
                <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${contract.inputSupport ? "border-gold/60 text-gold bg-gold/10" : "border-white/20 text-white/40"}`}>
                    {contract.inputSupport ? "✓ Input Support" : "No Input Support"}
                </span>

                {/* Progress */}
                <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Land contracted</span>
                        <span className="text-gold">{fillPct}% of {contract.totalLand} acres</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${fillPct}%` }} />
                    </div>
                </div>

                {/* App summary pills */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-semibold bg-amber-400/10 border border-amber-400/40 text-amber-400 px-2.5 py-1 rounded-lg">{pending} Pending</span>
                    <span className="text-xs font-semibold bg-green-400/10 border border-green-400/40 text-green-400 px-2.5 py-1 rounded-lg">{accepted} Accepted</span>
                    <span className="text-xs text-white/40 border border-white/10 px-2.5 py-1 rounded-lg">{contract.applications.length} total</span>
                </div>

                {/* View applications */}
                {contract.applications.length > 0 ? (
                    <button onClick={() => setShowApps(s => !s)}
                        className="flex flex-row items-center justify-center gap-2 bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full rounded-lg transition-all ease-in duration-150">
                        {showApps ? "Hide" : "View"} Farmer Applications
                        <ChevronDownIcon className={`size-4 transition-transform duration-200 ${showApps ? "rotate-180" : ""}`} />
                    </button>
                ) : (
                    <div className="w-full text-center py-2 text-white/30 text-xs border border-white/10 rounded-lg">
                        No applications yet — farmers will apply soon
                    </div>
                )}

                {/* Applications list */}
                {showApps && (
                    <div className="w-full border-t border-gold/20 pt-3 space-y-2">
                        <p className="text-gold text-[10px] font-black uppercase tracking-widest">Farmer Applications</p>
                        {contract.applications.map(app => (
                            <ApplicationRow key={app._id} app={app} onDecision={onDecision} />
                        ))}
                    </div>
                )}

                {/* Close contract */}
                {contract.status === "Active" && (
                    <button onClick={() => onClose(contract._id)}
                        className="flex flex-row items-center gap-2 bg-red-600/70 hover:bg-red-600 text-white text-xs font-bold py-2 px-3 cursor-pointer w-full rounded-lg text-nowrap lg:text-wrap transition-colors">
                        Close Contract
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContractFarmingService() {
    const { isOpen, setIsOpen, axios } = UseAppContext();

    const [contracts, setContracts] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [posting, setPosting]     = useState(false);
    const [isEmpty, setIsEmpty]     = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    // Form state
    const [fCompany, setFCompany]         = useState("");
    const [fCompanyType, setFCompanyType] = useState("");
    const [fCrop, setFCrop]               = useState("");
    const [fVariety, setFVariety]         = useState("");
    const [fRegion, setFRegion]           = useState("");
    const [fSeason, setFSeason]           = useState("Kharif 2025");
    const [fMinLand, setFMinLand]         = useState("");
    const [fTotalLand, setFTotalLand]     = useState("");
    const [fFarmers, setFFarmers]         = useState("");
    const [fDuration, setFDuration]       = useState("6 months");
    const [fPriceMin, setFPriceMin]       = useState("");
    const [fPriceMax, setFPriceMax]       = useState("");
    const [fQuality, setFQuality]         = useState("");
    const [fInput, setFInput]             = useState("Yes");
    const [fPayment, setFPayment]         = useState("Within 15 days of delivery");
    const [fNotes, setFNotes]             = useState("");

    // ── Fetch my contracts ────────────────────────────────────────────────────
    const fetchContracts = async () => {
        try {
            const { data } = await axios.get("/api/contractfarming/mycontracts");
            if (data.success) {
                const nextContracts = data.contracts.length > 0 ? data.contracts : SAMPLE_CONTRACTS;
                setContracts(nextContracts);
                setIsEmpty(nextContracts.length === 0);
            } else {
                setContracts(SAMPLE_CONTRACTS);
                setIsEmpty(false);
            }
        } catch (error) {
            setContracts(SAMPLE_CONTRACTS);
            setIsEmpty(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContracts(); }, []);

    // ── Post a contract ───────────────────────────────────────────────────────
    const handlePost = async () => {
        if (!fCrop || !fRegion || !fPriceMin || !fPriceMax || !fMinLand || !fTotalLand || !fFarmers || !fCompany) {
            return alert("Please fill all required fields.");
        }
        setPosting(true);
        try {
            const { data } = await axios.post("/api/contractfarming/post", {
                company: fCompany, companyType: fCompanyType,
                crop: fCrop, variety: fVariety, region: fRegion, season: fSeason,
                minLand: fMinLand, totalLand: fTotalLand, farmersNeeded: fFarmers,
                duration: fDuration, priceMin: fPriceMin, priceMax: fPriceMax,
                qualityStd: fQuality, inputSupport: fInput === "Yes",
                paymentTerms: fPayment, notes: fNotes
            });
            if (data.success) {
                // Add new contract with empty applications to list
                setContracts(prev => [{ ...data.contract, applications: [] }, ...prev]);
                setIsEmpty(false);
                setShowFormModal(false);
                // Reset form
                setFCompany(""); setFCompanyType(""); setFCrop(""); setFVariety("");
                setFRegion(""); setFMinLand(""); setFTotalLand(""); setFFarmers("");
                setFPriceMin(""); setFPriceMax(""); setFQuality(""); setFNotes("");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setPosting(false);
        }
    };

    // ── Accept / Reject application ───────────────────────────────────────────
    const handleDecision = async (applicationId, decision) => {
        try {
            const { data } = await axios.post("/api/contractfarming/decide", { applicationId, decision });
            if (data.success) {
                // Update application status in local state
                setContracts(prev => prev.map(c => ({
                    ...c,
                    applications: c.applications.map(a =>
                        a._id === applicationId ? { ...a, status: decision } : a
                    )
                })));
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // ── Close a contract ──────────────────────────────────────────────────────
    const handleClose = async (contractId) => {
        if (!window.confirm("Are you sure you want to close this contract?")) return;
        try {
            const { data } = await axios.post("/api/contractfarming/close", { contractId });
            if (data.success) {
                setContracts(prev => prev.map(c =>
                    c._id === contractId ? { ...c, status: "Closed" } : c
                ));
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <>
                <SideNav />
                <div className={`flex items-center justify-center h-dvh ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
                    <p className="text-white font-montserrat font-bold text-lg animate-pulse">Loading contracts...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <SideNav />

            {isEmpty ? (
                /* Empty state */
                <div className={`min-h-dvh bg-darkgreen ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
                    <div className="mx-2 my-4 flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center gap-6 rounded-[26px] border border-gold/30 bg-black p-10 text-center shadow-2xl md:mx-6">
                    <p className="font-bold text-xl text-white font-montserrat text-wrap">
                        You haven't posted any contracts yet. Get started by adding one.
                    </p>
                    <div className="w-full max-w-[320px]">
                        <AddModuleCard
                            onAdd={() => setShowFormModal(true)}
                            title="Add Contract Farming"
                            subtitle="Create your first contract listing"
                            minHeight={320}
                        />
                    </div>
                    </div>
                </div>
            ) : (
                <div className={`min-h-dvh bg-darkgreen ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
                    <div className="mx-2 my-4 overflow-hidden rounded-[26px] border border-gold/30 bg-darkgreen font-montserrat shadow-2xl md:mx-6">
                        <ModuleHeader
                            title="Contract Management"
                            search=""
                            onSearchChange={() => {}}
                            onOpenSidebar={() => setIsOpen(!isOpen)}
                        />
                    <div className="bg-[#081D0C] p-6">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
                        {contracts.map(c => (
                            <ContractFarmingServiceCard
                                key={c._id}
                                contract={c}
                                onDecision={handleDecision}
                                onClose={handleClose}
                            />
                        ))}
                        <AddModuleCard
                            onAdd={() => setShowFormModal(true)}
                            title="Add Contract Farming"
                            subtitle="Create one more contract listing"
                            minHeight={360}
                        />
                    </div>
                    </div>
                    </div>
                </div>
            )}

            {showFormModal && (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.76)",
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    zIndex: 300,
                }}
                onClick={() => !posting && setShowFormModal(false)}
            >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "min(860px, 100%)",
                    maxHeight: "min(88vh, 920px)",
                    overflow: "auto",
                    background: "#000000",
                    border: "1px solid rgba(212, 175, 55, 0.32)",
                    borderRadius: "22px",
                    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
                    fontFamily: "'Montserrat', sans-serif",
                }}
            >
                <div style={{ background: "#000000", borderBottom: "1px solid rgba(212, 175, 55, 0.22)", padding: "14px 24px" }}>
                <div className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-gold font-black text-lg">Post a New Contract</h2>
                        <p className="text-white/50 text-sm">Farmers will see and apply to this listing</p>
                    </div>
                    <button type="button" onClick={() => !posting && setShowFormModal(false)}>
                        <XCircleIcon className="size-8 cursor-pointer text-white hover:rotate-90 hover:text-red-500 transition-all ease-in duration-200" />
                    </button>
                </div>
                </div>

                <div className="bg-[#081D0C] p-6">
                <div className="mx-auto max-w-4xl rounded-[18px] border border-gold/20 bg-black/20 p-6">
                <div className="mb-5 text-sm text-white/60">
                    Fill the basic details for your contract listing so farmers can understand crop, pricing, land requirements, and payment terms at a glance.
                </div>
                <div className="flex flex-col gap-4">
                    {[
                        ["Company Name *", fCompany, setFCompany, "text", "e.g. AgroCorp India Pvt. Ltd."],
                        ["Company Type", fCompanyType, setFCompanyType, "text", "e.g. Food Processing"],
                        ["Variety / Specification", fVariety, setFVariety, "text", "e.g. Pusa 1121, Bt Cotton"],
                        ["Region / State *", fRegion, setFRegion, "text", "e.g. Telangana, AP"],
                        ["Min Land / Farmer (acres) *", fMinLand, setFMinLand, "number", "e.g. 5"],
                        ["Total Land Required (acres) *", fTotalLand, setFTotalLand, "number", "e.g. 500"],
                        ["Farmers Needed *", fFarmers, setFFarmers, "number", "e.g. 50"],
                        ["Min Price (₹/quintal) *", fPriceMin, setFPriceMin, "number", "e.g. 2200"],
                        ["Max Price (₹/quintal) *", fPriceMax, setFPriceMax, "number", "e.g. 2800"],
                        ["Quality Standards", fQuality, setFQuality, "text", "e.g. Grade A, moisture < 14%"],
                        ["Notes for Farmers", fNotes, setFNotes, "text", "Any additional instructions..."],
                    ].map(([label, val, setter, type, ph]) => (
                        <div key={label} className="flex flex-row gap-2 items-center">
                            <label className="text-gold font-bold text-xs w-40 shrink-0">{label}</label>
                            <input type={type} placeholder={ph} value={val}
                                onChange={e => setter(e.target.value)}
                                className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                        </div>
                    ))}

                    {/* Crop select */}
                    <div className="flex flex-row gap-2 items-center">
                        <label className="text-gold font-bold text-xs w-40 shrink-0">Crop Required *</label>
                        <select value={fCrop} onChange={e => setFCrop(e.target.value)}
                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-darkgreen text-white text-sm py-1">
                            <option value="">Select crop</option>
                            {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {[
                        ["Season", fSeason, setFSeason, SEASON_OPTIONS],
                        ["Duration", fDuration, setFDuration, DURATION_OPTIONS],
                        ["Payment Terms", fPayment, setFPayment, PAYMENT_OPTIONS],
                    ].map(([label, val, setter, opts]) => (
                        <div key={label} className="flex flex-row gap-2 items-center">
                            <label className="text-gold font-bold text-xs w-40 shrink-0">{label}</label>
                            <select value={val} onChange={e => setter(e.target.value)}
                                className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-darkgreen text-white text-sm py-1">
                                {opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}

                    {/* Input Support */}
                    <div className="flex flex-row gap-2 items-center">
                        <label className="text-gold font-bold text-xs w-40 shrink-0">Input Support</label>
                        <select value={fInput} onChange={e => setFInput(e.target.value)}
                            className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-darkgreen text-white text-sm py-1">
                            <option value="Yes">Yes — Provided</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="flex flex-row gap-3 mt-2 text-center">
                        <button type="button" onClick={() => setShowFormModal(false)}
                            className="flex-1 p-2 px-4 rounded-lg border-2 border-gold text-gold hover:bg-gold hover:text-darkgreen cursor-pointer font-bold transition-all ease-in duration-150">
                            Cancel
                        </button>
                        <button type="button" onClick={handlePost} disabled={posting}
                            className="flex-1 p-2 px-4 rounded-lg border-2 bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen border-gold cursor-pointer font-bold transition-all ease-in duration-150 disabled:opacity-50">
                            {posting ? "Posting..." : "Post Contract"}
                        </button>
                    </div>
                </div>
                </div>
                </div>
            </div>
            </div>
            )}
        </>
    );
}
