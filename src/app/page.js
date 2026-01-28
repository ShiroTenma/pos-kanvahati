"use client"
import { useState, useMemo, useRef, useEffect } from 'react';
import useCartStore from '../store/useCartStore';
import { Search, ShoppingCart } from 'lucide-react';
import Fuse from 'fuse.js';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from '../components/Receipt';

export default function POSPage() {
  // --- STATE ---
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [transactionDate, setTransactionDate] = useState("");

  const { cart, addToCart, updateQty, clearCart } = useCartStore();

  // --- 1. FETCH DATA SAAT LOAD ---
  useEffect(() => {
    setTransactionDate(new Date().toLocaleString());

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil produk", err);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // --- 2. SETUP PRINT (Hanya Satu Kali Deklarasi) ---
  const componentRef = useRef();
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Struk Belanja",
  });

  // --- 3. FUNGSI CHECKOUT (Bayar -> Simpan DB -> Print) ---
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const confirmBayar = confirm(`Total Rp ${total.toLocaleString()}. Proses pembayaran?`);
    
    if (!confirmBayar) return;

    try {
      // Kirim ke API Backend
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: total,
          items: cart
        })
      });

      const data = await res.json();

      if (data.success) {
        // Jika sukses: Print, Bersihkan Keranjang, Update Tanggal
        handlePrint(); 
        clearCart();
        setTransactionDate(new Date().toLocaleString());
        alert("Transaksi Berhasil Disimpan!");
      } else {
        alert("Gagal menyimpan transaksi: " + data.error);
      }

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // --- 4. LOGIC PENCARIAN (Fuse.js) ---
  const fuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'category'],
    threshold: 0.3,
  }), [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (query) result = fuse.search(query).map(res => res.item);
    if (activeCategory !== "All") result = result.filter(p => p.category === activeCategory);
    return result;
  }, [query, activeCategory, fuse, products]);

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden font-sans text-base-content">
      
      {/* Komponen Struk Tersembunyi */}
      <div style={{ display: "none" }}>
        <Receipt 
            ref={componentRef} 
            cart={cart} 
            total={totalAmount} 
            date={transactionDate} 
        />
      </div>

      {/* KIRI: DAFTAR PRODUK */}
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 bg-base-100 shadow-sm z-10">
          <div className="relative w-full mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari menu database..." 
              className="input input-bordered w-full pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["All", "Makanan", "Minuman", "Snack"].map(cat => (
              <button 
                key={cat}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center mt-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p>Mengambil data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="card bg-base-100 shadow-md hover:shadow-xl transition-all cursor-pointer active:scale-95"
                  onClick={() => addToCart(product)}
                >
                  <div className="card-body p-4 items-center text-center">
                    <div className="text-4xl mb-2">{product.image}</div>
                    <h2 className="card-title text-sm">{product.name}</h2>
                    <p className="text-primary font-bold">Rp {product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KANAN: KERANJANG */}
      <div className="w-[350px] bg-base-100 h-full shadow-2xl flex flex-col border-l border-base-300">
        <div className="p-4 border-b border-base-300 bg-base-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart /> Keranjang
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Keranjang Kosong</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-base-200 rounded-box">
                <div className="flex-1">
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs opacity-50">Rp {item.price.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, 'minus')} className="btn btn-xs btn-square">-</button>
                  <span className="text-sm font-bold">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 'plus')} className="btn btn-xs btn-square">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-base-300 bg-base-100">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span>Rp {totalAmount.toLocaleString()}</span>
          </div>
          
          <button 
            className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Bayar & Print
          </button>
        </div>
      </div>
    </div>
  );
}