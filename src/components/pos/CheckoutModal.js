"use client"
import useCartStore from '../../store/useCartStore';

export function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  paymentMethod
}) {
  const { cart } = useCartStore();
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95">
        <h3 className="text-xl font-bold text-neutral mb-2">Konfirmasi Pembayaran</h3>
        <p className="text-gray-500 mb-6">Pastikan uang sudah diterima.</p>

        <div className="bg-base-200 p-4 rounded-xl mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Metode</span>
            <span className="font-bold">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-primary border-t border-gray-300 pt-2">
            <span>Total</span>
            <span>Rp {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1 rounded-xl">Batal</button>
          <button onClick={onConfirm} className="btn btn-primary text-white flex-1 rounded-xl shadow-lg">Ya, Proses!</button>
        </div>
      </div>
    </div>
  );
}
