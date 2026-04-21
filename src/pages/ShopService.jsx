import { useState, useEffect } from "react";
import ModuleHeader from "../components/ModuleHeader";
import ServiceProviderCatalogForm from "../components/ServiceProviderCatalogForm";
import SideNav from "../components/SideNav";
import ShopServiceCard from "../components/ShopServiceCard";
import AddModuleCard from "../components/AddModuleCard";
import { UseAppContext } from "../context/AppContext";

const DEFAULT_IMAGE = "/urea.png";

const initialForm = {
  name: "", brand: "", category: "Fertilizers",
  price: "", stock: "", description: "", image: DEFAULT_IMAGE,
};

const shopFields = [
  { key: "name",        label: "Product Name",   placeholder: "Enter product name",            required: true },
  { key: "brand",       label: "Brand / Seller", placeholder: "Enter brand or seller name",    required: true },
  { key: "category",   label: "Category",        type: "select", options: ["Fertilizers", "Seeds", "Pesticides", "Equipment", "Other"], required: true },
  { key: "price",      label: "Price Per Kg",   type: "number", placeholder: "Enter price per kg",   required: true },
  { key: "stock",      label: "Available Stock (kg)", type: "number", placeholder: "e.g. 500",  required: true },
  { key: "description",label: "Description",     type: "textarea", placeholder: "Share product usage, brand quality, and stock notes", required: true },
];

export default function ShopService() {
  const { isOpen, setIsOpen, axios } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem]     = useState(null);
  const [search, setSearch]               = useState("");
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/shop/mine");
      if (data.success) setProducts(data.products);
    } catch (error) { console.log(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [item.name, item.brand, item.category, item.stock, item.description].some(
      (v) => v && v.toLowerCase().includes(query)
    );
  });

  const handleOpenForm  = () => { setEditingItem(null); setShowFormModal(true); };
  const handleEdit      = (item) => { setEditingItem(item); setShowFormModal(true); };
  const handleCloseForm = () => { setShowFormModal(false); setEditingItem(null); };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        const { data } = await axios.post("/api/shop/edit", { productId: editingItem._id, ...formData, price: Number(formData.price) });
        if (data.success) setProducts((prev) => prev.map((p) => p._id === editingItem._id ? { ...p, ...data.product } : p));
        else alert(data.message);
      } else {
        const { data } = await axios.post("/api/shop/post", { ...formData, price: Number(formData.price) });
        if (data.success) setProducts((prev) => [data.product, ...prev]);
        else alert(data.message);
      }
    } catch (error) { alert(error.message); }
    handleCloseForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { data } = await axios.post("/api/shop/delete", { productId: id });
      if (data.success) setProducts((prev) => prev.filter((p) => p._id !== id));
      else alert(data.message);
    } catch (error) { alert(error.message); }
  };

  return (
    <div className="bg-black min-h-dvh">
      <SideNav />
      <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black font-montserrat shadow-2xl md:mx-6">
          <ModuleHeader title="My Shop" search={search} onSearchChange={setSearch} onOpenSidebar={() => setIsOpen(!isOpen)} />

          {loading ? (
            <div className="flex flex-1 items-center justify-center bg-black">
              <p className="text-white font-bold text-lg animate-pulse">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-6 bg-black p-10 text-center">
              <p className="max-w-xl text-xl font-bold text-white">You do not have any products yet. Add products so farmers can browse and buy them.</p>
              <div className="w-full max-w-[320px]">
                <AddModuleCard onAdd={handleOpenForm} title="Add Product" subtitle="Create your first product listing" minHeight={320} />
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col items-center justify-center gap-3 bg-black p-10 text-center">
              <p className="text-xl font-bold text-white">No products match your search.</p>
              <button onClick={() => setSearch("")} className="text-sm font-bold text-gold underline underline-offset-4">Clear Search</button>
            </div>
          ) : (
            <div className="flex-1 bg-black p-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
                {filteredProducts.map((item) => (
                  <ShopServiceCard key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
                <AddModuleCard onAdd={handleOpenForm} title="Add Product" subtitle="Create one more product listing" minHeight={360} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showFormModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.76)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 300 }} onClick={handleCloseForm}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(860px, 100%)", maxHeight: "min(88vh, 920px)", overflow: "auto", background: "#000000", border: "1px solid rgba(212,175,55,0.32)", borderRadius: "22px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            <ServiceProviderCatalogForm
              title={editingItem ? "Edit Product" : "Add Product"}
              introText="Fill the product details so farmers can understand category, stock, and pricing at a glance."
              imageLabel="Upload product image" uploadText="Click to upload product image" submitText="Save Product"
              initialData={editingItem || initialForm} fields={shopFields} onBack={handleCloseForm} onSave={handleSave} isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
