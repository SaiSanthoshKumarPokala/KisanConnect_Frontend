import { useRef, useState, useEffect, useMemo } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    ChevronDownIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { FunnelIcon } from "@heroicons/react/24/solid";

const CROPS = ["All Crops", "Rice / Paddy", "Wheat", "Cotton", "Maize", "Sugarcane", "Groundnut", "Turmeric", "Chilli", "Tomato", "Other"];
const REGIONS = ["All Regions", "Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu", "Odisha", "Punjab", "Haryana"];
const SEASONS = ["All Seasons", "Kharif 2025", "Rabi 2025-26", "Zaid 2026", "Kharif 2026"];

// ─── My Application Row ───────────────────────────────────────────────────────
function MyApplicationRow({ app }) {
    const contract = app.contract;
    const statusStyle = {
        Pending: "text-amber-400 border-amber-400 bg-amber-400/10",
        Accepted: "text-green-400 border-green-400 bg-green-400/10",
        Rejected: "text-red-400  border-red-400  bg-red-400/10",
    };
    return (
        <div className="flex flex-row flex-wrap items-center gap-4 px-5 py-4 border-b border-gold/10 last:border-0">
            <img src="/contractdoc.svg" alt="" className="size-10 opacity-70" />
            <div className="flex-1 min-w-0">
                <p className="text-gold font-bold text-sm">
                    {contract?.crop}{contract?.variety ? ` — ${contract.variety}` : ""}
                </p>
                <p className="text-white/60 text-xs">{contract?.company} · {contract?.region}</p>
                <p className="text-white/40 text-xs mt-0.5">Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                    <p className="text-gold text-sm font-bold">₹{contract?.priceMin?.toLocaleString()}-{contract?.priceMax?.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">per quintal</p>
                </div>
                <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${statusStyle[app.status]}`}>{app.status}</span>
            </div>
        </div>
    );
}

// ─── Contract Card ────────────────────────────────────────────────────────────
function ContractFarmingCard({ contract, applied, onApply }) {
    const [showDetails, setShowDetails] = useState(false);
    const fillPct = contract.totalLand > 0
        ? Math.min(100, Math.round((contract.acceptedLand / contract.totalLand) * 100))
        : 0;

    return (
        <div className="rounded-xl font-montserrat flex flex-col border-2 border-gold bg-darkgreen/70 min-w-72 max-w-80">
            {/* Image area */}
            <div className="bg-darkgreen rounded-t-xl flex items-center justify-center h-40 relative">
                <img src="/contractdoc.svg" alt="Contract" className="size-24 opacity-80" />
                <span className="absolute top-3 right-3 bg-green-500/20 border border-green-400 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                    {contract.status}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col items-start justify-evenly p-4 text-white bg-darkgreen rounded-b-xl gap-2">
                {/* Crop + company */}
                <div>
                    <h1 className="text-lg font-bold text-gold">
                        {contract.crop}
                        {contract.variety && <span className="text-gold/60 text-sm font-normal"> — {contract.variety}</span>}
                    </h1>
                    <p className="text-white/60 text-sm">{contract.company}</p>
                    <p className="text-white/40 text-xs">{contract.companyType}</p>
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
                        ["🌾 Min Land", `${contract.minLand} acres / farmer`],
                        ["👥 Farmers Needed", contract.farmersNeeded],
                        ["💳 Payment", contract.paymentTerms],
                    ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-white/80">
                            <span>{k}</span>
                            <span className="text-white/50 text-xs text-right max-w-40 truncate">{v}</span>
                        </div>
                    ))}
                </div>

                {/* Input support tag */}
                <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${contract.inputSupport ? "border-gold/60 text-gold bg-gold/10" : "border-white/20 text-white/40"}`}>
                    {contract.inputSupport ? "✓ Input Support" : "No Input Support"}
                </span>

                {/* Fill progress */}
                <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Contracts filled</span>
                        <span className="text-gold">{fillPct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${fillPct}%` }} />
                    </div>
                </div>

                {/* Show more */}
                <button onClick={() => setShowDetails(d => !d)}
                    className="flex flex-row items-center gap-1 text-xs text-gold hover:text-gold/70 transition-all">
                    {showDetails ? "Hide details" : "View full details"}
                    <ChevronDownIcon className={`size-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
                </button>

                {showDetails && (
                    <div className="w-full bg-black/30 border border-gold/20 rounded-lg p-3 text-xs text-white/60 space-y-2">
                        <div>
                            <p className="text-gold font-bold uppercase tracking-wider text-[10px] mb-1">Quality Standards</p>
                            <p>{contract.qualityStd || "Not specified"}</p>
                        </div>
                        {contract.notes && (
                            <div className="border-t border-gold/10 pt-2">
                                <p className="text-gold font-bold uppercase tracking-wider text-[10px] mb-1">Notes from Company</p>
                                <p>{contract.notes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Apply button */}
                {applied ? (
                    <div className="flex flex-row items-center justify-center gap-2 bg-green-600/20 border border-green-400/40 text-green-400 font-bold py-2 px-2 w-full rounded-lg text-sm">
                        <CheckCircleIcon className="size-5" /> Application Submitted
                    </div>
                ) : (
                    <button onClick={() => onApply(contract)}
                        className="bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg transition-all ease-in duration-150">
                        Apply Now →
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContractFarming() {
    const { isOpen, axios } = UseAppContext();
    const applyRef = useRef(null);

    const [contracts, setContracts] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [targetContract, setTargetContract] = useState(null);
    const [applied, setApplied] = useState(false);
    const [showFilters, setShowFilters] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [cropFilter, setCropFilter] = useState("All Crops");
    const [regionFilter, setRegionFilter] = useState("All Regions");
    const [seasonFilter, setSeasonFilter] = useState("All Seasons");

    // Application form state
    const [fName, setFName] = useState("");
    const [fPhone, setFPhone] = useState("");
    const [fState, setFState] = useState("");
    const [fDistrict, setFDistrict] = useState("");
    const [fLand, setFLand] = useState("");
    const [fExperience, setFExperience] = useState("");
    const [fCrop, setFCrop] = useState("");
    const [fMessage, setFMessage] = useState("");

    // ── Fetch all active contracts ────────────────────────────────────────────
    const fetchContracts = async () => {
        try {
            const { data } = await axios.get("/api/contractfarming/all");
            if (data.success) {
                // Compute accepted land for each contract
                setContracts(data.contracts.map(c => ({ ...c, acceptedLand: 0 })));
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // ── Fetch my applications ─────────────────────────────────────────────────
    const fetchMyApplications = async () => {
        try {
            const { data } = await axios.get("/api/contractfarming/myapplications");
            if (data.success) {
                setMyApplications(data.applications);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        Promise.all([fetchContracts(), fetchMyApplications()]).finally(() => setLoading(false));
    }, []);

    const appliedContractIds = myApplications.map(a => a.contract?._id);

    // ── Open apply dialog ─────────────────────────────────────────────────────
    const handleOpenApply = (contract) => {
        setTargetContract(contract);
        setApplied(false);
        setFName(""); setFPhone(""); setFState(""); setFDistrict("");
        setFLand(""); setFExperience(""); setFCrop(""); setFMessage("");
        applyRef.current.showModal();
    };

    // ── Submit application ────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!fName || !fPhone || !fLand || !fExperience) {
            return alert("Please fill all required fields.");
        }
        setSubmitting(true);
        try {
            const { data } = await axios.post("/api/contractfarming/apply", {
                contractId: targetContract._id,
                name: fName,
                phone: fPhone,
                location: `${fDistrict}${fDistrict && fState ? ", " : ""}${fState}`,
                land: fLand,
                experience: fExperience,
                currentCrop: fCrop,
                message: fMessage,
            });
            if (data.success) {
                setApplied(true);
                // Add to local applications list with populated contract
                setMyApplications(prev => [{
                    ...data.application,
                    contract: targetContract,
                }, ...prev]);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Filter contracts ──────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        let list = [...contracts];
        if (search)
            list = list.filter(c =>
                c.crop.toLowerCase().includes(search.toLowerCase()) ||
                c.company.toLowerCase().includes(search.toLowerCase()) ||
                c.region.toLowerCase().includes(search.toLowerCase())
            );
        if (cropFilter !== "All Crops") list = list.filter(c => c.crop === cropFilter);
        if (regionFilter !== "All Regions") list = list.filter(c => c.region.includes(regionFilter));
        if (seasonFilter !== "All Seasons") list = list.filter(c => c.season === seasonFilter);
        return list;
    }, [contracts, search, cropFilter, regionFilter, seasonFilter]);

    if (loading) {
        return (
            <>
                <SideNav />
                <div className={`flex items-center justify-center h-dvh ${isOpen ? "md:ml-52" : "md:ml-16"}`}>
                    <p className="text-white font-montserrat font-bold text-lg animate-pulse">Loading contracts...</p>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Mobile filter toggle */}
            <button
                className="flex md:hidden flex-row gap-1 cursor-pointer items-center bg-linear-to-br from-gold to-yellow-200 border border-black p-2 rounded-full bottom-2 left-2 fixed z-50"
                onClick={() => setShowFilters(!showFilters)}
            >
                <FunnelIcon className="stroke-2 size-6 stroke-darkgreen fill-darkgreen" />
                <p>Filters</p>
            </button>

            <SideNav />

            <div className={`flex flex-col ${isOpen ? "md:ml-52" : "md:ml-16"}`}>

                {/* Filter bar */}
                {showFilters && (
                    <div className="filters md:sticky md:top-0 w-full h-fit m-auto bg-linear-to-r from-gold to-yellow-200 border-b border-darkgreen">
                        <div className="flex flex-row flex-wrap w-11/12 h-fit m-auto rounded-md items-center my-4 gap-2 justify-center">
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <MagnifyingGlassIcon className="size-5 stroke-2 stroke-gold" />
                                <input type="search" placeholder="Search crop, company..."
                                    className="focus:outline-0 font-normal text-black w-36"
                                    value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <select className="focus:outline-0 font-normal text-black" value={cropFilter} onChange={e => setCropFilter(e.target.value)}>
                                    {CROPS.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <MapPinIcon className="size-5 stroke-2 stroke-gold" />
                                <select className="focus:outline-0 font-normal text-black" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full">
                                <select className="focus:outline-0 font-normal text-black" value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)}>
                                    {SEASONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* My Applications section */}
                {myApplications.length > 0 && (
                    <div className="w-11/12 m-auto my-4">
                        <div className="border-2 border-gold rounded-xl overflow-hidden font-montserrat">
                            <div className="bg-gold px-5 py-3 flex items-center justify-between">
                                <p className="text-darkgreen font-black text-sm uppercase tracking-widest">My Applications</p>
                                <span className="text-darkgreen text-xs font-bold">{myApplications.length} submitted</span>
                            </div>
                            <div className="bg-darkgreen/70">
                                {myApplications.map(app => (
                                    <MyApplicationRow key={app._id} app={app} />
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
                                key={c._id}
                                contract={c}
                                applied={appliedContractIds.includes(c._id)}
                                onApply={handleOpenApply}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center w-11/12 m-auto my-8">
                        <img src="/contractdoc.svg" alt="" className="size-16 opacity-20" />
                        <p className="text-white/50 font-montserrat font-bold text-lg">No contracts match your filters</p>
                        <button
                            onClick={() => { setSearch(""); setCropFilter("All Crops"); setRegionFilter("All Regions"); setSeasonFilter("All Seasons"); }}
                            className="text-gold underline underline-offset-4 font-semibold text-sm cursor-pointer"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Apply dialog */}
            <dialog ref={applyRef} className="m-auto p-0 rounded-xl bg-transparent backdrop:backdrop-blur-sm w-full max-w-lg">
                <div className="bg-darkgreen border-2 border-gold rounded-xl font-montserrat overflow-hidden">
                    {/* Header */}
                    <div className="bg-gold px-6 py-4 flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-darkgreen font-black text-lg">Apply for Contract</h2>
                            {targetContract && (
                                <p className="text-darkgreen/70 text-sm mt-0.5">
                                    {targetContract.crop}{targetContract.variety ? ` — ${targetContract.variety}` : ""} · {targetContract.company}
                                </p>
                            )}
                        </div>
                        <button type="button" onClick={() => applyRef.current.close()}>
                            <XCircleIcon className="size-8 cursor-pointer hover:rotate-90 transition-all ease-in duration-200 text-darkgreen hover:text-red-600" />
                        </button>
                    </div>

                    <div className="p-6">
                        {!applied ? (
                            <>
                                {/* Quick contract summary */}
                                {targetContract && (
                                    <div className="bg-black/30 border border-gold/30 rounded-lg px-4 py-3 mb-5 grid grid-cols-3 gap-3 text-center">
                                        {[
                                            ["Price", `₹${targetContract.priceMin.toLocaleString()}-${targetContract.priceMax.toLocaleString()}`],
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
                                    {[
                                        ["Full Name *", fName, setFName, "text", "Your full name"],
                                        ["Mobile Number *", fPhone, setFPhone, "tel", "+91 XXXXX XXXXX"],
                                        ["State", fState, setFState, "text", "e.g. Telangana"],
                                        ["District", fDistrict, setFDistrict, "text", "e.g. Nalgonda"],
                                        ["Land Available (acres) *", fLand, setFLand, "number", targetContract ? `Min ${targetContract.minLand} acres required` : ""],
                                        ["Years of Experience *", fExperience, setFExperience, "number", "e.g. 8"],
                                        ["Current Crop Grown", fCrop, setFCrop, "text", "e.g. Paddy, Cotton..."],
                                    ].map(([label, val, setter, type, ph]) => (
                                        <div key={label} className="flex flex-row gap-2 items-center">
                                            <label className="text-gold font-bold text-sm w-36 shrink-0">{label}</label>
                                            <input type={type} placeholder={ph} value={val}
                                                onChange={e => setter(e.target.value)}
                                                className="flex-1 border-b-2 border-b-gold/40 focus:border-b-gold focus:outline-none bg-transparent text-white text-sm py-1 transition-all" />
                                        </div>
                                    ))}

                                    <div className="flex flex-row gap-2 items-start">
                                        <label className="text-gold font-bold text-sm w-36 shrink-0 pt-1">Message to Company</label>
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
                                        <button type="button" onClick={handleSubmit} disabled={submitting || !fName || !fPhone || !fLand || !fExperience}
                                            className="flex-1 p-2 px-4 rounded-lg border-2 bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen border-gold cursor-pointer font-bold transition-all ease-in duration-150 disabled:opacity-50">
                                            {submitting ? "Submitting..." : "Submit Application"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircleIcon className="size-16 stroke-green-400 mx-auto mb-4" />
                                <h3 className="text-gold font-black text-xl mb-2">Application Sent!</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-1">
                                    Your application for <span className="text-white font-semibold">{targetContract?.crop}</span> with{" "}
                                    <span className="text-white font-semibold">{targetContract?.company}</span> has been submitted.
                                </p>
                                <p className="text-white/40 text-xs mb-6">The company will review and respond soon.</p>
                                <button onClick={() => applyRef.current.close()}
                                    className="bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-8 rounded-lg cursor-pointer transition-all ease-in duration-150">
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
