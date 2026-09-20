import { useState, useEffect, useMemo, useCallback } from "react";
import ModuleHeader from "../components/ModuleHeader";
import SideNav from "../components/SideNav";
import ShopServiceCard from "../components/shop-service/ShopServiceCard";
import AddModuleCard from "../components/AddModuleCard";
import ShopServiceFormModal from "../components/shop-service/ShopServiceFormModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function ShopService() {
  useDocumentTitle("My Shop Inventory");

  const { isOpen, setIsOpen, axios } = UseAppContext();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/shop/mine", { signal });
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((item) =>
      [item.name, item.brand, item.category, item.stock, item.description].some(
        (val) => val && String(val).toLowerCase().includes(query)
      )
    );
  }, [products, search]);

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
        const { data } = await axios.post("/api/shop/edit", {
          productId: editingItem._id,
          ...formData,
          price: Number(formData.price),
        });

        if (data.success) {
          setProducts((prev) =>
            prev.map((p) =>
              p._id === editingItem._id ? { ...p, ...data.product } : p
            )
          );
        } else {
          alert(data.message || "Failed to update product.");
        }
      } else {
        const { data } = await axios.post("/api/shop/post", {
          ...formData,
          price: Number(formData.price),
        });

        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
        } else {
          alert(data.message || "Failed to add product.");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Submission error.");
    }
    handleCloseForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const { data } = await axios.post("/api/shop/delete", { productId: id });
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Deletion error.");
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
            title="My Shop"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <main className="flex flex-1 flex-col">
            {loading ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <p className="animate-pulse text-lg font-bold text-white">
                  Loading products...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-12rem)] flex-1 flex-col items-center justify-center gap-6 p-10 text-center">
                <p className="max-w-xl text-xl font-bold text-white">
                  You do not have any products yet. Add products so farmers can browse and buy them.
                </p>
                <div className="w-full max-w-[320px]">
                  <AddModuleCard
                    onAdd={handleOpenForm}
                    title="Add Product"
                    subtitle="Create your first product listing"
                    minHeight={320}
                  />
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-12rem)] flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
                <p className="text-xl font-bold text-white">
                  No products match your search.
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
                  {filteredProducts.map((item) => (
                    <ShopServiceCard
                      key={item._id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                  <AddModuleCard
                    onAdd={handleOpenForm}
                    title="Add Product"
                    subtitle="Create one more product listing"
                    minHeight={360}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <ShopServiceFormModal
        isOpen={showFormModal}
        editingItem={editingItem}
        onSave={handleSave}
        onClose={handleCloseForm}
      />
    </div>
  );
}