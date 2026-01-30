"use client"
import useCartStore from '../../store/useCartStore';

export function ClearCartModal({ isOpen, onClose }) {
  const { clearCart } = useCartStore();

  const handleConfirm = () => {
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95">
        <h3 className="text-lg font-bold text-error mb-2">Kosongkan Keranjang?</h3>
        <p className="text-gray-500 mb-6">Semua item yang sudah dipilih akan dihapus.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1 rounded-xl">Batal</button>
          <button onClick={handleConfirm} className="btn btn-error text-white flex-1 rounded-xl shadow-lg">Kosongkan</button>
        </div>
      </div>
    </div>
  );
}
