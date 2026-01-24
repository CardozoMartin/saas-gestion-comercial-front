import { create } from 'zustand';

interface SaleEditingState {
  saleEdit: any | null;
  setSaleEdit: (sale: any) => void;
  clearSaleEdit: () => void;
}

export const useSaleEdit = create<SaleEditingState>((set) => ({
  saleEdit: null,
  setSaleEdit: (sale) => set({ saleEdit: sale }),
  clearSaleEdit: () => set({ saleEdit: null }),
}));