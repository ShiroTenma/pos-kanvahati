"use client"
import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from '@/components/Receipt';
import { Printer, Calendar, Search, Loader2, History, FileSpreadsheet, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx'; 

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null); // State Toast
  
  const [selectedTx, setSelectedTx] = useState(null); 
  const componentRef = useRef();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        setTransactions(data);
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    }
    fetchHistory();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Struk Belanja",
  });

  const onPrintClick = (tx) => {
    const formattedData = {
      cart: tx.items.map(item => ({
        name: item.product.name,
        qty: item.qty,
        price: item.price
      })),
      total: tx.total,
      date: new Date(tx.date).toLocaleString(),
      paymentMethod: tx.paymentMethod
    };
    setSelectedTx(formattedData);
    setTimeout(() => { handlePrint(); }, 100);
  };

  const exportToExcel = () => {
    try {
        const dataToExport = filteredTransactions.map(tx => ({
            "ID": tx.id,
            "Tanggal": new Date(tx.date).toLocaleDateString('id-ID'),
            "Jam": new Date(tx.date).toLocaleTimeString('id-ID'),
            "Metode": tx.paymentMethod || "CASH",
            "Total": tx.total,
            "Items": tx.items.map(i => `${i.product.name} (${i.qty})`).join(", ")
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");
        XLSX.writeFile(workbook, `Laporan_POS_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        showToast("Laporan berhasil didownload!"); // Notifikasi Sukses
    } catch (e) {
        alert("Gagal export excel");
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toString().includes(searchQuery) || 
    tx.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 h-screen overflow-y-auto bg-base-200 text-neutral font-sans relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
            <div className="alert alert-success shadow-lg text-white rounded-xl animate-bounce">
                <CheckCircle className="w-5 h-5"/>
                <span>{toast}</span>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <History className="w-8 h-8 text-primary" /> Riwayat Transaksi
            </h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Cari ID atau menu..." className="input w-full pl-12 bg-base-100 shadow-sm focus:border-primary rounded-xl"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            <button onClick={exportToExcel} disabled={loading || filteredTransactions.length === 0}
                className="btn btn-success text-white shadow-md rounded-xl gap-2">
                <FileSpreadsheet className="w-5 h-5" /> Export Excel
            </button>
        </div>
      </div>

      <div style={{ display: "none" }}>
        {selectedTx && <Receipt ref={componentRef} cart={selectedTx.cart} total={selectedTx.total} date={selectedTx.date} />}
      </div>

      {/* Tabel */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300/50 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="table w-full">
            <thead className="bg-base-200/50 text-gray-500 text-sm uppercase font-semibold">
                <tr>
                    <th className="py-5 px-6">ID</th>
                    <th className="py-5 px-6">Waktu</th>
                    <th className="py-5 px-6">Metode</th>
                    <th className="py-5 px-6">Detail Pesanan</th>
                    <th className="py-5 px-6 text-right">Total</th>
                    <th className="py-5 px-6 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td colSpan="6" className="text-center py-20"><Loader2 className="animate-spin mx-auto"/></td></tr> : 
                filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-base-200/50 hover:bg-base-200/30">
                        <td className="py-4 px-6 font-mono font-bold text-primary">#{tx.id}</td>
                        <td className="py-4 px-6">
                            <div className="text-sm">{new Date(tx.date).toLocaleDateString('id-ID')}</div>
                            <div className="text-xs text-gray-400">{new Date(tx.date).toLocaleTimeString('id-ID')}</div>
                        </td>
                        <td className="py-4 px-6">
                            <span className={`badge border-0 font-bold ${tx.paymentMethod === 'QRIS' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {tx.paymentMethod || "CASH"}
                            </span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-2">
                                {tx.items.map((item, idx) => (
                                    <span key={idx} className="badge bg-base-200 border-0 text-xs py-3 px-3"><b>{item.qty}x</b>&nbsp;{item.product.name}</span>
                                ))}
                            </div>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-lg">Rp {tx.total.toLocaleString()}</td>
                        <td className="py-4 px-6 text-center">
                            <button onClick={() => onPrintClick(tx)} className="btn btn-sm btn-ghost text-primary"><Printer className="w-5 h-5"/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}