import ServiceProviderCatalogForm from "../serviceprovider/ServiceProviderCatalogForm";
import {
  TRANSPORT_SERVICE_FIELDS,
  INITIAL_TRANSPORT_SERVICE_FORM,
} from "../../constants/transportServiceData";

export default function TransportServiceFormModal({
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
          title={editingItem ? "Edit Transport Listing" : "Add Transport Listing"}
          introText="Fill the basic details for your vehicle listing so farmers can understand route coverage, capacity, and pricing at a glance."
          imageLabel="Upload vehicle image"
          uploadText="Click to upload transport vehicle image"
          submitText="Save Transport"
          initialData={editingItem || INITIAL_TRANSPORT_SERVICE_FORM}
          fields={TRANSPORT_SERVICE_FIELDS}
          onBack={onClose}
          onSave={onSave}
          isModal={true}
        />
      </div>
    </div>
  );
}