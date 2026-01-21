import { create } from 'zustand';

interface ProductEditeState {
  productEdite: any | null;
  setProductEdite: (product: any) => void;
  clearProductEdite: () => void;
}

export const useProductEdite = create<ProductEditeState>((set) => ({
  productEdite: null,
  setProductEdite: (product) => set({ productEdite: product }),
  clearProductEdite: () => set({ productEdite: null }),
}));