"use client"
import { useState, useMemo, useRef, useEffect } from 'react';
import useCartStore from '../store/useCartStore';
import { Search, ShoppingCart, Trash2, Plus, Minus, X, CheckCircle, AlertCircle } from 'lucide-react';
import Fuse from 'fuse.js';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from '../components/Receipt';

export default function POSPage() {
  // --- STATE UTAMA ---
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH"); 

  // --- STATE UI (MODAL & TOAST) ---
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

  const { cart, addToCart, updateQty, clearCart } = useCartStore();

  // Helper: Tampilkan Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Hilang sendiri dalam 3 detik
  };

  // --- 1. FETCH DATA ---
  useEffect(() => {
    setTransactionDate(new Date().toLocaleString());
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) { 
        console.error(err); 
        setLoading(false); 
        showToast("Gagal memuat menu", "error");
      }
    }
    fetchProducts();
  }, []);

  // --- 2. PRINT ---
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Struk Belanja",
  });

  // --- 3. PROSES CHECKOUT (Dipanggil dari Modal) ---
  const processCheckout = async () => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: total,
          items: cart,
          paymentMethod: paymentMethod
        })
      });

      const data = await res.json();

      if (data.success) {
        handlePrint(); 
        clearCart();
        setTransactionDate(new Date().toLocaleString());
        setIsCheckoutModalOpen(false); // Tutup modal
        showToast("Transaksi Berhasil Disimpan!", "success");
      } else {
        showToast("Gagal: " + data.error, "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  // --- 4. LOGIC LAINNYA ---
  const fuse = useMemo(() => new Fuse(products, { keys: ['name', 'category'], threshold: 0.3 }), [products]);
  const filteredProducts = useMemo(() => {
    let result = products;
    if (query) result = fuse.search(query).map(res => res.item);
    if (activeCategory !== "All") result = result.filter(p => p.category === activeCategory);
    return result;
  }, [query, activeCategory, fuse, products]);

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden font-sans text-neutral relative">
      
      {/* --- TOAST NOTIFICATION (Pojok Kanan Atas) --- */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
            <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg text-white rounded-xl animate-bounce`}>
                {toast.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                <span>{toast.message}</span>
            </div>
        </div>
      )}

      {/* Komponen Struk (Hidden) */}
      <div style={{ display: "none" }}>
        <Receipt ref={componentRef} cart={cart} total={totalAmount} date={transactionDate} />
      </div>

      {/* --- BAGIAN KIRI: DAFTAR PRODUK --- */}
      <div className="flex-1 flex flex-col h-full">
        <div className="p-6 bg-base-200 z-10">
            <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari menu..." className="input w-full pl-12 bg-base-200/50 focus:bg-base-100 rounded-xl"
                    value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {["All", "Makanan", "Minuman", "Snack"].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                        className={`btn btn-sm px-6 rounded-full border-0 ${activeCategory === cat ? 'bg-primary text-white' : 'bg-base-200 text-gray-500'}`}>
                        {cat}
                    </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20">
          {loading ? <p className="text-center mt-10">Memuat menu...</p> : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((p) => (
                <div key={p.id} onClick={() => addToCart(p)}
                  className="card bg-base-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-base-300 active:scale-95 group">
                  <div className="card-body p-5 items-center text-center">
                    <div className="text-5xl mb-3">{p.image}</div>
                    <h2 className="card-title text-base font-bold line-clamp-2 min-h-[3rem]">{p.name}</h2>
                    <div className="badge badge-lg bg-base-200 text-primary border-0 font-bold mt-1">Rp {p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- BAGIAN KANAN: KERANJANG --- */}
      <div className="w-[380px] bg-base-100 h-full shadow-2xl flex flex-col border-l border-base-300 z-20">
        <div className="p-6 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-xl font-extrabold flex items-center gap-2 text-neutral"><ShoppingCart className="text-primary"/> Pesanan</h2>
          {cart.length > 0 && (
            <button 
                onClick={() => setIsClearCartModalOpen(true)} // Buka Modal Hapus
                className="btn btn-sm btn-circle btn-ghost text-error"
            >
                <Trash2 className="w-5 h-5"/>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40 gap-4">
                    <ShoppingCart className="w-10 h-10 text-gray-400" /><p>Keranjang kosong</p>
                </div>
            ) : (
                cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-base-200/40 rounded-2xl border border-transparent hover:border-primary/30 group">
                    <div className="flex-1">
                    <div className="font-bold text-neutral">{item.name}</div>
                    <div className="text-xs text-primary font-medium">@ Rp {item.price.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2 bg-base-100 rounded-xl p-1 shadow-sm border border-base-200">
                    <button onClick={() => updateQty(item.id, 'minus')} className="btn btn-xs btn-circle btn-ghost"><Minus className="w-3 h-3"/></button>
                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 'plus')} className="btn btn-xs btn-circle btn-ghost text-primary"><Plus className="w-3 h-3"/></button>
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
                onClick={() => setIsCheckoutModalOpen(true)} // Buka Modal Checkout
                disabled={cart.length === 0}
            >
                Bayar Sekarang
            </button>
        </div>
      </div>

      {/* --- MODAL KONFIRMASI CHECKOUT --- */}
      {isCheckoutModalOpen && (
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
                    <button onClick={() => setIsCheckoutModalOpen(false)} className="btn btn-ghost flex-1 rounded-xl">Batal</button>
                    <button onClick={processCheckout} className="btn btn-primary text-white flex-1 rounded-xl shadow-lg">Ya, Proses!</button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI HAPUS KERANJANG --- */}
      {isClearCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95">
                <h3 className="text-lg font-bold text-error mb-2">Kosongkan Keranjang?</h3>
                <p className="text-gray-500 mb-6">Semua item yang sudah dipilih akan dihapus.</p>
                <div className="flex gap-3">
                    <button onClick={() => setIsClearCartModalOpen(false)} className="btn btn-ghost flex-1 rounded-xl">Batal</button>
                    <button onClick={() => { clearCart(); setIsClearCartModalOpen(false); }} className="btn btn-error text-white flex-1 rounded-xl shadow-lg">Kosongkan</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}