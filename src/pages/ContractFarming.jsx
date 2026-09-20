import { useRef, useState, useEffect, useMemo } from "react";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import MyApplicationRow from "../components/contract-farming/MyApplicationRow";
import ContractFarmingCard from "../components/contract-farming/ContractFarmingCard";
import ContractApplyModal from "../components/contract-farming/ContractApplyModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { normalizeContract } from "../utils/contractHelpers";

const INITIAL_FORM_DATA = {
  fName: "",
  fPhone: "",
  fState: "",
  fDistrict: "",
  fLand: "",
  fExperience: "",
  fCrop: "",
  fMessage: "",
};

export default function ContractFarming() {
  useDocumentTitle("Contract Farming");

  const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();
  const applyRef = useRef(null);

  const [contracts, setContracts] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [targetContract, setTargetContract] = useState(null);
  const [applied, setApplied] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Fetch initial datasets
  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      try {
        const [contractsRes, appsRes] = await Promise.all([
          axios.get("/api/contractfarming/all"),
          axios.get("/api/contractfarming/myapplications"),
        ]);

        if (isMounted) {
          if (contractsRes.data?.success) {
            setContracts(
              (contractsRes.data.contracts || []).map((c) =>
                normalizeContract({ ...c, acceptedLand: 0 })
              )
            );
          }
          if (appsRes.data?.success) {
            setMyApplications(appsRes.data.applications || []);
          }
        }
      } catch (err) {
        // Fallbacks remain empty arrays on network exceptions
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, [axios]);

  const appliedContractIds = useMemo(
    () => myApplications.map((a) => a.contract?._id).filter(Boolean),
    [myApplications]
  );

  const handleOpenApply = (contract) => {
    setTargetContract(contract);
    setApplied(false);
    setFormData(INITIAL_FORM_DATA);
    applyRef.current?.showModal();
  };

  const handleCloseModal = () => {
    applyRef.current?.close();
  };

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmitApplication = async () => {
    if (
      !formData.fName ||
      !formData.fPhone ||
      !formData.fLand ||
      !formData.fExperience
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const locationString = `${formData.fDistrict}${
        formData.fDistrict && formData.fState ? ", " : ""
      }${formData.fState}`;

      const { data } = await axios.post("/api/contractfarming/apply", {
        contractId: targetContract._id,
        name: formData.fName,
        phone: formData.fPhone,
        location: locationString,
        land: formData.fLand,
        experience: formData.fExperience,
        currentCrop: formData.fCrop,
        message: formData.fMessage,
      });

      if (data.success) {
        setApplied(true);
        addBooking({
          module: "Contract Farming",
          itemName: targetContract.crop,
          providerName: targetContract.company,
          image: "/contractdoc.svg",
          priceLabel: `₹${targetContract.priceMin.toLocaleString()} - ₹${targetContract.priceMax.toLocaleString()} / quintal`,
          summary: `${formData.fLand} acres • ${
            formData.fDistrict || formData.fState || "Region shared"
          } • ${targetContract.season}`,
          notificationTitle: "Contract interest message",
          notificationDetail: `Applied for ${targetContract.crop} contract with ${
            formData.fLand
          } acres in ${formData.fDistrict || formData.fState || "the selected region"}.`,
        });

        setMyApplications((prev) => [
          { ...data.application, contract: targetContract },
          ...prev,
        ]);
      } else {
        alert(data.message || "Failed to submit application.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Submission error.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredContracts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contracts;

    return contracts.filter((c) =>
      [c.crop, c.company, c.region]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(q))
    );
  }, [contracts, search]);

  return (
    <div className="min-h-dvh bg-black font-montserrat">
      <SideNav />

      <div
        className={`flex min-h-dvh flex-col transition-[margin] duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader
            title="Contract Farming"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <main className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex min-h-100 items-center justify-center px-6">
                <p className="font-montserrat text-lg font-bold text-white">
                  Loading contracts...
                </p>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {/* My Applications Section */}
                {myApplications.length > 0 && (
                  <section className="overflow-hidden rounded-[18px] border border-gold/30 bg-black">
                    <div className="flex items-center justify-between border-b border-gold/20 bg-[#050505] px-5 py-4">
                      <p className="text-sm font-black uppercase tracking-widest text-white">
                        My Applications
                      </p>
                      <span className="text-xs font-bold text-gold">
                        {myApplications.length} submitted
                      </span>
                    </div>
                    <div>
                      {myApplications.map((app) => (
                        <MyApplicationRow key={app._id} app={app} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Contracts Grid or Empty Match State */}
                {filteredContracts.length > 0 ? (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                    {filteredContracts.map((c) => (
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
                    <img
                      src="/contractdoc.svg"
                      alt=""
                      className="size-16 opacity-20"
                    />
                    <p className="font-montserrat text-lg font-bold text-white/50">
                      No contracts match your filters
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="cursor-pointer text-sm font-semibold text-gold underline underline-offset-4"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <ContractApplyModal
        dialogRef={applyRef}
        contract={targetContract}
        applied={applied}
        submitting={submitting}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmitApplication}
        onClose={handleCloseModal}
      />
    </div>
  );
}