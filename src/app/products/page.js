"use client"
import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Search, Package, Loader2, AlertCircle } from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", category: "Makanan", image: "📦" });

  // Fetch Data (DIPERBAIKI)
  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      
      // --- PENGAMAN UTAMA ---
      // Cek apakah data benar-benar Array?
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Data error:", data);
        setProducts([]); // Kalau bukan array, paksa kosong biar gak crash
      }
    } catch (error) {
      console.error("Gagal memuat data");
      setProducts([]); 
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  // Handle Modal
  const openModal = (mode, product = null) => {
    setIsEditMode(mode === 'edit');
    if (mode === 'edit' && product) {
      setCurrentId(product.id);
      setFormData({ ...product });
    } else {
      setFormData({ name: "", price: "", category: "Makanan", image: "📦" });
    }
    setIsModalOpen(true);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.price) { alert("Nama dan Harga wajib diisi"); return; }

    const url = isEditMode ? `/api/products/${currentId}` : '/api/products';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, price: parseInt(formData.price) })
        });
        setIsModalOpen(false);
        fetchProducts();
    } catch (error) {
        alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if(!confirm("Yakin ingin menghapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  // Filter Search (DIPERBAIKI)
  // Kita pastikan dulu products adalah Array sebelum di-filter
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-200 min-h-screen text-neutral font-sans">
      
      {/* HEADER */}
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
            onClick={() => openModal('add')} 
            className="btn btn-primary text-white shadow-md hover:shadow-lg transition-all rounded-xl px-6 gap-3"
          >
            <Plus className="w-5 h-5" /> 
            <span className="font-semibold">Produk Baru</span>
          </button>
        </div>
      </div>

      {/* TABEL */}
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
              {isLoading ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center text-secondary">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p>Memuat data produk...</p>
                        </div>
                    </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center text-secondary/70">
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-base-200 p-4 rounded-full">
                                <Package className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Tidak ada produk ditemukan</h3>
                                <p className="text-sm">Silakan tambah menu baru.</p>
                            </div>
                        </div>
                    </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
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
                    <span className={`badge badge-lg border-0 font-medium ${
                        p.category === 'Makanan' ? 'bg-orange-100 text-orange-800' :
                        p.category === 'Minuman' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                    }`}>
                        {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 align-middle font-mono font-bold text-primary text-base">
                    Rp {p.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 align-middle">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openModal('edit', p)} className="btn btn-sm btn-square btn-ghost text-warning hover:bg-warning/10 tooltip" data-tip="Edit">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/10 tooltip" data-tip="Hapus">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {!isLoading && filteredProducts.length > 0 && (
            <div className="p-4 bg-base-200/30 border-t border-base-300/50 text-secondary text-sm text-right">
                Menampilkan <strong>{filteredProducts.length}</strong> produk
            </div>
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-100">
                <div>
                    <h3 className="text-xl font-bold text-neutral">
                        {isEditMode ? "✏️ Edit Produk" : "✨ Tambah Produk Baru"}
                    </h3>
                    <p className="text-secondary text-sm">Isi detail produk di bawah ini.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-secondary hover:bg-base-200">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form id="productForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="form-control">
                  <label className="label-text font-bold text-neutral mb-2">Nama Produk <span className="text-error">*</span></label>
                  <input type="text" className="input input-bordered w-full focus:input-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all py-3" required
                    placeholder="Contoh: Nasi Goreng Spesial"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label-text font-bold text-neutral mb-2">Harga (Rp) <span className="text-error">*</span></label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-secondary font-bold">Rp</span>
                        <input type="number" className="input input-bordered w-full pl-12 focus:input-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all font-mono py-3" required
                            placeholder="0"
                            value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label-text font-bold text-neutral mb-2">Kategori</label>
                    <select className="select select-bordered w-full focus:select-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all py-3 h-auto" 
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Makanan</option> <option>Minuman</option> <option>Snack</option>
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label-text font-bold text-neutral mb-2">Ikon Emoji</label>
                  <div className="flex gap-4 items-center p-4 bg-base-200/50 rounded-xl border border-base-300">
                    <div className="w-16 h-16 bg-base-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-base-300">
                        {formData.image || "📦"}
                    </div>
                    <div className="flex-1">
                        <input type="text" className="input input-bordered w-full focus:input-primary rounded-xl bg-base-100 transition-all" placeholder="Tempel emoji di sini (Win + .)"
                          value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                        <p className="text-xs text-secondary mt-2">Tips: Gunakan tombol <kbd className="kbd kbd-sm">Win</kbd> + <kbd className="kbd kbd-sm">.</kbd> untuk membuka keyboard emoji.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-base-300 bg-base-200/30 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost text-secondary hover:bg-base-300 rounded-xl px-6">Batal</button>
                <button type="submit" form="productForm" className="btn btn-primary text-white shadow-lg hover:shadow-primary/50 rounded-xl px-8 font-bold">
                    {isEditMode ? 'Simpan Perubahan' : 'Buat Produk'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}