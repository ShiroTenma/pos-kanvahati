"use client"
import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // State Form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Makanan",
    image: "📦"
  });

  // 1. Fetch Data
  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Buka Modal Tambah
  const openModalAdd = () => {
    setIsEditMode(false);
    setFormData({ name: "", price: "", category: "Makanan", image: "📦" });
    setIsModalOpen(true);
  };

  // 3. Buka Modal Edit
  const openModalEdit = (product) => {
    setIsEditMode(true);
    setCurrentId(product.id);
    setFormData({ 
        name: product.name, 
        price: product.price, 
        category: product.category, 
        image: product.image 
    });
    setIsModalOpen(true);
  };

  // 4. Proses Simpan (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    
    // Validasi sederhana
    if (!formData.name || !formData.price) {
        alert("Nama dan Harga wajib diisi!");
        return;
    }

    const url = isEditMode ? `/api/products/${currentId}` : '/api/products';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            price: parseInt(formData.price) // Pastikan dikirim sebagai ANGKA
        })
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh data
        alert("Berhasil disimpan!");
      } else {
        alert("Gagal menyimpan ke database.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // 5. Proses Hapus
  const handleDelete = async (id) => {
    if(!confirm("Yakin mau hapus menu ini?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-800">
      
      {/* HEADER & TOMBOL TAMBAH */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Produk</h1>
        
        {/* Tombol Tambah dengan Warna Manual (Biru Tua) */}
        <button 
            onClick={openModalAdd} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" /> 
          <span>Tambah Item</span>
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-4 border-b">Gambar</th>
              <th className="p-4 border-b">Nama Produk</th>
              <th className="p-4 border-b">Kategori</th>
              <th className="p-4 border-b">Harga</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan="5" className="text-center p-8">Sedang memuat data...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="text-3xl p-4">{p.image}</td>
                <td className="font-bold p-4">{p.name}</td>
                <td className="p-4"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm border">{p.category}</span></td>
                <td className="p-4">Rp {p.price.toLocaleString()}</td>
                
                {/* TOMBOL EDIT & HAPUS */}
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => openModalEdit(p)} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL (POP-UP FORM) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            
            {/* Tombol Close (X) */}
            <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
                <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Nama */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                    <input 
                        type="text" 
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                {/* Harga & Kategori */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                        <input 
                            type="number" 
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="Makanan">Makanan</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Snack">Snack</option>
                        </select>
                    </div>
                </div>

                {/* Gambar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gambar (Emoji)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none bg-white text-black"
                            placeholder="Contoh: 🍔"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                        <div className="w-12 h-10 flex items-center justify-center bg-gray-100 rounded border text-2xl">
                            {formData.image}
                        </div>
                    </div>
                </div>

                {/* Tombol Simpan */}
                <button 
                    type="submit" 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95"
                >
                    {isEditMode ? "Simpan Perubahan" : "Simpan Produk Baru"}
                </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}