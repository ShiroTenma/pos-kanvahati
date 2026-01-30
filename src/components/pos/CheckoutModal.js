"use client"
import { useState, useEffect } from 'react';
import useCartStore from '../../store/useCartStore';
import { Upload } from 'lucide-react';

export function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  paymentMethod
}) {
  const { cart } = useCartStore();
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // State baru untuk fitur tambahan
  const [cashReceived, setCashReceived] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [change, setChange] = useState(0);

  // Reset state lokal saat modal dibuka atau metode pembayaran berubah
  useEffect(() => {
    if (isOpen) {
      setCashReceived("");
      setPaymentProof(null);
      setChange(0);
    }
  }, [isOpen, paymentMethod]);

  // Hitung kembalian saat uang diterima berubah
  useEffect(() => {
    const received = parseFloat(cashReceived);
    if (!isNaN(received) && received >= totalAmount) {
      setChange(received - totalAmount);
    } else {
      setChange(0);
    }
  }, [cashReceived, totalAmount]);

  if (!isOpen) return null;

  const isCashPayment = paymentMethod === 'CASH';
  const isQrisPayment = paymentMethod === 'QRIS';

  // Kondisi untuk menonaktifkan tombol konfirmasi
  const isConfirmDisabled =
    (isCashPayment && (parseFloat(cashReceived) < totalAmount || cashReceived === "")) ||
    (isQrisPayment && !paymentProof);


  const renderCashPayment = () => (
    <>
      <div className="form-control">
        <label className="label-text font-bold text-neutral mb-2">Uang Tunai Diterima (Rp)</label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-secondary font-bold">Rp</span>
          <input
            type="number"
            className="input input-bordered w-full pl-12 focus:input-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all font-mono py-3 text-lg"
            placeholder="0"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className="flex justify-between text-lg font-black text-blue-600 border-t border-gray-300 pt-3 mt-4">
        <span>Kembalian</span>
        <span>Rp {change.toLocaleString()}</span>
      </div>
    </>
  );

  const renderQrisPayment = () => (
    <>
      <div className="text-center">
        <p className="text-gray-500 mb-4">Pindai QR code di bawah ini untuk membayar.</p>
        <div className="flex justify-center">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://github.com/syauqi" 
            alt="QRIS Code" 
            className="rounded-lg border-4 border-gray-300"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="payment-proof-upload" className="btn btn-ghost border-dashed border-2 w-full">
            <Upload className="w-4 h-4 mr-2"/>
            {paymentProof ? `File: ${paymentProof.name}` : "Unggah Bukti Pembayaran"}
          </label>
          <input 
            id="payment-proof-upload"
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={(e) => setPaymentProof(e.target.files[0])}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95">
        <h3 className="text-xl font-bold text-neutral mb-2">Konfirmasi Pembayaran</h3>
        
        {/* Total Belanja */}
        <div className="bg-base-200 p-4 rounded-xl mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Metode</span>
            <span className="font-bold">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-primary pt-2">
            <span>Total Belanja</span>
            <span>Rp {totalAmount.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Konten Dinamis */}
        <div className="mb-6">
            {isCashPayment && renderCashPayment()}
            {isQrisPayment && renderQrisPayment()}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1 rounded-xl">Batal</button>
          <button 
            onClick={() => onConfirm({ cashReceived, change })} 
            className="btn btn-primary text-white flex-1 rounded-xl shadow-lg"
            disabled={isConfirmDisabled}
          >
            Ya, Proses!
          </button>
        </div>
      </div>
    </div>
  );
}
