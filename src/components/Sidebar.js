import Link from 'next/link';
import { Store, History, Package } from 'lucide-react'; // Pastikan Package di-import

export default function Sidebar() {
  return (
    <div className="w-20 bg-base-300 flex flex-col items-center py-6 gap-4 h-full border-r border-base-content/10">
      {/* 1. KASIR */}
      <div className="tooltip tooltip-right" data-tip="Kasir">
        <Link href="/" className="btn btn-ghost btn-lg btn-square">
          <Store className="w-6 h-6" />
        </Link>
      </div>
      
      {/* 2. RIWAYAT */}
      <div className="tooltip tooltip-right" data-tip="Riwayat">
        <Link href="/history" className="btn btn-ghost btn-lg btn-square">
          <History className="w-6 h-6" />
        </Link>
      </div>

      {/* 3. PRODUK (Ini yang kemarin ketinggalan) */}
      <div className="tooltip tooltip-right" data-tip="Kelola Produk">
        <Link href="/products" className="btn btn-ghost btn-lg btn-square">
          <Package className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}