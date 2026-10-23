import { create } from 'zustand';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    // Check if identical item (same product & variant) already exists
    const existingIndex = state.items.findIndex(
      (i) => i.productId === item.productId && i.variant === item.variant
    );

    if (existingIndex > -1) {
      const newItems = [...state.items];
      newItems[existingIndex].quantity += item.quantity;
      return { items: newItems };
    }

    return { 
      items: [...state.items, { ...item, cartItemId: Math.random().toString(36).substring(7) }] 
    };
  }),
  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter((i) => i.cartItemId !== cartItemId)
  })),
  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map((i) => 
      i.cartItemId === cartItemId ? { ...i, quantity: Math.max(1, quantity) } : i
    )
  })),
  clearCart: () => set({ items: [] }),
  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
