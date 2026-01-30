"use client"
import { X } from 'lucide-react';

export function ProductFormModal({
  isOpen,
  isEditMode,
  formData,
  setFormData,
  onClose,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-100">
          <div>
            <h3 className="text-xl font-bold text-neutral">
              {isEditMode ? "✏️ Edit Produk" : "✨ Tambah Produk Baru"}
            </h3>
            <p className="text-secondary text-sm">Isi detail produk di bawah ini.</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-secondary hover:bg-base-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <form id="productForm" onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="form-control">
              <label className="label-text font-bold text-neutral mb-2">Nama Produk <span className="text-error">*</span></label>
              <input
                type="text"
                className="input input-bordered w-full focus:input-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all py-3"
                required
                placeholder="Contoh: Nasi Goreng Spesial"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label-text font-bold text-neutral mb-2">Harga (Rp) <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-secondary font-bold">Rp</span>
                  <input
                    type="number"
                    className="input input-bordered w-full pl-12 focus:input-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all font-mono py-3"
                    required
                    placeholder="0"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label-text font-bold text-neutral mb-2">Kategori</label>
                <select
                  className="select select-bordered w-full focus:select-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all py-3 h-auto"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Makanan</option>
                  <option>Minuman</option>
                  <option>Snack</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label-text font-bold text-neutral mb-2">Jumlah Stok</label>
                <input
                  type="number"
                  className="input input-bordered w-full focus:input-primary rounded-xl bg-base-200/50 focus:bg-base-100 transition-all font-mono py-3"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label-text font-bold text-neutral mb-2">URL Gambar Produk</label>
              <div className="flex gap-4 items-center p-4 bg-base-200/50 rounded-xl border border-base-300">
                <div className="w-24 h-24 bg-base-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-base-300 overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                  ) : "📦"}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary rounded-xl bg-base-100 transition-all"
                    placeholder="https://example.com/image.png"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                  />
                  <p className="text-xs text-secondary mt-2">Tips: Salin dan tempel URL gambar produk dari web.</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-base-300 bg-base-200/30 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost text-secondary hover:bg-base-300 rounded-xl px-6">Batal</button>
          <button type="submit" form="productForm" className="btn btn-primary text-white shadow-lg hover:shadow-primary/50 rounded-xl px-8 font-bold">
            {isEditMode ? 'Simpan Perubahan' : 'Buat Produk'}
          </button>
        </div>
      </div>
    </div>
  );
}
