import { useState } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ServiceProviderStorageContent from "../components/ServiceProviderStorageContent";
import ServiceProviderStorageForm from "../components/ServiceProviderStorageForm";
import ColdStorage1 from "../assets/ColdStorage/ColdStorage1.jpg";
import ColdStorage5 from "../assets/ColdStorage/ColdStorage5.webp";

const SAMPLE_STORAGES = [
  {
    id: 9201,
    name: "Srinivasa Cold Storage",
    location: "Kompally, Hyderabad",
    capacity: 850,
    available: 340,
    price: 12,
    status: "available",
    images: [ColdStorage1],
  },
  {
    id: 9202,
    name: "Kisan FreshStore",
    location: "Bachupally, Hyderabad",
    capacity: 750,
    available: 210,
    price: 11,
    status: "limited",
    images: [ColdStorage5],
  },
];

export default function ServiceProviderStorageListing() {
  const { isOpen, setIsOpen } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [storages, setStorages] = useState(SAMPLE_STORAGES);

  const handleOpenForm = () => {
    setEditingId(null);
    setShowFormModal(true);
  };

  const handleEdit = (storage) => {
    setEditingId(storage.id);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingId(null);
  };

  const handleSaveStorage = (formData) => {
    if (editingId) {
      // Update existing storage
      setStorages((prev) =>
        prev.map((s) => (s.id === editingId ? { ...formData, id: editingId } : s))
      );
    } else {
      // Add new storage
      const newStorage = {
        ...formData,
        id: Date.now(),
      };
      setStorages((prev) => [newStorage, ...prev]);
    }
    handleCloseForm();
  };

  const handleDeleteStorage = (id) => {
    if (window.confirm("Are you sure you want to delete this storage?")) {
      setStorages((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="bg-darkgreen min-h-dvh">
      <SideNav />
      <div className={`flex flex-col min-h-dvh transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="flex flex-col mx-2 md:mx-6 my-4 border border-gold/30 rounded-2xl shadow-2xl bg-darkgreen font-montserrat flex-1 overflow-hidden">
          <ServiceProviderStorageContent
            storages={storages}
            onOpenForm={handleOpenForm}
            onEdit={handleEdit}
            onDelete={handleDeleteStorage}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />
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
              initialData={editingId ? storages.find((s) => s.id === editingId) : null}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
