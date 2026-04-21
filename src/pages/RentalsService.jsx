import { useState, useEffect } from "react";
import ModuleHeader from "../components/ModuleHeader";
import RentalsServiceCard from "../components/RentalsServiceCard";
import ServiceProviderCatalogForm from "../components/ServiceProviderCatalogForm";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import AddModuleCard from "../components/AddModuleCard";

const DEFAULT_IMAGE = "";

const initialForm = {
  name: "", category: "Harvester", price: "",
  location: "", description: "", image: "",
};

const rentalFields = [
  { key: "name",        label: "Machine Name",  placeholder: "Enter machine name",                   required: true },
  { key: "category",   label: "Category",       type: "select", options: ["Harvester", "Tractor", "Seeder", "Rotavator"], required: true },
  { key: "price",      label: "Price Per Day",  type: "number", placeholder: "Enter price per day",   required: true },
  { key: "location",   label: "Location",       placeholder: "Enter machine location",                required: true },
  { key: "description",label: "Description",    type: "textarea", placeholder: "Share rental details, condition, and usage notes", required: true },
];

export default function RentalsService() {
  const { isOpen, setIsOpen, axios, refreshNotifications } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem]     = useState(null);
  const [search, setSearch]               = useState("");
  const [rentals, setRentals]             = useState([]);
  const [loading, setLoading]             = useState(true);

  // ── Fetch SP's own listings with bookings ─────────────────────────────────
  const fetchRentals = async () => {
    try {
      const { data } = await axios.get("/api/rentals/mine");
      if (data.success) setRentals(data.rentals);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRentals(); }, []);

  const filteredRentals = rentals.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [item.name, item.category, item.location, item.description].some(
      (v) => v && v.toLowerCase().includes(query)
    );
  });

  const handleOpenForm  = () => { setEditingItem(null); setShowFormModal(true); };
  const handleEdit      = (item) => { setEditingItem(item); setShowFormModal(true); };
  const handleCloseForm = () => { setShowFormModal(false); setEditingItem(null); };

  // ── Save (add or edit) ────────────────────────────────────────────────────
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
        } else { alert(data.message); }
      } else {
        const { data } = await axios.post("/api/rentals/post", {
          ...formData, price: Number(formData.price),
        });
        if (data.success) {
          setRentals((prev) => [{ ...data.rental, bookings: [] }, ...prev]);
        } else { alert(data.message); }
      }
    } catch (error) {
      alert(error.message);
    }
    handleCloseForm();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rental listing?")) return;
    try {
      const { data } = await axios.post("/api/rentals/delete", { rentalId: id });
      if (data.success) {
        setRentals((prev) => prev.filter((item) => item._id !== id));
      } else { alert(data.message); }
    } catch (error) {
      alert(error.message);
    }
  };

  // ── Accept / Reject booking ───────────────────────────────────────────────
  const handleDecideBooking = async (bookingId, decision) => {
    try {
      const { data } = await axios.post("/api/rentals/decide", { bookingId, decision });
      if (data.success) {
        setRentals((prev) =>
          prev.map((item) => ({
            ...item,
            bookings: item.bookings
              ? item.bookings.map((b) => b._id === bookingId ? { ...b, status: decision } : b)
              : [],
          }))
        );
        if (refreshNotifications) refreshNotifications();
      } else { alert(data.message); }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-black min-h-dvh">
      <SideNav />
      <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black font-montserrat shadow-2xl md:mx-6">
          <ModuleHeader
            title="My Rentals"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          {loading ? (
            <div className="flex flex-1 items-center justify-center bg-black">
              <p className="text-white font-montserrat font-bold text-lg animate-pulse">Loading your listings...</p>
            </div>
          ) : rentals.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-6 bg-black p-10 text-center">
              <p className="max-w-xl text-xl font-bold text-white">
                You do not provide any rental service yet. Add your first machine to start receiving requests.
              </p>
              <div className="w-full max-w-[320px]">
                <AddModuleCard onAdd={handleOpenForm} title="Add Rental" subtitle="Create your first rental listing" minHeight={320} />
              </div>
            </div>
          ) : filteredRentals.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-3 bg-black p-10 text-center">
              <p className="text-xl font-bold text-white">No rental cards match your search.</p>
              <button onClick={() => setSearch("")} className="text-sm font-bold text-gold underline underline-offset-4">Clear Search</button>
            </div>
          ) : (
            <div className="flex-1 bg-black p-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
                {filteredRentals.map((item) => (
                  <RentalsServiceCard
                    key={item._id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDecideBooking={handleDecideBooking}
                  />
                ))}
                <AddModuleCard onAdd={handleOpenForm} title="Add Rental" subtitle="Create one more rental listing" minHeight={360} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showFormModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.76)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 300 }}
          onClick={handleCloseForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(860px, 100%)", maxHeight: "min(88vh, 920px)", overflow: "auto", background: "#000000", border: "1px solid rgba(212,175,55,0.32)", borderRadius: "22px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
          >
            <ServiceProviderCatalogForm
              title={editingItem ? "Edit Rental Listing" : "Add Rental Listing"}
              introText="Fill the basic details for your rental machine listing so farmers can quickly understand availability and pricing."
              imageLabel="Upload machine image"
              uploadText="Click to upload rental machine image"
              submitText="Save Rental"
              initialData={editingItem || initialForm}
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
