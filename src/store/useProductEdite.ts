import { create } from "zustand";


interface ProductEditeState {
    productEdite: any;
    setProductEdite: (product: any) => void;
}

export const useProductEdite = create<ProductEditeState>((set) => ({
    productEdite: null,
    setProductEdite: (product) => set({ productEdite: product }),
}));