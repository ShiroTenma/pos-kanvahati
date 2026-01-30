"use client"
import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';

export function useProducts(showToast) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        showToast("Gagal memuat menu", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [showToast]);

  const fuse = useMemo(() => new Fuse(products, { keys: ['name', 'category'], threshold: 0.3 }), [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let result = products;
    if (query) {
      result = fuse.search(query).map(res => res.item);
    }
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }
    return result;
  }, [query, activeCategory, fuse, products]);

  return {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    products,
    loading,
    filteredProducts,
  };
}
