export const normalizeContract = (contract = {}) => ({
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

export const STATUS_STYLES = {
  Pending: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  Accepted: "text-green-400 border-green-400/40 bg-green-400/10",
  Rejected: "text-red-400 border-red-400/40 bg-red-400/10",
};