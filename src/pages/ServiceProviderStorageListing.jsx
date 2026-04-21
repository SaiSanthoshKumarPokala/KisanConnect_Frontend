import { useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ServiceProviderStorageContent from "../components/ServiceProviderStorageContent";
import ServiceProviderStorageForm from "../components/ServiceProviderStorageForm";

export default function ServiceProviderStorageListing() {
  const { isOpen, setIsOpen, axios, fetchOngoingDeals } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStorage, setEditingStorage] = useState(null);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch SP's own storages with bookings ─────────────────────────────────
  const fetchStorages = async () => {
    try {
      const { data } = await axios.get("/api/coldstorage/mine");
      if (data.success) {
        setStorages(data.storages);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStorages(); }, []);

  const handleOpenForm = () => {
    setEditingStorage(null);
    setShowFormModal(true);
  };

  const handleEdit = (storage) => {
    setEditingStorage(storage);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingStorage(null);
  };

  // ── Save (add or edit) ─────────────────────────────────────────────────────
  const handleSaveStorage = async (formData) => {
    try {
      if (editingStorage) {
        const { data } = await axios.post("/api/coldstorage/edit", {
          storageId: editingStorage._id,
          ...formData,
        });
        if (data.success) {
          setStorages((prev) =>
            prev.map((s) => s._id === editingStorage._id ? { ...s, ...data.storage } : s)
          );
        } else {
          alert(data.message);
        }
      } else {
        const { data } = await axios.post("/api/coldstorage/post", formData);
        if (data.success) {
          setStorages((prev) => [{ ...data.storage, bookings: [], occupiedNow: 0, availableNow: data.storage.capacity }, ...prev]);
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      alert(error.message);
    }
    handleCloseForm();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteStorage = async (storageId) => {
    if (!window.confirm("Are you sure you want to delete this storage listing?")) return;
    try {
      const { data } = await axios.post("/api/coldstorage/delete", { storageId });
      if (data.success) {
        setStorages((prev) => prev.filter((s) => s._id !== storageId));
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // ── Accept / Reject booking ────────────────────────────────────────────────
  const handleDecideBooking = async (bookingId, decision) => {
    try {
      const { data } = await axios.post("/api/coldstorage/decide", { bookingId, decision });
      if (data.success) {
        // Update local state
        setStorages((prev) =>
          prev.map((s) => ({
            ...s,
            bookings: s.bookings
              ? s.bookings.map((b) => b._id === bookingId ? { ...b, status: decision } : b)
              : [],
          }))
        );
        // Refresh ongoing deals in notification panel
        fetchOngoingDeals();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-black min-h-dvh">
      <SideNav />
      <div className={`flex flex-col min-h-dvh transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="flex flex-col mx-2 md:mx-6 my-4 border border-gold/30 rounded-2xl shadow-2xl bg-black font-montserrat flex-1 overflow-hidden">
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-white font-montserrat font-bold text-lg">Loading your storages...</p>
            </div>
          ) : (
            <ServiceProviderStorageContent
              storages={storages}
              onOpenForm={handleOpenForm}
              onEdit={handleEdit}
              onDelete={handleDeleteStorage}
              onDecideBooking={handleDecideBooking}
              onOpenSidebar={() => setIsOpen(!isOpen)}
            />
          )}
        </div>
      </div>

      {showFormModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.76)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 300,
          }}
          onClick={handleCloseForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(860px, 100%)",
              maxHeight: "min(88vh, 920px)",
              overflow: "auto",
              background: "#000000",
              border: "1px solid rgba(212, 175, 55, 0.32)",
              borderRadius: "22px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            <ServiceProviderStorageForm
              onBack={handleCloseForm}
              onSave={handleSaveStorage}
              initialData={editingStorage}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
