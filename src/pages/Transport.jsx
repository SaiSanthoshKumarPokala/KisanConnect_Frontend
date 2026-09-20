import { useMemo, useState, useEffect, useCallback } from "react";
import SideNav from "../components/SideNav";
import TransportCard from "../components/TransportCard";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import TransportDetailModal from "../components/transport/TransportDetailModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  TRANSPORT_FILTERS,
  INITIAL_TRANSPORT_FORM,
} from "../constants/transportData";

export default function Transport() {
  useDocumentTitle("Logistics & Transport");

  const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [transport, setTransport] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [dateChecked, setDateChecked] = useState(false);
  const [dateAvailable, setDateAvailable] = useState(null);
  const [checkingDate, setCheckingDate] = useState(false);

  const [bookingForm, setBookingForm] = useState(INITIAL_TRANSPORT_FORM);

  const fetchTransport = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/transport/all", { signal });
        if (data.success) {
          setTransport(data.transport || []);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setTransport([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchTransport(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchTransport]);

  const resetBookingForm = () => {
    setBookingForm(INITIAL_TRANSPORT_FORM);
    setDateChecked(false);
    setDateAvailable(null);
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    if (field === "pickupDate") {
      setDateChecked(false);
      setDateAvailable(null);
    }
  };

  const handleCheckDate = async () => {
    if (!bookingForm.pickupDate) {
      window.alert("Please select a pickup date first.");
      return;
    }
    setCheckingDate(true);
    try {
      const { data } = await axios.post("/api/transport/checkdate", {
        transportId: selectedVehicle._id,
        date: bookingForm.pickupDate,
      });
      setDateChecked(true);
      setDateAvailable(Boolean(data.available));
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || "Failed to check date.");
    } finally {
      setCheckingDate(false);
    }
  };

  const handleBookingSubmit = async () => {
    const required = [
      bookingForm.farmerName,
      bookingForm.contactNumber,
      bookingForm.pickupDate,
      bookingForm.pickupLocation,
      bookingForm.dropLocation,
      bookingForm.estimatedWeight,
      bookingForm.cropName,
      bookingForm.distance,
    ];

    if (required.some((v) => !String(v).trim())) {
      window.alert("Please fill in all required transport details.");
      return;
    }
    if (!dateChecked) {
      window.alert("Please check availability for the selected date first.");
      return;
    }
    if (!dateAvailable) {
      window.alert("This vehicle is already booked for that date. Please choose a different date.");
      return;
    }

    try {
      const { data } = await axios.post("/api/transport/apply", {
        transportId: selectedVehicle._id,
        farmerName: bookingForm.farmerName,
        farmerContact: bookingForm.contactNumber,
        pickupDate: bookingForm.pickupDate,
        pickupLocation: bookingForm.pickupLocation,
        dropLocation: bookingForm.dropLocation,
        cropName: bookingForm.cropName,
        estimatedWeight: bookingForm.estimatedWeight,
        notes: bookingForm.notes,
        distance: Number(bookingForm.distance),
      });

      if (data.success) {
        addBooking({
          module: "Transport",
          itemName: selectedVehicle.name,
          providerName: selectedVehicle.ownerName || selectedVehicle.owner,
          image: selectedVehicle.image,
          priceLabel: `₹${selectedVehicle.price} / km`,
          summary: `${bookingForm.pickupLocation} → ${bookingForm.dropLocation} · ${bookingForm.distance} km`,
        });

        window.alert(
          `Transport booking request submitted successfully for ${selectedVehicle.name}.`
        );
        setActiveDetailTab("about");
        resetBookingForm();
        setSelectedVehicle(null);
      } else {
        window.alert(data.message || "Failed to submit transport request.");
      }
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || "Booking submission error.");
    }
  };

  const filteredTransport = useMemo(() => {
    return transport.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [item.name, item.route, item.ownerName, item.description]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(query));

      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [transport, activeFilter, search]);

  const resultLabel =
    activeFilter === "All"
      ? "showing all transport options"
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
            title="Transport"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <ModuleFilters
            filters={TRANSPORT_FILTERS}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          <main className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex min-h-100 items-center justify-center p-8">
                <p className="animate-pulse text-lg font-bold text-white">Loading transport...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="text-sm font-bold text-white">
                    {filteredTransport.length} vehicle{filteredTransport.length !== 1 ? "s" : ""} found
                  </span>
                  <span className="text-xs text-white/60">· {resultLabel}</span>
                  {search.trim() && (
                    <span className="text-xs text-amber-200">· matching "{search.trim()}"</span>
                  )}
                </div>

                <div className="p-6">
                  {filteredTransport.length === 0 ? (
                    <div className="py-10 text-sm text-white/70">
                      No transport options match your current search and filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                      {filteredTransport.map((vehicle) => (
                        <TransportCard
                          key={vehicle._id}
                          vehicle={{
                            ...vehicle,
                            owner: vehicle.ownerName || vehicle.owner,
                            priceLabel: `₹${vehicle.price} / km`,
                          }}
                          onViewDetails={(selected) => {
                            setSelectedVehicle(selected);
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

      {/* Modal Component */}
      <TransportDetailModal
        vehicle={selectedVehicle}
        activeTab={activeDetailTab}
        setActiveTab={setActiveDetailTab}
        bookingForm={bookingForm}
        onBookingInput={handleBookingInput}
        onResetBookingForm={resetBookingForm}
        dateChecked={dateChecked}
        dateAvailable={dateAvailable}
        checkingDate={checkingDate}
        onCheckDate={handleCheckDate}
        onSubmit={handleBookingSubmit}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  );
}