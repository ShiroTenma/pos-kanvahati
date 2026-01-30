
import { Toast } from './Toast';
import { Header } from './Header';
import { ProductList } from './ProductList';
import { Cart } from './Cart';
import { CheckoutModal } from './CheckoutModal';
import { ClearCartModal } from './ClearCartModal';
import { Receipt } from '../Receipt';

export const POSLayout = ({
  toast,
  componentRef,
  cart,
  totalAmount,
  paidAmount,
  change,
  transactionDate,
  query,
  setQuery,
  activeCategory,
  setActiveCategory,
  loading,
  filteredProducts,
  addToCart,
  setIsClearCartModalOpen,
  setIsCheckoutModalOpen,
  paymentMethod,
  setPaymentMethod,
  isCheckoutModalOpen,
  processCheckout,
  isClearCartModalOpen,
}) => {
  return (
    <div className="flex h-screen bg-base-200 overflow-hidden font-sans text-neutral relative">
      <Toast toast={toast} />

      {/* Hidden Receipt for printing */}
      <div style={{ display: "none" }}>
        <Receipt
          ref={componentRef}
          cart={cart}
          total={totalAmount}
          paidAmount={paidAmount}
          change={change}
          date={transactionDate}
          paymentMethod={paymentMethod}
        />
      </div>

      {/* Left Side: Product List */}
      <div className="flex-1 flex flex-col h-full">
        <Header
          query={query}
          setQuery={setQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <ProductList
          loading={loading}
          products={filteredProducts}
          addToCart={addToCart}
        />
      </div>

      {/* Right Side: Cart */}
      <Cart
        setIsClearCartModalOpen={setIsClearCartModalOpen}
        setIsCheckoutModalOpen={setIsCheckoutModalOpen}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={(data) => processCheckout(data)}
        paymentMethod={paymentMethod}
      />
      <ClearCartModal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
      />
    </div>
  );
};
