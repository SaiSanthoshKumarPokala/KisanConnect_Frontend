import { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import ProductCard from "../components/ProductCard";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import ShopDetailModal from "../components/shop/ShopDetailModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { SHOP_FILTERS, INITIAL_SHOP_BOOKING_FORM } from "../constants/shopData";

export default function Shop() {
  useDocumentTitle("Farmers' Shop");

  const location = useLocation();
  const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartEnabled =
    location.pathname.startsWith("/farmer") ||
    location.pathname.startsWith("/serviceprovider");

  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState(INITIAL_SHOP_BOOKING_FORM);

  const fetchProducts = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/shop/all", { signal });
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

  const resetBookingForm = () => {
    setBookingForm(INITIAL_SHOP_BOOKING_FORM);
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = () => {
    if (!bookingForm.quantity || !bookingForm.deliveryAddress || !bookingForm.contactNumber) {
      window.alert("Please fill in all required purchase details.");
      return;
    }

    addBooking({
      module: "Shop",
      itemName: selectedItem.name,
      providerName: selectedItem.seller || selectedItem.brand,
      image: selectedItem.image,
      priceLabel: `₹${selectedItem.price} / unit`,
      summary: `${bookingForm.quantity} requested • ${bookingForm.deliveryAddress}`,
      notificationTitle: "Shop purchase request",
      notificationDetail: `${selectedItem.name} purchase request placed for ${bookingForm.quantity}.`,
    });

    window.alert(`Purchase request for ${selectedItem.name} sent successfully.`);
    setActiveDetailTab("about");
    resetBookingForm();
    setSelectedItem(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [item.name, item.brand, item.description]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(query));

      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, activeFilter, search]);

  const resultLabel =
    activeFilter === "All"
      ? "showing all products"
      : `showing ${activeFilter.toLowerCase()}`;

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
            title="Shop"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <ModuleFilters
            filters={SHOP_FILTERS}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          <main className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex min-h-100 items-center justify-center p-8">
                <p className="animate-pulse text-lg font-bold text-white">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="text-sm font-bold text-white">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                  </span>
                  <span className="text-xs text-white/60">· {resultLabel}</span>
                  {search.trim() && (
                    <span className="text-xs text-amber-200">· matching "{search.trim()}"</span>
                  )}
                </div>

                <div className="p-6">
                  {filteredProducts.length === 0 ? (
                    <div className="py-10 text-sm text-white/70">
                      No products match your current search and filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                      {filteredProducts.map((item) => (
                        <ProductCard
                          key={item._id}
                          _id={item._id}
                          name={item.name}
                          seller={item.brand}
                          location={item.location || ""}
                          price={item.price}
                          category={item.category}
                          image={item.image}
                          description={item.description}
                          availability="Available"
                          showAddToCart={cartEnabled}
                          cartModule="Shop"
                          onViewDetails={(selected) => {
                            setSelectedItem({ ...selected, owner: item.owner });
                            setActiveDetailTab("about");
                            resetBookingForm();
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Detail / Direct Order Modal */}
      <ShopDetailModal
        item={selectedItem}
        activeTab={activeDetailTab}
        setActiveTab={setActiveDetailTab}
        bookingForm={bookingForm}
        onBookingInput={handleBookingInput}
        onResetBookingForm={resetBookingForm}
        onSubmit={handleBookingSubmit}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}