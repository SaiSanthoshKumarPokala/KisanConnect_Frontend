
import { RENTAL_FORM_FIELDS, INITIAL_RENTAL_FORM } from "../../constants/rentalServiceData";
import ServiceProviderCatalogForm from "../serviceprovider/ServiceProviderCatalogForm";

export default function RentalFormModal({
  isOpen,
  editingItem,
  onSave,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[22px] border border-gold/30 bg-black font-montserrat shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <ServiceProviderCatalogForm
          title={editingItem ? "Edit Rental Listing" : "Add Rental Listing"}
          introText="Fill the basic details for your rental machine listing so farmers can quickly understand availability and pricing."
          imageLabel="Upload machine image"
          uploadText="Click to upload rental machine image"
          submitText="Save Rental"
          initialData={editingItem || INITIAL_RENTAL_FORM}
          fields={RENTAL_FORM_FIELDS}
          onBack={onClose}
          onSave={onSave}
          isModal={true}
        />
      </div>
    </div>
  );
}