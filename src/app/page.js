"use client";
import { useState, useRef, useEffect } from "react";
import useCartStore from "../store/useCartStore";
import { useReactToPrint } from "react-to-print";
import { useUI } from "../hooks/useUI";
import { useProducts } from "../hooks/useProducts";
import { useTransaction } from "../hooks/useTransaction";
import { POSLayout } from "../components/pos/POSLayout";

export default function POSPage() {
  const { cart, addToCart, clearCart } = useCartStore();
  const {
    toast,
    showToast,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    isClearCartModalOpen,
    setIsClearCartModalOpen,
  } = useUI();

  const {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    loading,
    filteredProducts,
  } = useProducts(showToast);

  const [transactionDate, setTransactionDate] = useState("");
  useEffect(() => {
    // Set date only on the client-side to avoid hydration mismatch
    setTransactionDate(new Date().toLocaleString());
  }, []);

  // Print Logic
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Struk Belanja",
  });

  const [paidAmount, setPaidAmount] = useState(0);
  const [change, setChange] = useState(0);

  const { paymentMethod, setPaymentMethod, processCheckout } = useTransaction({
    cart,
    clearCart,
    handlePrint,
    showToast,
    setIsCheckoutModalOpen,
    setTransactionDate,
    setPaidAmount,
    setChange,
  });

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <POSLayout
      toast={toast}
      componentRef={componentRef}
      cart={cart}
      totalAmount={totalAmount}
      paidAmount={paidAmount}
      change={change}
      transactionDate={transactionDate}
      query={query}
      setQuery={setQuery}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      loading={loading}
      filteredProducts={filteredProducts}
      addToCart={addToCart}
      setIsClearCartModalOpen={setIsClearCartModalOpen}
      setIsCheckoutModalOpen={setIsCheckoutModalOpen}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      isCheckoutModalOpen={isCheckoutModalOpen}
      processCheckout={processCheckout}
      isClearCartModalOpen={isClearCartModalOpen}
    />
  );
}