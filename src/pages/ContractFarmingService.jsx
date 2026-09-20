import { useState, useEffect, useCallback } from "react";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import AddModuleCard from "../components/AddModuleCard";
import ContractFarmingServiceCard from "../components/contract-service/ContractFarmingServiceCard";
import PostContractModal from "../components/contract-service/PostContractModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  INITIAL_POST_FORM,
  normalizeServiceContract,
} from "../constants/contractServiceData";

export default function ContractFarmingService() {
  useDocumentTitle("Contract Management");

  const { isOpen, setIsOpen, axios } = UseAppContext();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_POST_FORM);

  const fetchContracts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/contractfarming/mycontracts");
      if (data.success) {
        setContracts((data.contracts || []).map(normalizeServiceContract));
      } else {
        setContracts([]);
      }
    } catch (error) {
      setContracts([]);
      window.alert(error.response?.data?.message || error.message || "Failed to load contracts");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePost = async () => {
    const requiredFields = [
      "crop",
      "region",
      "priceMin",
      "priceMax",
      "minLand",
      "totalLand",
      "farmersNeeded",
      "company",
    ];

    const hasIncomplete = requiredFields.some((field) => !String(formData[field] || "").trim());
    if (hasIncomplete) {
      alert("Please fill all required fields.");
      return;
    }

    setPosting(true);
    try {
      const payload = {
        company: formData.company,
        companyType: formData.companyType,
        crop: formData.crop,
        variety: formData.variety,
        region: formData.region,
        season: formData.season,
        minLand: Number(formData.minLand),
        totalLand: Number(formData.totalLand),
        farmersNeeded: Number(formData.farmersNeeded),
        duration: formData.duration,
        priceMin: Number(formData.priceMin),
        priceMax: Number(formData.priceMax),
        qualityStd: formData.qualityStd,
        inputSupport: formData.inputSupport === "Yes",
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
      };

      const { data } = await axios.post("/api/contractfarming/post", payload);

      if (data.success) {
        setContracts((prev) => [
          normalizeServiceContract({ ...data.contract, applications: [] }),
          ...prev,
        ]);
        setShowFormModal(false);
        setFormData(INITIAL_POST_FORM);
      } else {
        alert(data.message || "Failed to post contract.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Network error while posting.");
    } finally {
      setPosting(false);
    }
  };

  const handleDecision = async (applicationId, decision) => {
    try {
      const { data } = await axios.post("/api/contractfarming/decide", {
        applicationId,
        decision,
      });

      if (data.success) {
        setContracts((prev) =>
          prev.map((c) => ({
            ...c,
            applications: c.applications.map((a) =>
              a._id === applicationId ? { ...a, status: decision } : a
            ),
          }))
        );
      } else {
        alert(data.message || "Failed to update decision.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Decision update failed.");
    }
  };

  const handleClose = async (contractId) => {
    if (!window.confirm("Are you sure you want to close this contract?")) return;

    try {
      const { data } = await axios.post("/api/contractfarming/close", { contractId });
      if (data.success) {
        setContracts((prev) =>
          prev.map((c) => (c._id === contractId ? { ...c, status: "Closed" } : c))
        );
      } else {
        alert(data.message || "Failed to close contract.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Failed to close contract.");
    }
  };

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
            title="Contract Management"
            search=""
            onSearchChange={() => {}}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <main className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex min-h-100 items-center justify-center px-6">
                <p className="text-lg font-bold text-white">Loading contracts...</p>
              </div>
            ) : contracts.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-190px)] flex-col items-center justify-center gap-6 p-10 text-center">
                <p className="max-w-md text-xl font-bold text-white">
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
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                  {contracts.map((c) => (
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
            )}
          </main>
        </div>
      </div>

      <PostContractModal
        isOpen={showFormModal}
        isPosting={posting}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handlePost}
        onClose={() => setShowFormModal(false)}
      />
    </div>
  );
}