export default function ShopDetailModal({
  item,
  activeTab,
  setActiveTab,
  bookingForm,
  onBookingInput,
  onResetBookingForm,
  onSubmit,
  onClose,
}) {
  if (!item) return null;

  const isBuyTab = activeTab === "book";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-[22px] border border-gold/30 bg-black font-montserrat shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar with Tab Switcher */}
        <div className="flex items-center justify-between border-b border-gold/20 bg-[#050505] p-4">
          <div className="flex flex-1 justify-center">
            <div className="flex gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              {[
                { id: "about", label: "About Product" },
                { id: "book", label: "Buy Now" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    onResetBookingForm();
                  }}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-linear-to-r from-gold to-yellow-200 text-black shadow-sm"
                      : "text-amber-200 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div
          className={`grid ${
            isBuyTab ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1.15fr_1fr]"
          }`}
        >
          {/* About Tab: Visual & Details */}
          {activeTab === "about" && (
            <div className="border-b border-gold/20 p-5 lg:border-b-0 lg:border-r">
              <div
                className="relative mb-4 h-64 rounded-2xl bg-cover bg-center bg-no-repeat md:h-72"
                style={{ backgroundImage: `url(${item.image || "/urea.png"})` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-black/10 to-black/50" />
              </div>

              <div className="rounded-2xl border border-gold/20 bg-darkgreen p-4">
                <h4 className="text-base font-bold text-[#E7C957]">About This Product</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{item.description}</p>
              </div>
            </div>
          )}

          {/* Right Stage: Quick Specs OR Purchase Form */}
          <div
            className={`p-6 ${
              isBuyTab ? "flex justify-center" : "flex flex-col gap-4"
            }`}
          >
            {activeTab === "about" && (
              <>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-[#E7C957] md:text-3xl">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">Sold by {item.seller || item.brand}</p>
                </div>

                <div className="rounded-2xl border border-gold/20 bg-darkgreen p-4">
                  {[
                    { label: "Price", value: `₹${item.price} per unit` },
                    { label: "Category", value: item.category },
                    { label: "Stock", value: item.stock ? `${item.stock} units` : "In Stock" },
                  ].map((spec, index, arr) => (
                    <div
                      key={spec.label}
                      className={`flex items-center justify-between gap-4 py-2.5 ${
                        index !== arr.length - 1 ? "border-b border-gold/15" : ""
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider text-white/50">
                        {spec.label}
                      </span>
                      <span className="text-sm font-semibold text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isBuyTab && (
              <div className="w-full max-w-2xl rounded-3xl border border-gold/25 bg-linear-to-b from-[#101f15] to-[#070d09] p-6 shadow-2xl">
                <div>
                  <h3 className="text-lg font-black text-amber-200">Purchase Details</h3>
                  <p className="mt-1 text-xs text-white/60">
                    Add to cart and head to the cart page to checkout, or fill details here to send a direct request.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                  className="mt-5 space-y-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Quantity (units) *</span>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder={item.stock ? `Max ${item.stock}` : "Enter quantity"}
                        value={bookingForm.quantity}
                        onChange={(e) => onBookingInput("quantity", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Contact Number *</span>
                      <input
                        type="tel"
                        required
                        placeholder="Your phone number"
                        value={bookingForm.contactNumber}
                        onChange={(e) => onBookingInput("contactNumber", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-200">Delivery Address *</span>
                    <input
                      type="text"
                      required
                      placeholder="Full delivery address"
                      value={bookingForm.deliveryAddress}
                      onChange={(e) => onBookingInput("deliveryAddress", e.target.value)}
                      className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-200">Notes</span>
                    <textarea
                      rows={2}
                      placeholder="Any delivery instructions..."
                      value={bookingForm.notes}
                      onChange={(e) => onBookingInput("notes", e.target.value)}
                      className="min-h-16 w-full resize-y rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                    />
                  </label>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("about");
                        onResetBookingForm();
                      }}
                      className="cursor-pointer rounded-xl border border-gold/30 bg-transparent px-4 py-2.5 text-xs font-bold text-amber-200 transition hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer rounded-xl bg-linear-to-r from-amber-200 to-gold px-5 py-2.5 text-xs font-extrabold text-black transition hover:brightness-105"
                    >
                      Confirm Order
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}