import { useState } from "react";
import ModuleHeader from "../components/ModuleHeader";
import ServiceProviderCatalogForm from "../components/ServiceProviderCatalogForm";
import SideNav from "../components/SideNav";
import ShopServiceCard from "../components/ShopServiceCard";
import AddModuleCard from "../components/AddModuleCard";
import { UseAppContext } from "../context/AppContext";

const DEFAULT_SHOP_IMAGE = "/urea.png";

const initialForm = {
  name: "",
  brand: "",
  category: "Fertilizers",
  price: "",
  stock: "",
  description: "",
  image: DEFAULT_SHOP_IMAGE,
};

const SAMPLE_SHOP = [
  {
    id: 9201,
    name: "Premium Urea",
    brand: "GreenLeaf Agro Store",
    category: "Fertilizers",
    price: "500",
    stock: "120 units",
    description: "Balanced nitrogen support for strong vegetative crop growth.",
    image: "/urea.png",
  },
  {
    id: 9202,
    name: "Hybrid Paddy Seeds",
    brand: "Kisan Seed House",
    category: "Seeds",
    price: "820",
    stock: "80 packs",
    description: "High-yield seed variety suited for strong germination rates.",
    image: "/seeds.webp",
  },
];

const shopFields = [
  { key: "name", label: "Product Name", placeholder: "Enter product name", required: true },
  { key: "brand", label: "Brand / Seller Name", placeholder: "Enter seller or brand name", required: true },
  { key: "category", label: "Category", type: "select", options: ["Fertilizers", "Seeds", "Pesticides", "Equipment", "Other"], required: true },
  { key: "price", label: "Price Per Unit", type: "number", placeholder: "Enter product price", required: true },
  { key: "stock", label: "Available Stock", placeholder: "Eg: 100 bags / 50 packs", required: true },
  { key: "description", label: "Description", type: "textarea", placeholder: "Share product usage, brand quality, and stock notes", required: true },
];

export default function ShopService() {
  const { isOpen, setIsOpen } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(SAMPLE_SHOP);

  const filteredProducts = products.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [item.name, item.brand, item.category, item.stock, item.description].some((value) =>
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
      image: formData.image || DEFAULT_SHOP_IMAGE,
    };

    if (editingId) {
      setProducts((prev) => prev.map((item) => (item.id === editingId ? { ...payload, id: editingId } : item)));
    } else {
      setProducts((prev) => [{ ...payload, id: Date.now() }, ...prev]);
    }

    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this shop listing?")) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="bg-black min-h-dvh">
      <SideNav />
      <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black font-montserrat shadow-2xl md:mx-6">
          <ModuleHeader
            title="My Shop"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          {products.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-6 bg-black p-10 text-center">
              <p className="max-w-xl text-xl font-bold text-white">
                You do not have any shop products yet. Add products so farmers can browse and buy them.
              </p>
              <div className="w-full max-w-[320px]">
                <AddModuleCard
                  onAdd={handleOpenForm}
                  title="Add Shop"
                  subtitle="Create your first shop listing"
                  minHeight={320}
                />
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-3 bg-black p-10 text-center">
              <p className="text-xl font-bold text-white">No shop cards match your search.</p>
              <button onClick={() => setSearch("")} className="text-sm font-bold text-gold underline underline-offset-4">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex-1 bg-black p-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
                {filteredProducts.map((item) => (
                  <ShopServiceCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))}

                <AddModuleCard
                  onAdd={handleOpenForm}
                  title="Add Shop"
                  subtitle="Create one more shop listing"
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
              title={editingId ? "Edit Shop Listing" : "Add Shop Listing"}
              introText="Fill the product details so farmers can understand category, stock, and pricing at a glance."
              imageLabel="Upload product image"
              uploadText="Click to upload product image"
              submitText="Save Shop"
              initialData={editingId ? products.find((item) => item.id === editingId) : initialForm}
              fields={shopFields}
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
