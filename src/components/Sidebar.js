import Link from 'next/link';
import { Store, History, Package } from 'lucide-react';

export default function Sidebar() {
  return (
    // UBAH DISINI: Background Putih (base-100), Border Cream (base-300)
    <div className="w-20 bg-base-100 flex flex-col items-center py-6 gap-6 h-full shadow-lg border-r border-base-300 z-20">
      
      {/* Logo Brand (Biru Pastel) */}
      <div className="mb-2 p-3 bg-primary/10 rounded-xl text-primary">
        <div className="w-6 h-6 bg-primary rounded-full animate-pulse"></div>
      </div>

      {/* 1. KASIR */}
      <div className="tooltip tooltip-right tooltip-secondary" data-tip="Kasir">
        <Link href="/" className="btn btn-ghost btn-lg btn-square text-primary hover:bg-primary hover:text-white transition-all rounded-xl">
          <Store className="w-6 h-6" />
        </Link>
      </div>
      
      {/* 2. RIWAYAT */}
      <div className="tooltip tooltip-right tooltip-secondary" data-tip="Riwayat">
        <Link href="/history" className="btn btn-ghost btn-lg btn-square text-primary hover:bg-primary hover:text-white transition-all rounded-xl">
          <History className="w-6 h-6" />
        </Link>
      </div>

      {/* 3. PRODUK */}
      <div className="tooltip tooltip-right tooltip-secondary" data-tip="Kelola Produk">
        <Link href="/products" className="btn btn-ghost btn-lg btn-square text-primary hover:bg-primary hover:text-white transition-all rounded-xl">
          <Package className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}