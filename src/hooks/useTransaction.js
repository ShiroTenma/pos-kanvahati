"use client"
import { useState } from 'react';

export function useTransaction({ cart, clearCart, handlePrint, showToast, setIsCheckoutModalOpen, setTransactionDate }) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const processCheckout = async () => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: total,
          items: cart,
          paymentMethod: paymentMethod
        })
      });

      const data = await res.json();

      if (data.success) {
        handlePrint();
        clearCart();
        setTransactionDate(new Date().toLocaleString());
        setIsCheckoutModalOpen(false);
        showToast("Transaksi Berhasil Disimpan!", "success");
      } else {
        showToast("Gagal: " + data.error, "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    processCheckout,
  };
}
