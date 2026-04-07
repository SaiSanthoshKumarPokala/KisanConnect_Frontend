import { useState } from "react";
import ModuleHeader from "../components/ModuleHeader";
import ServiceProviderCatalogForm from "../components/ServiceProviderCatalogForm";
import SideNav from "../components/SideNav";
import TransportServiceCard from "../components/TransportServiceCard";
import { UseAppContext } from "../context/AppContext";
import AddModuleCard from "../components/AddModuleCard";

const DEFAULT_TRANSPORT_IMAGE = "/DCM.png";

const initialForm = {
  name: "",
  category: "Truck",
  price: "",
  route: "",
  capacity: "",
  description: "",
  image: DEFAULT_TRANSPORT_IMAGE,
};

const SAMPLE_TRANSPORT = [
  {
    id: 9101,
    name: "Agri Freight Mini Truck",
    category: "Truck",
    price: "350",
    route: "Hyderabad to Medchal",
    capacity: "8 Tonnes",
    description: "Reliable short-haul option for mandi trips and local farm pickups.",
    image: "/DCM.png",
  },
  {
    id: 9102,
    name: "Cold Chain Reefer Van",
    category: "Tempo",
    price: "390",
    route: "Guntur to Vijayawada",
    capacity: "4 Tonnes",
    description: "Temperature-controlled movement for perishables and delicate produce.",
    image: "/DCM.png",
  },
];

const transportFields = [
  { key: "name", label: "Vehicle Name", placeholder: "Enter vehicle name", required: true },
  { key: "category", label: "Vehicle Type", type: "select", options: ["Truck", "Mini Truck", "Pickup", "Tempo"], required: true },
  { key: "price", label: "Price Per Km", type: "number", placeholder: "Enter price per km", required: true },
  { key: "capacity", label: "Carrying Capacity", placeholder: "e.g. 5 tons", required: true },
  { key: "route", label: "Route / Coverage", placeholder: "Hyderabad to Warangal", required: true },
  { key: "description", label: "Description", type: "textarea", placeholder: "Share route, condition, driver support, and timing details", required: true },
];

export default function TransportService() {
  const { isOpen, setIsOpen } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [transportCards, setTransportCards] = useState(SAMPLE_TRANSPORT);

  const filteredTransport = transportCards.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [item.name, item.category, item.route, item.capacity, item.description].some((value) =>
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
      image: formData.image || DEFAULT_TRANSPORT_IMAGE,
    };

    if (editingId) {
      setTransportCards((prev) => prev.map((item) => (item.id === editingId ? { ...payload, id: editingId } : item)));
    } else {
      setTransportCards((prev) => [{ ...payload, id: Date.now() }, ...prev]);
    }

    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transport listing?")) {
      setTransportCards((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="bg-black min-h-dvh">
      <SideNav />
      <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black font-montserrat shadow-2xl md:mx-6">
          <ModuleHeader
            title="My Transport"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          {transportCards.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-6 bg-black p-10 text-center">
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
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-3 bg-black p-10 text-center">
              <p className="text-xl font-bold text-white">No transport cards match your search.</p>
              <button onClick={() => setSearch("")} className="text-sm font-bold text-gold underline underline-offset-4">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex-1 bg-black p-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
              {filteredTransport.map((item) => (
                <TransportServiceCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
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
              title={editingId ? "Edit Transport Listing" : "Add Transport Listing"}
              introText="Fill the basic details for your vehicle listing so farmers can understand route coverage, capacity, and pricing at a glance."
              imageLabel="Upload vehicle image"
              uploadText="Click to upload transport vehicle image"
              submitText="Save Transport"
              initialData={editingId ? transportCards.find((item) => item.id === editingId) : initialForm}
              fields={transportFields}
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
