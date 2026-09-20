import ServiceProviderStorageForm from "./ServiceProviderStorageForm";

export default function StorageFormModal({
  isOpen,
  editingStorage,
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
        <ServiceProviderStorageForm
          initialData={editingStorage}
          onBack={onClose}
          onSave={onSave}
          isModal={true}
        />
      </div>
    </div>
  );
}