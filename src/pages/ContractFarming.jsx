import { useRef, useState, useEffect, useMemo } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ModuleHeader from "../components/ModuleHeader";
import {
    ChevronDownIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

const normalizeContract = (contract = {}) => ({
    ...contract,
    crop: contract.crop || "Contract Crop",
    variety: contract.variety || "",
    company: contract.company || "Kisan Connect Partner",
    companyType: contract.companyType || "Agri Partner",
    region: contract.region || "Region not specified",
    minLand: Number(contract.minLand || 0),
    totalLand: Number(contract.totalLand || 0),
    acceptedLand: Number(contract.acceptedLand || 0),
    farmersNeeded: Number(contract.farmersNeeded || 0),
    paymentTerms: contract.paymentTerms || "To be discussed",
    inputSupport: Boolean(contract.inputSupport),
    status: contract.status || "Active",
    priceMin: Number(contract.priceMin || 0),
    priceMax: Number(contract.priceMax || 0),
    duration: contract.duration || "Flexible",
    season: contract.season || "Current season",
    qualityStd: contract.qualityStd || "",
    notes: contract.notes || "",
});

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
        <div className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat"
            style={{ borderColor: "#d4af37", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)" }}>
            {/* Image area */}
            <div className="bg-darkgreen rounded-t-xl flex items-center justify-center h-40 relative border-b border-gold/20">
                <img src="/contractdoc.svg" alt="Contract" className="size-24 opacity-80" />
                <span className="absolute top-3 right-3 bg-green-500/20 border border-green-400 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                    {contract.status}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col items-start justify-evenly gap-3 bg-black p-4 text-white">
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
                    className="flex flex-row items-center gap-1 text-xs text-gold hover:text-gold/70">
                    {showDetails ? "Hide details" : "View full details"}
                    <ChevronDownIcon className={`size-4 ${showDetails ? "rotate-180" : ""}`} />
                </button>

                {showDetails && (
                    <div className="w-full bg-[#050505] border border-gold/20 rounded-lg p-3 text-xs text-white/60 space-y-2">
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
    const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();
    const applyRef = useRef(null);

    const [contracts, setContracts] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [targetContract, setTargetContract] = useState(null);
    const [applied, setApplied] = useState(false);

    // Filters
    const [search, setSearch] = useState("");

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
                setContracts((data.contracts || []).map(c => normalizeContract({ ...c, acceptedLand: 0 })));
            } else {
                setContracts([]);
            }
        } catch (error) {
            setContracts([]);
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
                addBooking({
                    module: "Contract Farming",
                    itemName: targetContract.crop,
                    providerName: targetContract.company,
                    image: "/contractdoc.svg",
                    priceLabel: `₹${targetContract.priceMin.toLocaleString()} - ₹${targetContract.priceMax.toLocaleString()} / quintal`,
                    summary: `${fLand} acres • ${fDistrict || fState || "Region shared"} • ${targetContract.season}`,
                    notificationTitle: "Contract interest message",
                    notificationDetail: `Applied for ${targetContract.crop} contract with ${fLand} acres in ${fDistrict || fState || "the selected region"}.`,
                });
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
                (c.crop || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.company || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.region || "").toLowerCase().includes(search.toLowerCase())
            );
        return list;
    }, [contracts, search]);

    if (loading) {
        return (
            <>
                <SideNav />
                <div className={`flex min-h-dvh flex-col bg-black ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
                    <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
                        <ModuleHeader
                            title="Contract Farming"
                            search={search}
                            onSearchChange={setSearch}
                            onOpenSidebar={() => setIsOpen(!isOpen)}
                        />
                        <div className="flex flex-1 items-center justify-center px-6">
                            <p className="text-white font-montserrat font-bold text-lg">Loading contracts...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SideNav />

            <div className={`flex min-h-dvh flex-col bg-black ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
                <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
                    <ModuleHeader
                        title="Contract Farming"
                        search={search}
                        onSearchChange={setSearch}
                        onOpenSidebar={() => setIsOpen(!isOpen)}
                    />

                    {/* My Applications section */}
                    {myApplications.length > 0 && (
                        <div className="mx-6 my-4">
                            <div className="overflow-hidden rounded-[18px] border border-gold/30 font-montserrat bg-black">
                                <div className="flex items-center justify-between border-b border-gold/20 bg-[#050505] px-5 py-4">
                                    <p className="text-white font-black text-sm uppercase tracking-widest">My Applications</p>
                                    <span className="text-gold text-xs font-bold">{myApplications.length} submitted</span>
                            </div>
                                <div className="bg-black">
                                {myApplications.map(app => (
                                    <MyApplicationRow key={app._id} app={app} />
                                ))}
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Contracts grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
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
                        <div className="flex h-64 flex-col items-center justify-center gap-4 px-6 text-center">
                        <img src="/contractdoc.svg" alt="" className="size-16 opacity-20" />
                        <p className="text-white/50 font-montserrat font-bold text-lg">No contracts match your filters</p>
                        <button
                            onClick={() => { setSearch(""); }}
                            className="text-gold underline underline-offset-4 font-semibold text-sm cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                    )}
                </div>
            </div>

            {/* Apply dialog */}
            <dialog ref={applyRef} className="m-auto p-0 rounded-xl bg-transparent backdrop:backdrop-blur-sm w-full max-w-lg">
                <div className="overflow-hidden rounded-[22px] border border-gold/30 bg-black font-montserrat shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-gold/20 bg-[#050505] px-6 py-4">
                        <div>
                            <h2 className="text-gold font-black text-lg">Apply for Contract</h2>
                            {targetContract && (
                                <p className="mt-0.5 text-sm text-white/55">
                                    {targetContract.crop}{targetContract.variety ? ` — ${targetContract.variety}` : ""} · {targetContract.company}
                                </p>
                            )}
                        </div>
                        <button type="button" onClick={() => applyRef.current.close()}>
                            <XCircleIcon className="size-8 cursor-pointer text-white/80 transition-all ease-in duration-200 hover:rotate-90 hover:text-red-500" />
                        </button>
                    </div>

                    <div className="bg-black p-6">
                        {!applied ? (
                            <>
                                {/* Quick contract summary */}
                                {targetContract && (
                                    <div className="mb-5 grid grid-cols-3 gap-3 rounded-[18px] border border-gold/20 bg-[#050505] px-4 py-4 text-center">
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
                                        <div key={label} className="rounded-[16px] border border-gold/15 bg-[#050505] px-4 py-3">
                                            <label className="mb-2 block text-sm font-bold text-gold">{label}</label>
                                            <input type={type} placeholder={ph} value={val}
                                                onChange={e => setter(e.target.value)}
                                                className="w-full rounded-[12px] border border-gold/15 bg-black px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-gold/45" />
                                        </div>
                                    ))}

                                    <div className="rounded-[16px] border border-gold/15 bg-[#050505] px-4 py-3">
                                        <label className="mb-2 block text-sm font-bold text-gold">Message to Company</label>
                                        <textarea rows={2} value={fMessage} onChange={e => setFMessage(e.target.value)}
                                            placeholder="Why are you a good fit for this contract?"
                                            className="min-h-[88px] w-full resize-none rounded-[12px] border border-gold/15 bg-black px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-gold/45" />
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
