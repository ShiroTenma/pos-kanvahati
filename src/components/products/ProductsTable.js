"use client"
import { Pencil, Trash2, Package, Loader2 } from 'lucide-react';

export function ProductsTable({ isLoading, products, onEditClick, onDeleteClick }) {
  if (isLoading) {
    return (
      <div className="py-20 text-center text-secondary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Memuat data produk...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-secondary/70">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-base-200 p-4 rounded-full">
            <Package className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Tidak ada produk ditemukan</h3>
            <p className="text-sm">Silakan tambah menu baru.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200/60 text-secondary text-sm uppercase font-semibold tracking-wider">
            <tr>
              <th className="py-5 px-6 text-center w-24">Ikon</th>
              <th className="py-5 px-6 text-left">Detail Produk</th>
              <th className="py-5 px-6 text-left">Kategori</th>
              <th className="py-5 px-6 text-left">Harga Satuan</th>
              <th className="py-5 px-6 text-center w-40">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-base-300/50 hover:bg-base-200/40 transition-colors">
                <td className="py-4 px-6 text-center">
                  <div className="w-14 h-14 bg-base-200/80 rounded-xl flex items-center justify-center text-3xl shadow-sm border border-base-300">
                    {p.image}
                  </div>
                </td>
                <td className="py-4 px-6 align-middle">
                  <div className="font-bold text-neutral text-base">{p.name}</div>
                  <div className="text-secondary text-xs mt-1">ID: #{String(p.id).padStart(3, '0')}</div>
                </td>
                <td className="py-4 px-6 align-middle">
                  <span className={`badge badge-lg border-0 font-medium ${p.category === 'Makanan' ? 'bg-orange-100 text-orange-800' : p.category === 'Minuman' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {p.category}
                  </span>
                </td>
                <td className="py-4 px-6 align-middle font-mono font-bold text-primary text-base">
                  Rp {p.price.toLocaleString()}
                </td>
                <td className="py-4 px-6 align-middle">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => onEditClick(p)} className="btn btn-sm btn-square btn-ghost text-warning hover:bg-warning/10 tooltip" data-tip="Edit">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDeleteClick(p.id)} className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/10 tooltip" data-tip="Hapus">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-base-200/30 border-t border-base-300/50 text-secondary text-sm text-right">
        Menampilkan <strong>{products.length}</strong> produk
      </div>
    </div>
  );
}
