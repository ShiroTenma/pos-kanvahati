"use client"
import { useState, useEffect, useMemo } from 'react';

export function useHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("API Error:", data);
          setTransactions([]);
          showToast("Gagal memuat data dari server", "error");
        }
      } catch (err) {
        console.error(err);
        setTransactions([]);
        showToast("Terjadi kesalahan koneksi", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filteredTransactions = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    if (!searchQuery) {
        return safeTransactions;
    }
    return safeTransactions.filter(tx =>
      tx.id.toString().includes(searchQuery) ||
      tx.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [transactions, searchQuery]);

  return {
    transactions,
    loading,
    searchQuery,
    setSearchQuery,
    toast,
    showToast,
    filteredTransactions
  };
}
