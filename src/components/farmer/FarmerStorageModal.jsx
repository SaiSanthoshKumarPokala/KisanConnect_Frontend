export default function FarmerStorageModal({
  storage,
  activeImage,
  setActiveImage,
  activeTab,
  setActiveTab,
  bookingForm,
  onBookingInput,
  availCheck,
  checkingAvail,
  onCheckAvailability,
  submitting,
  onSubmit,
  onClose,
}) {
  if (!storage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-[22px] border border-gold/35 bg-black font-montserrat shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-gold/20 bg-[#050505] p-4">
          <div className="flex flex-1 justify-center">
            <div className="flex gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              {[
                { id: "about", label: "About Cold Storage" },
                { id: "book", label: "Book Now" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
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
            aria-label="Close modal"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
          >
            ×
          </button>
        </div>

        {/* Modal Content Grid */}
        <div
          className={`grid ${
            activeTab === "book" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1.15fr_1fr]"
          }`}
        >
          {/* About Tab Gallery */}
          {activeTab === "about" && (
            <div className="border-b border-gold/20 p-5 lg:border-b-0 lg:border-r">
              <div
                className="relative mb-3.5 h-64 rounded-2xl bg-cover bg-center bg-no-repeat md:h-72"
                style={{
                  backgroundImage: activeImage
                    ? `url("${activeImage}")`
                    : "linear-gradient(135deg, #2a5a2a 0%, #081D0C 100%)",
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-black/10 to-black/50" />
                {storage.images?.length > 0 && (
                  <span className="absolute bottom-4 left-4 rounded border border-emerald-800/80 bg-[#1a3a1a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6db86d]">
                    {storage.status || "Available"}
                  </span>
                )}
              </div>

              {storage.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5">
                  {storage.images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`h-24 cursor-pointer overflow-hidden rounded-xl border bg-[#050505] p-0 transition-all ${
                        activeImage === image
                          ? "border-[#E7C957] ring-2 ring-[#E7C957]/40"
                          : "border-[#c9a84c]/20 hover:border-[#c9a84c]/50"
                      }`}
                    >
                      <div
                        className="size-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-gold/20 bg-darkgreen p-4">
                <h4 className="text-base font-bold text-[#E7C957]">About This Storage</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {storage.description ||
                    "A reliable cold storage facility. Select Book Now to check availability and apply for your dates."}
                </p>
              </div>
            </div>
          )}

          {/* Right Panel: Overview vs Booking Form */}
          <div
            className={`p-6 ${
              activeTab === "book" ? "flex justify-center" : "flex flex-col gap-4"
            }`}
          >
            {activeTab === "about" && (
              <>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#E7C957] md:text-3xl">
                    {storage.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">{storage.location}</p>
                </div>

                <div className="rounded-2xl border border-gold/20 bg-darkgreen p-4">
                  {[
                    { label: "Price", value: `₹${storage.price} per day/ton` },
                    { label: "Total Capacity", value: `${storage.capacity}T` },
                  ].map((item, index, arr) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between gap-4 py-2.5 ${
                        index !== arr.length - 1 ? "border-b border-gold/15" : ""
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider text-white/60">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "book" && (
              <div className="w-full max-w-2xl rounded-3xl border border-gold/25 bg-linear-to-b from-[#101f15] to-[#070d09] p-6 shadow-2xl">
                <div>
                  <h3 className="text-lg font-black text-amber-200">Booking Details</h3>
                  <p className="mt-1 text-xs text-white/60">
                    Select your dates, check availability, then fill your details to send the application.
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
                      <span className="text-xs font-bold text-amber-200">Start Date *</span>
                      <input
                        type="date"
                        required
                        value={bookingForm.startDate}
                        onChange={(e) => onBookingInput("startDate", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none focus:border-gold"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">End Date *</span>
                      <input
                        type="date"
                        required
                        value={bookingForm.endDate}
                        onChange={(e) => onBookingInput("endDate", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none focus:border-gold"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={onCheckAvailability}
                    disabled={checkingAvail || !bookingForm.startDate || !bookingForm.endDate}
                    className="w-full cursor-pointer rounded-xl border border-gold/40 bg-transparent p-2.5 text-xs font-bold text-amber-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {checkingAvail ? "Checking..." : "Check Availability for Selected Dates"}
                  </button>

                  {availCheck && (
                    <div
                      className={`rounded-xl border p-3 ${
                        availCheck.availableTonnes > 0
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-400"
                          : "border-red-400/40 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {availCheck.availableTonnes > 0 ? (
                        <div>
                          <p className="text-xs font-bold">
                            ✓ {availCheck.availableTonnes}T available for your selected dates
                          </p>
                          <p className="mt-1 text-[11px] text-white/50">
                            {availCheck.occupiedTonnes}T already booked · {availCheck.totalCapacity}T total capacity
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold">
                            Storage is fully booked for these dates
                          </p>
                          <p className="mt-1 text-[11px] text-white/50">
                            Try different dates — capacity may be available for other periods
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Your Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={bookingForm.farmerName}
                        onChange={(e) => onBookingInput("farmerName", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Contact Number *</span>
                      <input
                        type="tel"
                        required
                        placeholder="Phone number"
                        value={bookingForm.farmerContact}
                        onChange={(e) => onBookingInput("farmerContact", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Your Location *</span>
                      <input
                        type="text"
                        required
                        placeholder="Village / Town"
                        value={bookingForm.farmerLocation}
                        onChange={(e) => onBookingInput("farmerLocation", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Crop Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tomato, Chilli..."
                        value={bookingForm.cropName}
                        onChange={(e) => onBookingInput("cropName", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-200">
                      Quantity Needed (tonnes) *
                      {availCheck && (
                        <span
                          className={`ml-2 text-[11px] ${
                            availCheck.availableTonnes > 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          max {availCheck.availableTonnes}T available
                        </span>
                      )}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={availCheck ? availCheck.availableTonnes : undefined}
                      required
                      placeholder={`Max ${storage.capacity}T`}
                      value={bookingForm.quantity}
                      onChange={(e) => onBookingInput("quantity", e.target.value)}
                      className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-200">Additional Notes</span>
                    <textarea
                      rows={2}
                      placeholder="Special handling, preferred loading time, crop condition..."
                      value={bookingForm.notes}
                      onChange={(e) => onBookingInput("notes", e.target.value)}
                      className="min-h-18 w-full resize-y rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                    />
                  </label>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("about")}
                      className="cursor-pointer rounded-xl border border-gold/30 bg-transparent px-4 py-2.5 text-xs font-bold text-amber-200 transition hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !availCheck || availCheck.availableTonnes <= 0}
                      className="cursor-pointer rounded-xl bg-linear-to-r from-amber-200 to-gold px-5 py-2.5 text-xs font-extrabold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send Booking Request"}
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