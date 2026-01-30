"use client"
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from '@/components/Receipt';
import { Loader2, Printer } from 'lucide-react';

export function HistoryTable({ loading, transactions }) {
  const [selectedTx, setSelectedTx] = useState(null);
  const componentRef = useRef();

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
    // Use a timeout to ensure the state is set before printing
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  return (
    <>
      <div style={{ display: "none" }}>
        {selectedTx && <Receipt ref={componentRef} cart={selectedTx.cart} total={selectedTx.total} date={selectedTx.date} />}
      </div>

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
              {loading ? (
                <tr><td colSpan="6" className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-20 text-gray-400">Data tidak ditemukan.</td></tr>
              ) : (
                transactions.map((tx) => (
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
                      <button onClick={() => onPrintClick(tx)} className="btn btn-sm btn-ghost text-primary"><Printer className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
