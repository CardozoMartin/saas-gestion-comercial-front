import { create } from "zustand";

const saveDateLocalStorage = (carrito: any) => {
  localStorage.setItem("cart", JSON.stringify(carrito));
};

const getDateLocalStorage = () => {
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
};

interface Product {
  id: number;
  nombre: string;
  precioVenta: number;
  cantidad: number;
  unidadMedidaNombre: string;
  unidadMedidaId: number;
  codigo: string;
  stockActual: number;
  categoriaNombre?: string;
}

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCart: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  cart: getDateLocalStorage(),
  
  addToCart: (product) => {
    const currentCart = get().cart;
    const existingProduct = currentCart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingProduct) {
      updatedCart = currentCart.map((item) =>
        item.id === product.id 
          ? { ...item, cantidad: item.cantidad + product.cantidad } 
          : item
      );
    } else {
      updatedCart = [...currentCart, product];
    }
    set({ cart: updatedCart });
    saveDateLocalStorage(updatedCart);
  },
  
  updateQuantity: (productId, newQuantity) => {
    const currentCart = get().cart;
    const updatedCart = currentCart.map((item) =>
      item.id === productId ? { ...item, cantidad: newQuantity } : item
    );
    set({ cart: updatedCart });
    saveDateLocalStorage(updatedCart);
  },
  
  removeFromCart: (productId) => {
    const currentCart = get().cart;
    const updatedCart = currentCart.filter((item) => item.id !== productId);
    set({ cart: updatedCart });
    saveDateLocalStorage(updatedCart);
  },
  
  clearCart: () => {
    set({ cart: [] });
    saveDateLocalStorage([]);
  },
  
  getCart: () => {
    const cartFromStorage = getDateLocalStorage();
    set({ cart: cartFromStorage });
  },
}));