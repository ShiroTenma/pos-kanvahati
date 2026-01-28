"use client"
import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from '@/components/Receipt'; // Import struk yang sudah ada
import { Printer } from 'lucide-react';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Print Ulang
  const [selectedTx, setSelectedTx] = useState(null); 
  const componentRef = useRef();

  // Fetch Data
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // Setup Print
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Struk Belanja",
  });

  // Fungsi saat tombol print ditekan
  const onPrintClick = (tx) => {
    // Format data agar cocok dengan komponen Receipt.js
    const formattedData = {
      cart: tx.items.map(item => ({
        name: item.product.name,
        qty: item.qty,
        price: item.price
      })),
      total: tx.total,
      date: new Date(tx.date).toLocaleString()
    };
    
    setSelectedTx(formattedData);
    
    // Tunggu sebentar sampai state terupdate, baru print
    setTimeout(() => {
        handlePrint();
    }, 100);
  };

  return (
    <div className="p-6 h-screen overflow-y-auto bg-base-200 text-base-content">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

      {/* Komponen Struk Tersembunyi (Untuk Print Ulang) */}
      <div style={{ display: "none" }}>
        {selectedTx && (
            <Receipt 
                ref={componentRef} 
                cart={selectedTx.cart} 
                total={selectedTx.total} 
                date={selectedTx.date} 
            />
        )}
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          {/* Header Tabel */}
          <thead>
            <tr className="bg-base-300">
              <th>ID</th>
              <th>Tanggal</th>
              <th>Total</th>
              <th>Detail Item</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
            ) : transactions.map((tx) => (
              <tr key={tx.id}>
                <td>#{tx.id}</td>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td className="font-bold">Rp {tx.total.toLocaleString()}</td>
                <td className="text-sm">
                    {tx.items.map((item, idx) => (
                        <div key={idx}>
                            {item.qty}x {item.product.name}
                        </div>
                    ))}
                </td>
                <td>
                  <button 
                    onClick={() => onPrintClick(tx)}
                    className="btn btn-sm btn-ghost text-primary tooltip"
                    data-tip="Print Ulang"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}