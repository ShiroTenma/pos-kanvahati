import { create } from 'zustand'

const useCartStore = create((set) => ({
  cart: [],
  
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, qty: 1 }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id)
  })),

  updateQty: (id, type) => set((state) => ({
    cart: state.cart.map((item) => {
      if (item.id === id) {
        const newQty = type === 'plus' ? item.qty + 1 : item.qty - 1;
        return { ...item, qty: Math.max(1, newQty) };
      }
      return item;
    })
  })),

  clearCart: () => set({ cart: [] }),
}))

export default useCartStore;