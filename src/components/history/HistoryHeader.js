"use client"
import { History, Search, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export function HistoryHeader({ searchQuery, setSearchQuery, filteredTransactions, showToast, loading }) {

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

      showToast("Laporan berhasil didownload!", "success");
    } catch (e) {
      showToast("Gagal export excel", "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <History className="w-8 h-8 text-primary" /> Riwayat Transaksi
        </h1>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari ID atau menu..."
            className="input w-full pl-12 bg-base-100 shadow-sm focus:border-primary rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={exportToExcel}
          disabled={loading || filteredTransactions.length === 0}
          className="btn btn-success text-white shadow-md rounded-xl gap-2"
        >
          <FileSpreadsheet className="w-5 h-5" /> Export Excel
        </button>
      </div>
    </div>
  );
}
