import { useState } from "react";
import ModuleHeader from "../components/ModuleHeader";
import RentalsServiceCard from "../components/RentalsServiceCard";
import ServiceProviderCatalogForm from "../components/ServiceProviderCatalogForm";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import AddModuleCard from "../components/AddModuleCard";

const DEFAULT_RENTAL_IMAGE = "/harvester.png";

const initialForm = {
  name: "",
  category: "Harvester",
  price: "",
  location: "",
  status: "Available",
  description: "",
  image: DEFAULT_RENTAL_IMAGE,
};

const SAMPLE_RENTALS = [
  {
    id: 9001,
    name: "Mahindra 575 DI",
    category: "Tractor",
    price: "2200",
    location: "Kompally, Hyderabad",
    status: "Available",
    description: "Reliable tractor for ploughing, haulage, and long field days.",
    image: "/harvester.png",
  },
  {
    id: 9002,
    name: "Harvester Prime X9",
    category: "Harvester",
    price: "5400",
    location: "Warangal, Telangana",
    status: "Busy",
    description: "Fast harvesting support for peak-season paddy and grain work.",
    image: "/harvester.png",
  },
];

const rentalFields = [
  { key: "name", label: "Machine Name", placeholder: "Enter machine name", required: true },
  { key: "category", label: "Category", type: "select", options: ["Harvester", "Tractor", "Seeder", "Rotavator"], required: true },
  { key: "price", label: "Price Per Day", type: "number", placeholder: "Enter price per day", required: true },
  { key: "location", label: "Location", placeholder: "Enter machine location", required: true },
  { key: "status", label: "Status", type: "select", options: ["Available", "Busy", "Maintenance"], required: true },
  { key: "description", label: "Description", type: "textarea", placeholder: "Share rental details, condition, and usage notes", required: true },
];

export default function RentalsService() {
  const { isOpen, setIsOpen } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [rentals, setRentals] = useState(SAMPLE_RENTALS);

  const filteredRentals = rentals.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [item.name, item.category, item.location, item.status, item.description].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  const handleOpenForm = () => {
    setEditingId(null);
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingId(null);
  };

  const handleSave = (formData) => {
    const payload = {
      ...formData,
      price: String(formData.price),
      image: formData.image || DEFAULT_RENTAL_IMAGE,
    };

    if (editingId) {
      setRentals((prev) => prev.map((item) => (item.id === editingId ? { ...payload, id: editingId } : item)));
    } else {
      setRentals((prev) => [{ ...payload, id: Date.now() }, ...prev]);
    }

    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this rental listing?")) {
      setRentals((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="bg-darkgreen min-h-dvh">
      <SideNav />
      <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-darkgreen font-montserrat shadow-2xl md:mx-6">
          <ModuleHeader
            title="My Rentals"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          {rentals.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-6 bg-[#081D0C] p-10 text-center">
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
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-3 bg-[#081D0C] p-10 text-center">
              <p className="text-xl font-bold text-white">No rental cards match your search.</p>
              <button onClick={() => setSearch("")} className="text-sm font-bold text-gold underline underline-offset-4">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex-1 bg-[#081D0C] p-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
              {filteredRentals.map((item) => (
                <RentalsServiceCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
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
            <ServiceProviderCatalogForm
              title={editingId ? "Edit Rental Listing" : "Add Rental Listing"}
              introText="Fill the basic details for your rental machine listing so farmers can quickly understand availability and pricing."
              imageLabel="Upload machine image"
              uploadText="Click to upload rental machine image"
              submitText={editingId ? "Save Rental" : "Save Rental"}
              initialData={editingId ? rentals.find((item) => item.id === editingId) : initialForm}
              fields={rentalFields}
              onBack={handleCloseForm}
              onSave={handleSave}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
