import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../store/useCart";
import ModalSale from "../components/SalePoint/ModalSale";
import DrawerCliente from "../components/Drawer/DrawerCliente";
import { useShortcuts } from "../hooks/useShortcuts";
import CartItems from "../components/SalePoint/CartItems";
import SearchBar from "../components/SalePoint/SearchBar";
import ProductCard from "../components/SalePoint/ProductCard";

const PointSale = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputType, setInputType] = useState("cantidad");
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCuentaCorrienteModal, setShowCuentaCorrienteModal] = useState(false);

  const { allProductsData } = useProduct();
  const {
    cart,
    addToCart: addToCartStore,
    removeFromCart: removeFromCartStore,
    clearCart: clearCartStore,
    updateQuantity,
  } = useCart();

  const cartItems = cart;

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
      const searchInput = document.getElementById("search-product");
      searchInput?.focus();
      searchInput?.select();
    },
    f1: () => agregarProductoRapido("Coca Cola 2.25L"),
    f7: () => agregarProductoRapido("Cigarrillos"),
    f8: () => agregarProductoRapido("Pan"),
    f9: () => agregarProductoRapido("Leche"),
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

  const showNotification = (message, type = "success") => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const agregarProductoRapido = (nombreProducto) => {
    const producto = allProductsData?.find((p) =>
      p.nombre.toLowerCase().includes(nombreProducto.toLowerCase())
    );

    if (producto) {
      if (isWeightVolumeSale(producto.unidadMedidaNombre)) {
        setSelectedProduct(producto);
      } else {
        addToCart(producto);
        showNotification(`✅ ${producto.nombre} agregado`);
      }
    } else {
      showNotification(`❌ Producto "${nombreProducto}" no encontrado`, "error");
    }
  };

  const isWeightVolumeSale = (unidadMedida) => {
    return ["Kilogramo", "Litro", "Metro"].includes(unidadMedida);
  };

  const getSubUnit = (unidadMedida) => {
    const map = {
      Kilogramo: "gramos",
      Litro: "ml",
      Metro: "cm",
    };
    return map[unidadMedida] || unidadMedida;
  };

  const calculateQuantity = (producto, type, value) => {
    const numValue = parseFloat(value) || 0;
    if (type === "cantidad") {
      return numValue;
    } else {
      return numValue / parseFloat(producto.precioVenta);
    }
  };

  const filteredProducts = searchTerm.trim()
    ? allProductsData?.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : [];

  const addToCart = (producto, cantidadCustom = null) => {
    const cantidad = cantidadCustom !== null ? cantidadCustom : 1;

    addToCartStore({
      id: producto.id,
      nombre: producto.nombre,
      precioVenta: producto.precioVenta,
      cantidad: cantidad,
      unidadMedidaNombre: producto.unidadMedidaNombre,
      unidadMedidaId: producto.unidadMedidaId,
      stockActual: producto.stockActual,
      codigo: producto.codigo,
      categoriaNombre: producto.categoriaNombre,
    });
  };

  const handleProductClick = (producto) => {
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

    const cantidad = calculateQuantity(selectedProduct, inputType, inputValue);

    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    if (cantidad > selectedProduct.stockActual) {
      alert(
        `Stock insuficiente. Disponible: ${selectedProduct.stockActual} ${selectedProduct.unidadMedidaNombre}`
      );
      return;
    }

    addToCart(selectedProduct, cantidad);
    setSelectedProduct(null);
    setInputValue("");
  };

  const incrementQuantity = (id, stock) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const increment = isWeightVolumeSale(item.unidadMedidaNombre) ? 0.1 : 1;
    const newQuantity = Math.min(item.cantidad + increment, stock);

    updateQuantity(id, newQuantity);
  };

  const decrementQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const isWeight = isWeightVolumeSale(item.unidadMedidaNombre);
    const decrement = isWeight ? 0.1 : 1;
    const minValue = isWeight ? 0.001 : 1;
    const newQuantity = Math.max(minValue, item.cantidad - decrement);

    updateQuantity(id, newQuantity);
  };

  const removeFromCart = (id) => {
    removeFromCartStore(id);
  };

  const clearCart = () => {
    clearCartStore();
  };

  const formatQuantity = (producto, cantidad) => {
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
    const monto = cantidad * parseFloat(selectedProduct.precioVenta);

    return {
      cantidad,
      monto,
      cantidadFormateada: formatQuantity(selectedProduct, cantidad),
    };
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.precioVenta) * item.cantidad,
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShoppingCart size={18} />
          <span>{cartItems.length} productos en carrito</span>
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
                  : "Escribe para buscar productos"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!searchTerm ? (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Busca productos por nombre o código</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Escribe en el campo de búsqueda para comenzar
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
                  {filteredProducts.map((producto) => {
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
          setCart={() => {}}
        />
      )}
    </div>
  );
};

export default PointSale;