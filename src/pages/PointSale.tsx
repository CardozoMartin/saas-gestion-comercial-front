import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../store/useCart";
import ModalSale from "../components/SalePoint/ModalSale";
import DrawerCliente from "../components/Drawer/DrawerCliente";
import { useShortcuts } from "../hooks/useShortcuts";
import { useBarcodeReader } from "../hooks/useBarcodeReader"; // 👈 IMPORTAR EL HOOK
import CartItems from "../components/SalePoint/CartItems";
import SearchBar from "../components/SalePoint/SearchBar";
import ProductCard from "../components/SalePoint/ProductCard";
import { useSession } from "../store/useSession";
import { useSale } from "../hooks/useSale";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Product {
  id: number;
  nombre: string;
  codigo: string;
  categoriaNombre?: string;
  precioVenta: string | number;
  unidadMedidaNombre: string;
  unidadMedidaId?: number;
  stockActual?: number;
}

const PointSale = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inputType, setInputType] = useState<'cantidad' | 'monto'>("cantidad");
  const [inputValue, setInputValue] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showCuentaCorrienteModal, setShowCuentaCorrienteModal] = useState(false);

  const [autoSpaceEnabled, setAutoSpaceEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('pos.autoSpace');
    return saved === null ? true : saved === 'true';
  });

  const { allProductsData } = useProduct();
  const {
    cart,
    addToCart: addToCartStore,
    removeFromCart: removeFromCartStore,
    clearCart: clearCartStore,
    updateQuantity,
  } = useCart();
  const { user } = useSession();
  const { postSale, isPostingSale } = useSale();
  const queryClient = useQueryClient();

  const cartItems = cart;

  // 🔥 HOOK DEL ESCÁNER DE CÓDIGOS DE BARRAS
  useBarcodeReader({
    onScan: (barcode) => {
      console.log("🔍 Código escaneado:", barcode);
      
      // Buscar el producto por código
      const producto = allProductsData?.find((p: any) => p.codigo.toLowerCase() === barcode.toLowerCase());

      if (producto) {
        // Si es un producto con peso/volumen, abrir el modal para ingresar cantidad
        if (isWeightVolumeSale(producto.unidadMedidaNombre)) {
          setSelectedProduct(producto);
          setInputType("cantidad");
          setInputValue("");
          toast.success(`📦 ${producto.nombre}`, {
            description: "Ingresa la cantidad a vender"
          });
        } else {
          // Agregar directamente al carrito
          addToCart(producto);
          toast.success(`✅ ${producto.nombre} agregado`);
        }
      } else {
        toast.error(`❌ Producto no encontrado`, {
          description: `Código: ${barcode}`
        });
      }
    },
    minLength: 3, // Ajusta según el largo de tus códigos
    timeout: 100, // Ajusta según la velocidad de tu escáner
    enabled: !showModal && !showCuentaCorrienteModal, // Solo activo cuando no hay modales
  });

  // ATAJOS DE TECLADO
  useShortcuts({
    enter: () => {
      if (cartItems.length > 0 && !showModal && !showCuentaCorrienteModal) {
        setShowModal(true);
      }
    },
    escape: () => {
      if (selectedProduct) {
        setSelectedProduct(null);
        setInputValue("");
      } else if (showModal) {
        setShowModal(false);
      } else if (showCuentaCorrienteModal) {
        setShowCuentaCorrienteModal(false);
      } else if (cartItems.length > 0) {
        if (confirm("¿Limpiar el carrito?")) {
          clearCart();
        }
      }
    },
    "ctrl+l": () => {
      if (cartItems.length > 0 && confirm("¿Limpiar el carrito?")) {
        clearCart();
      }
    },
    "ctrl+g": () => {
      if (cartItems.length > 0 && !showModal) {
        setShowModal(true);
      }
    },
    "ctrl+c": () => {
      if (cartItems.length > 0 && !showCuentaCorrienteModal) {
        setShowCuentaCorrienteModal(true);
      }
    },
    "ctrl+b": () => {
      const searchInput = document.getElementById("search-product") as HTMLInputElement | null;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    f1: () => agregarProductoRapido("Coca Cola 2.25L"),
    f7: () => agregarProductoRapido("Cigarrillos"),
    f8: () => agregarProductoRapido("Pan"),
    f9: () => agregarProductoRapido("Leche"),
    1: () => agregarProductoRapido("Coca Cola 2.25L"),
    ' ': () => {
      if (!autoSpaceEnabled) {
        toast('Auto-space desactivado');
        return;
      }
      if (cartItems.length > 0) {
        processSaleAuto();
      }
    },
    "+": () => {
      if (cartItems.length > 0) {
        const ultimoItem = cartItems[cartItems.length - 1];
        incrementQuantity(ultimoItem.id, ultimoItem.stockActual);
      }
    },
    "-": () => {
      if (cartItems.length > 0) {
        const ultimoItem = cartItems[cartItems.length - 1];
        decrementQuantity(ultimoItem.id);
      }
    },
    delete: () => {
      if (cartItems.length > 0) {
        const ultimoItem = cartItems[cartItems.length - 1];
        removeFromCart(ultimoItem.id);
      }
    },
  });

  const processSaleAuto = async () => {
    if (cartItems.length === 0) return;
    if (isPostingSale) {
      toast.warning("Ya se está procesando una venta");
      return;
    }

    const saleData = {
      clienteId: undefined,
      usuarioId: user?.userId,
      tipoVenta: "contado",
      descuento: 0,
      observaciones: "Venta automática con tecla Space",
      subtotal: subtotal,
      total: total,
      detalles: cartItems.map((item) => ({
        productoId: item.id,
        unidadMedidaId: item.unidadMedidaId,
        cantidad: item.cantidad,
        precioUnitario: Number(item.precioVenta),
      })),
    };

    try {
      await postSale(saleData);
      toast.success(`Venta procesada: $${total.toFixed(2)}`);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (err: any) {
      const errorDeCaja = err?.response?.data?.error;
      if (errorDeCaja === "No tienes una caja abierta. Abre una caja antes de registrar ventas.") {
        toast.error('Debes abrir una caja antes de registrar ventas');
        return;
      }
      toast.error('Error al procesar la venta automática');
      console.error(err);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = "success") => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const agregarProductoRapido = (nombreProducto: string) => {
    const producto = allProductsData?.find((p: any) =>
      p.nombre.toLowerCase().includes(nombreProducto.toLowerCase())
    );

    if (producto) {
      if (isWeightVolumeSale(producto.unidadMedidaNombre)) {
        setSelectedProduct(producto as Product);
      } else {
        addToCart(producto as Product);
        showNotification(`✅ ${producto.nombre} agregado`);
      }
    } else {
      showNotification(`❌ Producto "${nombreProducto}" no encontrado`, "error");
    }
  };

  const isWeightVolumeSale = (unidadMedida: string) => {
    return ["Kilogramo", "Litro", "Metro"].includes(unidadMedida);
  };

  const getSubUnit = (unidadMedida: string) => {
    const map: Record<string, string> = {
      Kilogramo: "gramos",
      Litro: "ml",
      Metro: "cm",
    };
    return map[unidadMedida] || unidadMedida;
  };

  const calculateQuantity = (producto: Product, type: 'cantidad' | 'monto' | string, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (type === "cantidad") {
      return numValue;
    } else {
      return numValue / Number(producto.precioVenta);
    }
  };

  const filteredProducts = searchTerm.trim()
    ? allProductsData?.filter((p: any) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : [];

  const addToCart = (producto: Product, cantidadCustom: number | null = null) => {
    const cantidad = cantidadCustom !== null ? cantidadCustom : 1;
    addToCartStore({
      id: producto.id,
      nombre: producto.nombre,
      precioVenta: Number(producto.precioVenta),
      cantidad: cantidad,
      unidadMedidaNombre: producto.unidadMedidaNombre,
      unidadMedidaId: producto.unidadMedidaId ?? 0,
      stockActual: producto.stockActual ?? 0,
      codigo: producto.codigo,
      categoriaNombre: producto.categoriaNombre,
    });
  };

  const handleProductClick = (producto: Product) => {
    if (isWeightVolumeSale(producto.unidadMedidaNombre)) {
      setSelectedProduct(producto);
      setInputType("cantidad");
      setInputValue("");
    } else {
      addToCart(producto);
    }
  };

  const handleWeightConfirm = () => {
    if (!selectedProduct || !inputValue) return;

    const cantidad = calculateQuantity(selectedProduct as Product, inputType, inputValue);

    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    if (cantidad > (selectedProduct.stockActual || 0)) {
      alert(
        `Stock insuficiente. Disponible: ${selectedProduct.stockActual} ${selectedProduct.unidadMedidaNombre}`
      );
      return;
    }

    addToCart(selectedProduct as Product, cantidad);
    setSelectedProduct(null);
    setInputValue("");
  };

  const incrementQuantity = (id: number, stock: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const increment = isWeightVolumeSale(item.unidadMedidaNombre) ? 0.1 : 1;
    const newQuantity = Math.min(item.cantidad + increment, stock);

    updateQuantity(id, newQuantity);
  };

  const decrementQuantity = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const isWeight = isWeightVolumeSale(item.unidadMedidaNombre);
    const decrement = isWeight ? 0.1 : 1;
    const minValue = isWeight ? 0.001 : 1;
    const newQuantity = Math.max(minValue, item.cantidad - decrement);

    updateQuantity(id, newQuantity);
  };

  const removeFromCart = (id: number) => {
    removeFromCartStore(id);
  };

  const clearCart = () => {
    clearCartStore();
  };

  const formatQuantity = (producto: any, cantidad: number) => {
    if (isWeightVolumeSale(producto.unidadMedidaNombre)) {
      const subUnit = getSubUnit(producto.unidadMedidaNombre);
      if (cantidad < 1) {
        return `${(cantidad * 1000).toFixed(0)} ${subUnit}`;
      } else {
        return `${cantidad.toFixed(3)} ${producto.unidadMedidaNombre}`;
      }
    } else {
      return `${cantidad} ${producto.unidadMedidaNombre}`;
    }
  };

  const getPreview = () => {
    if (!selectedProduct || !inputValue) return null;

    const cantidad = calculateQuantity(selectedProduct, inputType, inputValue);
    const monto = cantidad * Number(selectedProduct.precioVenta);

    return {
      cantidad,
      monto,
      cantidadFormateada: formatQuantity(selectedProduct, cantidad),
    };
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.precioVenta) * item.cantidad,
    0
  );

  const total = subtotal;

  const handleFinishSale = () => {
    setShowModal(true);
  };

  const handleDrawCuentaCorriente = () => {
    setShowCuentaCorrienteModal(true);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Punto de Venta</h1>
          <p className="text-sm text-gray-600 mt-1">Registra una nueva venta</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShoppingCart size={18} />
            <span>{cartItems.length} productos en carrito</span>
          </div>

          {/* Toggle Auto Space */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Auto Space</label>
            <button
              onClick={() => {
                setAutoSpaceEnabled((v) => {
                  const nv = !v;
                  localStorage.setItem('pos.autoSpace', String(nv));
                  return nv;
                });
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${autoSpaceEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              title={autoSpaceEnabled ? 'Auto-space activado' : 'Auto-space desactivado'}
            >
              {autoSpaceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          {/* Barra de búsqueda */}
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {/* Lista de Productos */}
          <div className="bg-white rounded-lg border border-gray-500/30 flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-500/30">
              <h3 className="font-semibold text-gray-800">Productos Disponibles</h3>
              <p className="text-xs text-gray-600 mt-1">
                {searchTerm
                  ? `${filteredProducts.length} resultados para "${searchTerm}"`
                  : "Escribe para buscar productos o escanea un código de barras"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!searchTerm ? (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Busca productos por nombre o código</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Escribe en el campo de búsqueda o escanea un código de barras
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No se encontraron productos</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredProducts.map((producto: any) => {
                    const isSelected = selectedProduct?.id === producto.id;
                    const productPreview = isSelected ? getPreview() : null;

                    return (
                      <ProductCard
                        key={producto.id}
                        producto={producto}
                        isSelected={isSelected}
                        isWeightVolume={isWeightVolumeSale(producto.unidadMedidaNombre)}
                        inputType={inputType}
                        inputValue={inputValue}
                        productPreview={productPreview}
                        onProductClick={handleProductClick}
                        onInputTypeChange={setInputType}
                        onInputValueChange={setInputValue}
                        onCancel={() => setSelectedProduct(null)}
                        onConfirm={handleWeightConfirm}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Carrito */}
        <CartItems
          cartItems={cartItems}
          clearCart={clearCart}
          removeFromCart={removeFromCart}
          decrementQuantity={decrementQuantity}
          incrementQuantity={incrementQuantity}
          formatQuantity={formatQuantity}
          subtotal={subtotal}
          total={total}
          handleDrawCuentaCorriente={handleDrawCuentaCorriente}
          handleFinishSale={handleFinishSale}
        />
      </div>

      {showModal && (
        <ModalSale
          cart={cartItems}
          setCart={() => {}}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      {showCuentaCorrienteModal && (
        <DrawerCliente
          open={showCuentaCorrienteModal}
          onClose={() => setShowCuentaCorrienteModal(false)}
          cart={cartItems}
        />
      )}
    </div>
  );
};

export default PointSale;