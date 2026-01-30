"use client"
import { Search, Plus } from 'lucide-react';

export function ProductsHeader({ searchQuery, setSearchQuery, onAddClick }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kelola Produk</h1>
        <p className="text-secondary text-sm mt-1">Atur daftar menu dan harga restoran Anda.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-72">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-secondary/50" />
          <input
            type="text"
            placeholder="Cari nama atau kategori..."
            className="input input-bordered w-full pl-12 bg-base-100 shadow-sm focus:input-primary transition-all rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={onAddClick}
          className="btn btn-primary text-white shadow-md hover:shadow-lg transition-all rounded-xl px-6 gap-3"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Produk Baru</span>
        </button>
      </div>
    </div>
  );
}
