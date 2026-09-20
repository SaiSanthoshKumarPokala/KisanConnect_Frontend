import ServiceProviderCatalogForm from "../serviceprovider/ServiceProviderCatalogForm";
import {
  SHOP_SERVICE_FIELDS,
  INITIAL_SHOP_SERVICE_FORM,
} from "../../constants/shopServiceData";

export default function ShopServiceFormModal({
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
          title={editingItem ? "Edit Product" : "Add Product"}
          introText="Fill the product details so farmers can understand category, stock, and pricing at a glance."
          imageLabel="Upload product image"
          uploadText="Click to upload product image"
          submitText="Save Product"
          initialData={editingItem || INITIAL_SHOP_SERVICE_FORM}
          fields={SHOP_SERVICE_FIELDS}
          onBack={onClose}
          onSave={onSave}
          isModal={true}
        />
      </div>
    </div>
  );
}