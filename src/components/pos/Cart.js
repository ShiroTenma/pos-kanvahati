"use client"
import useCartStore from '../../store/useCartStore';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export function Cart({
  setIsClearCartModalOpen,
  setIsCheckoutModalOpen,
  paymentMethod,
  setPaymentMethod
}) {
  const { cart, updateQty } = useCartStore();
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="w-[380px] bg-base-100 h-full shadow-2xl flex flex-col border-l border-base-300 z-20">
      <div className="p-6 border-b border-base-300 flex justify-between items-center">
        <h2 className="text-xl font-extrabold flex items-center gap-2 text-neutral">
          <ShoppingCart className="text-primary" /> Pesanan
        </h2>
        {cart.length > 0 && (
          <button
            onClick={() => setIsClearCartModalOpen(true)}
            className="btn btn-sm btn-circle btn-ghost text-error"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40 gap-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
            <p>Keranjang kosong</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-base-200/40 rounded-2xl border border-transparent hover:border-primary/30 group">
              <div className="flex-1">
                <div className="font-bold text-neutral">{item.name}</div>
                <div className="text-xs text-primary font-medium">@ Rp {item.price.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 bg-base-100 rounded-xl p-1 shadow-sm border border-base-200">
                <button onClick={() => updateQty(item.id, 'minus')} className="btn btn-xs btn-circle btn-ghost"><Minus className="w-3 h-3" /></button>
                <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 'plus')} className="btn btn-xs btn-circle btn-ghost text-primary"><Plus className="w-3 h-3" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-base-100 border-t border-dashed border-base-300">
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPaymentMethod('CASH')} className={`btn btn-sm h-10 border-2 ${paymentMethod === 'CASH' ? 'btn-primary text-white border-primary' : 'bg-base-100 text-gray-500 border-base-300 hover:border-primary'}`}>💵 Tunai</button>
            <button onClick={() => setPaymentMethod('QRIS')} className={`btn btn-sm h-10 border-2 ${paymentMethod === 'QRIS' ? 'btn-primary text-white border-primary' : 'bg-base-100 text-gray-500 border-base-300 hover:border-primary'}`}>📱 QRIS</button>
          </div>
        </div>

        <div className="flex justify-between text-xl font-black text-neutral mb-4">
          <span>Total</span>
          <span className="text-primary">Rp {totalAmount.toLocaleString()}</span>
        </div>

        <button
          className="btn btn-primary w-full py-4 h-auto text-lg rounded-2xl font-bold text-white shadow-lg hover:shadow-primary/40 transition-all disabled:bg-base-200"
          onClick={() => setIsCheckoutModalOpen(true)}
          disabled={cart.length === 0}
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
