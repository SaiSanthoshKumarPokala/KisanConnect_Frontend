import { useMemo, useState, useEffect, useCallback } from "react";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import RentalsCard from "../components/RentalsCard";
import RentalDetailModal from "../components/rentals/RentalDetailModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { RENTAL_FILTERS, INITIAL_BOOKING_FORM } from "../constants/rentalsData";

export default function Rentals() {
  useDocumentTitle("Machine Rentals");

  const { isOpen, setIsOpen, axios, addBooking, refreshNotifications } = UseAppContext();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [rentalsData, setRentalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dateCheck, setDateCheck] = useState(null);
  const [checkingDate, setCheckingDate] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);

  const fetchRentals = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/rentals/all", { signal });
        if (data.success) {
          setRentalsData(data.rentals || []);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setRentalsData([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchRentals(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchRentals]);

  const resetBookingForm = () => {
    setBookingForm(INITIAL_BOOKING_FORM);
    setDateCheck(null);
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    if (field === "startDate" || field === "endDate") {
      setDateCheck(null);
    }
  };

  const handleCheckDate = async () => {
    if (!bookingForm.startDate || !bookingForm.endDate) {
      return alert("Please select both start and end dates first.");
    }
    if (new Date(bookingForm.endDate) <= new Date(bookingForm.startDate)) {
      return alert("End date must be after start date.");
    }

    setCheckingDate(true);
    try {
      const { data } = await axios.post("/api/rentals/checkdate", {
        rentalId: selectedItem._id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
      });

      if (data.success) {
        setDateCheck({ available: data.available, message: data.message });
      } else {
        alert(data.message || "Failed to verify dates.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Failed to check date availability.");
    } finally {
      setCheckingDate(false);
    }
  };

  const handleBookingSubmit = async () => {
    const { farmerName, farmerContact, startDate, endDate, deliveryAddress } = bookingForm;

    if (!farmerName || !farmerContact || !startDate || !endDate || !deliveryAddress) {
      return alert("Please fill in all required rental details.");
    }
    if (!dateCheck) {
      return alert("Please check availability for your selected dates before submitting.");
    }
    if (!dateCheck.available) {
      return alert("This machine is already booked for those dates. Please choose different dates.");
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/rentals/apply", {
        rentalId: selectedItem._id,
        farmerName,
        farmerContact,
        startDate,
        endDate,
        expectedHours: bookingForm.expectedHours,
        deliveryAddress,
        notes: bookingForm.notes,
      });

      if (data.success) {
        addBooking({
          module: "Rentals",
          itemName: selectedItem.name,
          providerName: selectedItem.owner,
          image: selectedItem.image,
          priceLabel: `₹${selectedItem.price} / day`,
          summary: `${startDate} to ${endDate} • ${deliveryAddress}`,
          notificationTitle: "Rental booking request",
          notificationDetail: `${selectedItem.name} requested from ${startDate} to ${endDate} for delivery at ${deliveryAddress}.`,
        });

        alert(`Rental request sent successfully to ${selectedItem.name}.`);
        refreshNotifications?.();
        setActiveDetailTab("about");
        resetBookingForm();
        setSelectedItem(null);
      } else {
        alert(data.message || "Unable to submit booking request.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Booking submission error.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRentals = useMemo(() => {
    return rentalsData.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [item.name, item.location, item.description]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(query));

      const matchesCategory =
        activeFilter === "All" ||
        (item.category || "")
          .toLowerCase()
          .includes(activeFilter.toLowerCase().replace(/s$/, ""));

      return matchesSearch && matchesCategory;
    });
  }, [activeFilter, search, rentalsData]);

  const resultLabel =
    activeFilter === "All"
      ? "showing all equipment"
      : `showing ${activeFilter.toLowerCase()}`;

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
            title="Machine Rentals"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <ModuleFilters
            filters={RENTAL_FILTERS}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          <main className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex min-h-100 items-center justify-center p-8">
                <p className="animate-pulse text-lg font-bold text-white">Loading rentals...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="text-sm font-bold text-white">
                    {filteredRentals.length} machine{filteredRentals.length !== 1 ? "s" : ""} found
                  </span>
                  <span className="text-xs text-white/60">· {resultLabel}</span>
                  {search.trim() && (
                    <span className="text-xs text-amber-200">· matching "{search.trim()}"</span>
                  )}
                </div>

                <div className="p-6">
                  {filteredRentals.length === 0 ? (
                    <div className="py-10 text-sm text-white/70">
                      No machines match your current search and filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                      {filteredRentals.map((item) => (
                        <RentalsCard
                          key={item._id}
                          item={item}
                          onViewDetails={(selected) => {
                            setSelectedItem(selected);
                            setActiveDetailTab("about");
                            resetBookingForm();
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Detail / Rent Modal */}
      <RentalDetailModal
        item={selectedItem}
        activeTab={activeDetailTab}
        setActiveTab={setActiveDetailTab}
        bookingForm={bookingForm}
        onBookingInput={handleBookingInput}
        onResetBookingForm={resetBookingForm}
        dateCheck={dateCheck}
        checkingDate={checkingDate}
        onCheckDate={handleCheckDate}
        submitting={submitting}
        onSubmit={handleBookingSubmit}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}