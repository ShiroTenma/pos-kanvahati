"use client"
import { useState, useEffect, useMemo } from 'react';

const INITIAL_FORM_DATA = { name: "", price: "", category: "Makanan", image: "📦" };

export function useProductsCRUD() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (mode, product = null) => {
    setIsEditMode(mode === 'edit');
    if (mode === 'edit' && product) {
      setCurrentId(product.id);
      setFormData({ ...product });
    } else {
      setCurrentId(null);
      setFormData(INITIAL_FORM_DATA);
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Nama dan Harga wajib diisi");
      return;
    }

    const url = isEditMode ? `/api/products/${currentId}` : '/api/products';
    const method = isEditMode ? 'PUT' : 'POST';
    const body = JSON.stringify({ ...formData, price: parseInt(formData.price, 10) || 0 });

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
      if (!res.ok) throw new Error('Server responded with an error');
      closeModal();
      await fetchProducts(); // Refresh data
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Server responded with an error');
        await fetchProducts(); // Refresh data
    } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Gagal menghapus produk.");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);
  
  return {
    products,
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    isEditMode,
    formData,
    setFormData,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    filteredProducts
  };
}
