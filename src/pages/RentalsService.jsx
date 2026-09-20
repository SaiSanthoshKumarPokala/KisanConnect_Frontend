import { useState, useEffect, useMemo, useCallback } from "react";
import ModuleHeader from "../components/ModuleHeader";
import RentalsServiceCard from "../components/rentals-service/RentalsServiceCard";
import SideNav from "../components/SideNav";
import AddModuleCard from "../components/AddModuleCard";
import RentalFormModal from "../components/rentals-service/RentalFormModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function RentalsService() {
  useDocumentTitle("My Rental Listings");

  const { isOpen, setIsOpen, axios, refreshNotifications } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/rentals/mine", { signal });
        if (data.success) {
          setRentals(data.rentals || []);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setRentals([]);
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

  const filteredRentals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rentals;
    return rentals.filter((item) =>
      [item.name, item.category, item.location, item.description].some(
        (v) => v && v.toLowerCase().includes(query)
      )
    );
  }, [rentals, search]);

  const handleOpenForm = () => {
    setEditingItem(null);
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingItem(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        const { data } = await axios.post("/api/rentals/edit", {
          rentalId: editingItem._id,
          ...formData,
          price: Number(formData.price),
        });

        if (data.success) {
          setRentals((prev) =>
            prev.map((item) =>
              item._id === editingItem._id
                ? { ...item, ...data.rental, bookings: item.bookings }
                : item
            )
          );
        } else {
          alert(data.message || "Failed to update listing.");
        }
      } else {
        const { data } = await axios.post("/api/rentals/post", {
          ...formData,
          price: Number(formData.price),
        });

        if (data.success) {
          setRentals((prev) => [{ ...data.rental, bookings: [] }, ...prev]);
        } else {
          alert(data.message || "Failed to post listing.");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Submission failed.");
    }
    handleCloseForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rental listing?")) return;

    try {
      const { data } = await axios.post("/api/rentals/delete", { rentalId: id });
      if (data.success) {
        setRentals((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.message || "Failed to delete listing.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Deletion failed.");
    }
  };

  const handleDecideBooking = async (bookingId, decision) => {
    try {
      const { data } = await axios.post("/api/rentals/decide", {
        bookingId,
        decision,
      });

      if (data.success) {
        setRentals((prev) =>
          prev.map((item) => ({
            ...item,
            bookings: item.bookings
              ? item.bookings.map((b) =>
                  b._id === bookingId ? { ...b, status: decision } : b
                )
              : [],
          }))
        );
        refreshNotifications?.();
      } else {
        alert(data.message || "Failed to update booking status.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Decision error.");
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
            title="My Rentals"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <main className="flex flex-1 flex-col">
            {loading ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <p className="animate-pulse text-lg font-bold text-white">
                  Loading your listings...
                </p>
              </div>
            ) : rentals.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-12rem)] flex-1 flex-col items-center justify-center gap-6 p-10 text-center">
                <p className="max-w-xl text-xl font-bold text-white">
                  You do not provide any rental service yet. Add your first machine to start receiving requests.
                </p>
                <div className="w-full max-w-[320px]">
                  <AddModuleCard
                    onAdd={handleOpenForm}
                    title="Add Rental"
                    subtitle="Create your first rental listing"
                    minHeight={320}
                  />
                </div>
              </div>
            ) : filteredRentals.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-12rem)] flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
                <p className="text-xl font-bold text-white">
                  No rental cards match your search.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="cursor-pointer text-sm font-bold text-gold underline underline-offset-4"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="flex-1 p-6">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                  {filteredRentals.map((item) => (
                    <RentalsServiceCard
                      key={item._id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDecideBooking={handleDecideBooking}
                    />
                  ))}
                  <AddModuleCard
                    onAdd={handleOpenForm}
                    title="Add Rental"
                    subtitle="Create one more rental listing"
                    minHeight={360}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <RentalFormModal
        isOpen={showFormModal}
        editingItem={editingItem}
        onSave={handleSave}
        onClose={handleCloseForm}
      />
    </div>
  );
}