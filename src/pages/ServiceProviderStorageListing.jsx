import { useState, useEffect, useCallback } from "react";
import SideNav from "../components/SideNav";
import ServiceProviderStorageContent from "../components/storage-service/ServiceProviderStorageContent";
import StorageFormModal from "../components/storage-service/StorageFormModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function ServiceProviderStorageListing() {
  useDocumentTitle("My Cold Storage Facilities");

  const { isOpen, setIsOpen, axios, fetchOngoingDeals } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStorage, setEditingStorage] = useState(null);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStorages = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/coldstorage/mine", { signal });
        if (data.success) {
          setStorages(data.storages || []);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setStorages([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchStorages(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchStorages]);

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

  const handleSaveStorage = async (formData) => {
    try {
      if (editingStorage) {
        const { data } = await axios.post("/api/coldstorage/edit", {
          storageId: editingStorage._id,
          ...formData,
        });

        if (data.success) {
          setStorages((prev) =>
            prev.map((s) =>
              s._id === editingStorage._id ? { ...s, ...data.storage } : s
            )
          );
        } else {
          alert(data.message || "Failed to update storage.");
        }
      } else {
        const { data } = await axios.post("/api/coldstorage/post", formData);

        if (data.success) {
          setStorages((prev) => [
            {
              ...data.storage,
              bookings: [],
              occupiedNow: 0,
              availableNow: data.storage.capacity,
            },
            ...prev,
          ]);
        } else {
          alert(data.message || "Failed to add storage.");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Submission error.");
    }
    handleCloseForm();
  };

  const handleDeleteStorage = async (storageId) => {
    if (!window.confirm("Are you sure you want to delete this storage listing?")) return;

    try {
      const { data } = await axios.post("/api/coldstorage/delete", { storageId });
      if (data.success) {
        setStorages((prev) => prev.filter((s) => s._id !== storageId));
      } else {
        alert(data.message || "Failed to delete storage.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Deletion error.");
    }
  };

  const handleDecideBooking = async (bookingId, decision) => {
    try {
      const { data } = await axios.post("/api/coldstorage/decide", {
        bookingId,
        decision,
      });

      if (data.success) {
        setStorages((prev) =>
          prev.map((s) => ({
            ...s,
            bookings: s.bookings
              ? s.bookings.map((b) =>
                  b._id === bookingId ? { ...b, status: decision } : b
                )
              : [],
          }))
        );
        fetchOngoingDeals?.();
      } else {
        alert(data.message || "Failed to update booking decision.");
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
          <main className="flex flex-1 flex-col">
            {loading ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <p className="animate-pulse text-lg font-bold text-white">
                  Loading your storages...
                </p>
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
          </main>
        </div>
      </div>

      <StorageFormModal
        isOpen={showFormModal}
        editingStorage={editingStorage}
        onSave={handleSaveStorage}
        onClose={handleCloseForm}
      />
    </div>
  );
}