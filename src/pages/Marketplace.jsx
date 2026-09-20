import { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import ServiceProviderCatalogForm from "../components/serviceprovider/ServiceProviderCatalogForm";
import FarmerListingCard from "../components/marketplace/FarmerListingCard";
import MarketplaceProductCard from "../components/marketplace/MarketplaceProductCard";
import MarketplaceDetailModal from "../components/marketplace/MarketplaceDetailModal";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  MARKETPLACE_FILTERS,
  MARKETPLACE_FORM_FIELDS,
  INITIAL_MARKETPLACE_FORM,
} from "../constants/marketplaceData";

const INITIAL_BOOKING_FORM = {
  quantity: "",
  contactNumber: "",
  deliveryAddress: "",
  notes: "",
};

export default function Marketplace() {
  const location = useLocation();
  const isFarmerRoute = location.pathname.startsWith("/farmer");

  useDocumentTitle(isFarmerRoute ? "My Farm Marketplace" : "Farm Marketplace");

  const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchListings = useCallback(
    async (signal) => {
      try {
        const ep = isFarmerRoute ? "/api/marketplace/mine" : "/api/marketplace/all";
        const { data } = await axios.get(ep, { signal });
        if (data.success) setListings(data.listings || []);
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setListings([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [axios, isFarmerRoute]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchListings(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchListings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [item.name, item.location, item.description]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(query));
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [listings, activeFilter, search]);

  const handleOpenForm = () => {
    setEditingItem(null);
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setShowFormModal(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        const { data } = await axios.post("/api/marketplace/edit", {
          listingId: editingItem._id,
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        });
        if (data.success) {
          setListings((prev) =>
            prev.map((l) => (l._id === editingItem._id ? { ...l, ...data.listing } : l))
          );
        } else {
          alert(data.message || "Failed to update listing.");
        }
      } else {
        const { data } = await axios.post("/api/marketplace/post", {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        });
        if (data.success) {
          setListings((prev) => [data.listing, ...prev]);
        } else {
          alert(data.message || "Failed to post listing.");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "An error occurred.");
    }
    handleCloseForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      const { data } = await axios.post("/api/marketplace/delete", { listingId: id });
      if (data.success) {
        setListings((prev) => prev.filter((l) => l._id !== id));
      } else {
        alert(data.message || "Failed to delete listing.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Deletion error.");
    }
  };

  const handleBookingSubmit = async () => {
    if (!bookingForm.quantity || !bookingForm.contactNumber || !bookingForm.deliveryAddress) {
      alert("Please fill in all required purchase details.");
      return;
    }
    if (Number(bookingForm.quantity) > selectedItem.stock) {
      alert(`Only ${selectedItem.stock} kg available. Please reduce quantity.`);
      return;
    }

    setSubmitting(true);
    try {
      addBooking({
        module: "Marketplace",
        itemName: selectedItem.name,
        providerName: selectedItem.owner,
        image: selectedItem.image,
        priceLabel: `₹${selectedItem.price} / kg`,
        summary: `${bookingForm.quantity} kg requested • ${bookingForm.deliveryAddress}`,
        notificationTitle: "Marketplace purchase",
        notificationDetail: `${selectedItem.name} purchase request placed for ${bookingForm.quantity} kg.`,
      });
      alert(`Purchase request for ${selectedItem.name} sent successfully.`);
      setActiveDetailTab("about");
      setBookingForm(INITIAL_BOOKING_FORM);
      setSelectedItem(null);
    } catch (error) {
      alert(error.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = isFarmerRoute ? "Marketplace" : "Farm Marketplace";
  const resultLabel =
    activeFilter === "All" ? "showing all listings" : `showing ${activeFilter.toLowerCase()}`;

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
            title={pageTitle}
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <ModuleFilters
            filters={MARKETPLACE_FILTERS}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          <main className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex min-h-100 items-center justify-center p-8">
                <p className="animate-pulse text-lg font-bold text-white">
                  Loading marketplace...
                </p>
              </div>
            ) : isFarmerRoute ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-4">
                  <span className="text-sm font-bold text-white">
                    {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} live
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenForm}
                    className="cursor-pointer rounded-xl bg-gold px-4 py-2 text-[12px] font-black uppercase tracking-[0.45px] text-[#0a1a0c] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    + Add Listing
                  </button>
                </div>

                <div className="p-6">
                  {filteredListings.length === 0 ? (
                    <div className="flex min-h-[calc(100dvh-16rem)] flex-col items-center justify-center gap-6 text-center">
                      <p className="max-w-xl text-xl font-bold text-white">
                        Start showcasing your crops and farm goods in the marketplace.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenForm}
                        className="cursor-pointer rounded-xl bg-gold px-6 py-3 text-[13px] font-black uppercase tracking-[0.45px] text-[#0a1a0c] transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        Add Your First Listing
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                      {filteredListings.map((item) => (
                        <FarmerListingCard
                          key={item._id}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="text-sm font-bold text-white">
                    {filteredListings.length} item{filteredListings.length !== 1 ? "s" : ""} found
                  </span>
                  <span className="text-xs text-white/60">· {resultLabel}</span>
                  {search.trim() && (
                    <span className="text-xs text-amber-200">· matching "{search.trim()}"</span>
                  )}
                </div>

                <div className="p-6">
                  {filteredListings.length === 0 ? (
                    <div className="py-10 text-sm text-white/70">
                      No marketplace listings match your current search and filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                      {filteredListings.map((item) => (
                        <MarketplaceProductCard
                          key={item._id || item.id}
                          item={item}
                          onViewDetails={(selected) => {
                            setSelectedItem(selected);
                            setActiveDetailTab("about");
                            setBookingForm(INITIAL_BOOKING_FORM);
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

      {/* Farmer Form Modal */}
      {showFormModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={handleCloseForm}
        >
          <div
            className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[22px] border border-gold/30 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <ServiceProviderCatalogForm
              title={editingItem ? "Edit Marketplace Listing" : "Add Marketplace Listing"}
              introText="List your produce, crop lots, or farm goods so buyers can review quality, quantity, and location at a glance."
              imageLabel="Upload listing image"
              uploadText="Click to upload marketplace image"
              submitText="Save Listing"
              initialData={editingItem || INITIAL_MARKETPLACE_FORM}
              fields={MARKETPLACE_FORM_FIELDS}
              onBack={handleCloseForm}
              onSave={handleSave}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Buyer Detail & Purchase Modal */}
      {!isFarmerRoute && selectedItem && (
        <MarketplaceDetailModal
          item={selectedItem}
          activeTab={activeDetailTab}
          setActiveTab={setActiveDetailTab}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          submitting={submitting}
          onSubmit={handleBookingSubmit}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}