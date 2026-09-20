import { useState, useMemo } from "react";
import ModuleHeader from "../ModuleHeader";
import ModuleFilters from "../ModuleFilters";
import FarmerStorageCard from "./FarmerStorageCard";
import FarmerStorageModal from "./FarmerStorageModal";
import { UseAppContext } from "../../context/AppContext";

const FILTERS = ["All", "Available", "Low Price", "High Capacity", "Top Rated"];

const INITIAL_BOOKING_FORM = {
  startDate: "",
  endDate: "",
  farmerName: "",
  farmerLocation: "",
  farmerContact: "",
  cropName: "",
  quantity: "",
  notes: "",
};

export default function FarmerStorageContent({
  storages = [],
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  sortBy,
  onOpenSidebar,
}) {
  const { addBooking, axios } = UseAppContext();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [submitting, setSubmitting] = useState(false);

  const [availCheck, setAvailCheck] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);

  const resetBookingForm = () => {
    setBookingForm(INITIAL_BOOKING_FORM);
    setAvailCheck(null);
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    if (field === "startDate" || field === "endDate") {
      setAvailCheck(null);
    }
  };

  const handleCheckAvailability = async () => {
    if (!bookingForm.startDate || !bookingForm.endDate) {
      alert("Please select both start and end dates first.");
      return;
    }
    if (new Date(bookingForm.endDate) <= new Date(bookingForm.startDate)) {
      alert("End date must be after start date.");
      return;
    }

    setCheckingAvail(true);
    try {
      const { data } = await axios.post("/api/coldstorage/check", {
        storageId: selectedStorage._id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
      });

      if (data.success) {
        setAvailCheck(data);
      } else {
        alert(data.message || "Failed to check dates.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Availability check failed.");
    } finally {
      setCheckingAvail(false);
    }
  };

  const handleBookingSubmit = async () => {
    const { startDate, endDate, farmerName, farmerLocation, farmerContact, cropName, quantity } =
      bookingForm;

    if (!startDate || !endDate || !farmerName || !farmerLocation || !farmerContact || !cropName || !quantity) {
      alert("Please fill in all required booking details.");
      return;
    }
    if (!availCheck) {
      alert("Please check availability for your selected dates first.");
      return;
    }
    if (Number(quantity) > availCheck.availableTonnes) {
      alert(`Only ${availCheck.availableTonnes} tonnes available for those dates. Please reduce your quantity.`);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/coldstorage/apply", {
        storageId: selectedStorage._id,
        farmerName,
        farmerLocation,
        farmerContact,
        cropName,
        startDate,
        endDate,
        quantity: Number(quantity),
      });

      if (data.success) {
        addBooking({
          module: "Cold Storage",
          itemName: selectedStorage.name,
          providerName: selectedStorage.owner,
          image: selectedStorage.images?.[0] || "/coldstorage.svg",
          priceLabel: `₹${selectedStorage.price} / day / ton`,
          summary: `${cropName} • ${quantity}T • ${startDate} to ${endDate}`,
          notificationTitle: "Cold storage booking request",
          notificationDetail: `${cropName} storage request for ${selectedStorage.name} from ${startDate} to ${endDate}.`,
        });

        alert(`Booking application sent successfully to ${selectedStorage.name}.`);
        setActiveDetailTab("about");
        resetBookingForm();
        setSelectedStorage(null);
      } else {
        alert(data.message || "Failed to submit booking application.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Application submission error.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    return storages
      .filter((s) => {
        if (activeFilter === "Available") return s.status !== "inactive";
        if (activeFilter === "Low Price") return s.price <= 10;
        if (activeFilter === "High Capacity") return s.capacity >= 1000;
        return true;
      })
      .filter(
        (s) =>
          !search ||
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.location?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        return 0;
      });
  }, [storages, activeFilter, search, sortBy]);

  return (
    <main className="flex flex-1 flex-col min-w-0 font-montserrat">
      <ModuleHeader
        title="Cold Storage"
        search={search}
        onSearchChange={setSearch}
        onOpenSidebar={onOpenSidebar}
      />

      <ModuleFilters
        filters={FILTERS}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        hideStateDropdown={true}
      />

      <div className="flex-1 p-6">
        <div className="mb-5 flex items-center">
          <span className="text-sm font-bold text-white">
            {filtered.length} storage{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <svg
              className="mx-auto mb-3.5 size-12 opacity-20"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
              />
            </svg>
            <div className="text-base font-semibold text-white/80">No storages found</div>
            <div className="mt-1 text-xs text-white/60">Try adjusting your filters or search</div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
            {filtered.map((s) => (
              <FarmerStorageCard
                key={s._id || s.id}
                storage={s}
                onViewDetails={(storage) => {
                  setSelectedStorage(storage);
                  setActiveImage(storage.images?.[0] || null);
                  setActiveDetailTab("about");
                  resetBookingForm();
                }}
              />
            ))}
          </div>
        )}
      </div>

      <FarmerStorageModal
        storage={selectedStorage}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        activeTab={activeDetailTab}
        setActiveTab={setActiveDetailTab}
        bookingForm={bookingForm}
        onBookingInput={handleBookingInput}
        availCheck={availCheck}
        checkingAvail={checkingAvail}
        onCheckAvailability={handleCheckAvailability}
        submitting={submitting}
        onSubmit={handleBookingSubmit}
        onClose={() => setSelectedStorage(null)}
      />
    </main>
  );
}