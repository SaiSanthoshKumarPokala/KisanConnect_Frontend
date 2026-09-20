export default function TransportDetailModal({
  vehicle,
  activeTab,
  setActiveTab,
  bookingForm,
  onBookingInput,
  onResetBookingForm,
  dateChecked,
  dateAvailable,
  checkingDate,
  onCheckDate,
  onSubmit,
  onClose,
}) {
  if (!vehicle) return null;

  const isBookTab = activeTab === "book";
  const pricePerKm = Number(vehicle.price) || 0;
  const distanceKm = Number(bookingForm.distance) || 0;
  const estimatedTotal = pricePerKm * distanceKm;

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
        {/* Header Tab Bar */}
        <div className="flex items-center justify-between border-b border-gold/20 bg-[#050505] p-4">
          <div className="flex flex-1 justify-center">
            <div className="flex gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              {[
                { id: "about", label: "About Vehicle" },
                { id: "book", label: "Book Transport" },
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

        {/* Modal Content Grid */}
        <div
          className={`grid ${
            isBookTab ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1.15fr_1fr]"
          }`}
        >
          {/* About Tab: Specs & Image */}
          {activeTab === "about" && (
            <div className="border-b border-gold/20 p-5 lg:border-b-0 lg:border-r">
              <div
                className="relative mb-4 h-64 rounded-2xl bg-cover bg-center bg-no-repeat md:h-72"
                style={{ backgroundImage: `url("${vehicle.image}")` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-black/10 to-black/50" />
              </div>

              <div className="rounded-2xl border border-gold/20 bg-darkgreen p-4">
                <h4 className="text-base font-bold text-[#E7C957]">About This Vehicle</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  {vehicle.description}
                </p>
              </div>
            </div>
          )}

          {/* Right Column: Operator Metadata OR Booking Form */}
          <div
            className={`p-6 ${
              isBookTab ? "flex justify-center" : "flex flex-col gap-4"
            }`}
          >
            {activeTab === "about" && (
              <>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-[#E7C957] md:text-3xl">
                    {vehicle.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">{vehicle.route}</p>
                </div>

                <div className="rounded-2xl border border-gold/20 bg-darkgreen p-4">
                  {/* Operator Avatar and Label */}
                  <div className="mb-3.5 flex items-center gap-3 border-b border-gold/15 pb-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-amber-200 to-gold font-montserrat text-lg font-extrabold text-[#111]">
                      {(vehicle.ownerName || vehicle.owner || "O").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-white/50">
                        Operator
                      </span>
                      <p className="font-bold text-white">
                        {vehicle.ownerName || vehicle.owner}
                      </p>
                    </div>
                  </div>

                  {[
                    { label: "Price", value: `₹${vehicle.price} per km` },
                    { label: "Capacity", value: vehicle.capacity },
                    { label: "Vehicle Type", value: vehicle.category },
                    { label: "Status", value: vehicle.availability },
                  ].map((row, i, arr) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between gap-4 py-2.5 ${
                        i !== arr.length - 1 ? "border-b border-gold/15" : ""
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider text-white/50">
                        {row.label}
                      </span>
                      <span className="text-sm font-semibold text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isBookTab && (
              <div className="w-full max-w-2xl rounded-3xl border border-gold/25 bg-linear-to-b from-[#101f15] to-[#070d09] p-6 shadow-2xl">
                <div>
                  <h3 className="text-lg font-black text-amber-200">Transport Booking</h3>
                  <p className="mt-1 text-xs text-white/60">
                    Fill in your details and route so the operator can confirm availability.
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
                        placeholder="Your phone number"
                        value={bookingForm.contactNumber}
                        onChange={(e) => onBookingInput("contactNumber", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>
                  </div>

                  {/* Pickup Date & Availability Check */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-200">Pickup Date *</span>
                    <input
                      type="date"
                      required
                      value={bookingForm.pickupDate}
                      onChange={(e) => onBookingInput("pickupDate", e.target.value)}
                      className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none focus:border-gold"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={onCheckDate}
                    disabled={checkingDate || !bookingForm.pickupDate}
                    className="w-full cursor-pointer rounded-xl border border-gold/40 bg-transparent p-2.5 text-xs font-bold text-amber-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {checkingDate ? "Checking..." : "Check Availability for Selected Date"}
                  </button>

                  {dateChecked && (
                    <div
                      className={`rounded-xl border p-3 text-center text-xs font-bold ${
                        dateAvailable
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-400"
                          : "border-red-400/40 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {dateAvailable
                        ? "✓ This vehicle is available for the selected date"
                        : "✗ This vehicle is already booked for that date"}
                    </div>
                  )}

                  {/* Cargo Parameters */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Estimated Weight *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 Tonnes"
                        value={bookingForm.estimatedWeight}
                        onChange={(e) => onBookingInput("estimatedWeight", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Crop / Material *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tomatoes, Wheat"
                        value={bookingForm.cropName}
                        onChange={(e) => onBookingInput("cropName", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>
                  </div>

                  {/* Origin & Destination */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Pickup Location *</span>
                      <input
                        type="text"
                        required
                        placeholder="Farm address or Mandi name"
                        value={bookingForm.pickupLocation}
                        onChange={(e) => onBookingInput("pickupLocation", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-amber-200">Drop Location *</span>
                      <input
                        type="text"
                        required
                        placeholder="Destination address"
                        value={bookingForm.dropLocation}
                        onChange={(e) => onBookingInput("dropLocation", e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                      />
                    </label>
                  </div>

                  {/* Distance & Live Quote Preview */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-200">Total Distance (km) *</span>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 45"
                      value={bookingForm.distance}
                      onChange={(e) => onBookingInput("distance", e.target.value)}
                      className="w-full rounded-xl border border-gold/20 bg-[#050505] p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold"
                    />
                  </label>

                  {distanceKm > 0 && pricePerKm > 0 && (
                    <div className="flex items-center justify-between rounded-xl border border-gold/30 bg-gold/10 p-3.5">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-white/60">
                          Estimated Payment
                        </div>
                        <div className="mt-0.5 text-xs text-white/75">
                          ₹{pricePerKm} × {distanceKm} km
                        </div>
                      </div>
                      <div className="text-2xl font-black text-amber-200">
                        ₹{estimatedTotal.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-200">Additional Notes</span>
                    <textarea
                      rows={2}
                      placeholder="Any specific requirements (cooling, padding)..."
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
                      Book Transport
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