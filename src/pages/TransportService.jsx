import { useState, useEffect, useMemo, useCallback } from "react";
import ModuleHeader from "../components/ModuleHeader";
import SideNav from "../components/SideNav";
import TransportServiceCard from "../components/transport-service/TransportServiceCard";
import AddModuleCard from "../components/AddModuleCard";
import TransportServiceFormModal from "../components/transport-service/TransportServiceFormModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function TransportService() {
  useDocumentTitle("My Transport Fleet");

  const { isOpen, setIsOpen, axios, fetchTransportDeals } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [transportCards, setTransportCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransport = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/transport/mine", { signal });
        if (data.success) {
          setTransportCards(data.transport || []);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setTransportCards([]);
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

  const filteredTransport = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transportCards;

    return transportCards.filter((item) =>
      [item.name, item.category, item.route, item.capacity, item.description].some(
        (v) => v && String(v).toLowerCase().includes(query)
      )
    );
  }, [transportCards, search]);

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
        const { data } = await axios.post("/api/transport/edit", {
          transportId: editingItem._id,
          ...formData,
          price: Number(formData.price),
        });

        if (data.success) {
          setTransportCards((prev) =>
            prev.map((item) =>
              item._id === editingItem._id
                ? {
                    ...item,
                    ...data.transport,
                    bookings: item.bookings,
                    bookedToday: item.bookedToday,
                  }
                : item
            )
          );
        } else {
          alert(data.message || "Failed to update transport listing.");
        }
      } else {
        const { data } = await axios.post("/api/transport/post", {
          ...formData,
          price: Number(formData.price),
        });

        if (data.success) {
          setTransportCards((prev) => [
            { ...data.transport, bookings: [], bookedToday: false },
            ...prev,
          ]);
        } else {
          alert(data.message || "Failed to add transport listing.");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Submission error.");
    }
    handleCloseForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transport listing?")) return;

    try {
      const { data } = await axios.post("/api/transport/delete", { transportId: id });
      if (data.success) {
        setTransportCards((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.message || "Failed to delete transport listing.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Deletion error.");
    }
  };

  const handleDecideBooking = async (bookingId, decision) => {
    try {
      const { data } = await axios.post("/api/transport/decide", {
        bookingId,
        decision,
      });

      if (data.success) {
        setTransportCards((prev) =>
          prev.map((item) => ({
            ...item,
            bookings: item.bookings
              ? item.bookings.map((b) =>
                  b._id === bookingId ? { ...b, status: decision } : b
                )
              : [],
            bookedToday: decision === "Accepted" ? true : item.bookedToday,
          }))
        );
        fetchTransportDeals?.();
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
            title="My Transport"
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
            ) : transportCards.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-12rem)] flex-1 flex-col items-center justify-center gap-6 p-10 text-center">
                <p className="max-w-xl text-xl font-bold text-white">
                  You do not provide any transport service yet. Add a vehicle card to start showing your availability.
                </p>
                <div className="w-full max-w-[320px]">
                  <AddModuleCard
                    onAdd={handleOpenForm}
                    title="Add Transport"
                    subtitle="Create your first transport listing"
                    minHeight={320}
                  />
                </div>
              </div>
            ) : filteredTransport.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-12rem)] flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
                <p className="text-xl font-bold text-white">
                  No transport cards match your search.
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
                  {filteredTransport.map((item) => (
                    <TransportServiceCard
                      key={item._id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDecideBooking={handleDecideBooking}
                    />
                  ))}
                  <AddModuleCard
                    onAdd={handleOpenForm}
                    title="Add Transport"
                    subtitle="Create one more transport listing"
                    minHeight={360}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <TransportServiceFormModal
        isOpen={showFormModal}
        editingItem={editingItem}
        onSave={handleSave}
        onClose={handleCloseForm}
      />
    </div>
  );
}