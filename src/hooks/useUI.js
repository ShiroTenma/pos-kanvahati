"use client"
import { useState } from 'react';

export function useUI() {
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return {
    toast,
    showToast,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    isClearCartModalOpen,
    setIsClearCartModalOpen,
  };
}
