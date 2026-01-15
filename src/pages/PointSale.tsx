import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, X, DollarSign, CreditCard, Barcode, Scale } from 'lucide-react';

// Hook simulado - reemplazar con tu useProduct real
const useProduct = () => {
  const mockData = [
    { id: 1, nombre: "Arroz Largo Fino", codigo: "ALM001", precioVenta: "950", stockActual: 50, unidadMedidaNombre: "Kilogramo", categoriaNombre: "Almacén" },
    { id: 2, nombre: "Queso", codigo: "ALM002", precioVenta: "1200", stockActual: 30, unidadMedidaNombre: "Kilogramo", categoriaNombre: "Lácteos" },
    { id: 3, nombre: "Coca Cola", codigo: "BEB001", precioVenta: "500", stockActual: 200, unidadMedidaNombre: "Unidad", categoriaNombre: "Bebidas" },
    { id: 4, nombre: "Vino Tinto", codigo: "ALM004", precioVenta: "1500", stockActual: 45, unidadMedidaNombre: "Litro", categoriaNombre: "Bebidas" },
    { id: 5, nombre: "Soga", codigo: "FER001", precioVenta: "200", stockActual: 100, unidadMedidaNombre: "Metro", categoriaNombre: "Ferretería" },
  ];
  return { allProductsData: mockData };
};

const PointSale = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputType, setInputType] = useState('cantidad'); // 'cantidad' o 'monto'
  const [inputValue, setInputValue] = useState('');
  
  const { allProductsData } = useProduct();

  // Determinar si un producto se vende por peso/volumen
  const isWeightVolumeSale = (unidadMedida) => {
    return ['Kilogramo', 'Litro', 'Metro'].includes(unidadMedida);
  };

  // Convertir a unidad menor
  const getSubUnit = (unidadMedida) => {
    const map = {
      'Kilogramo': 'gramos',
      'Litro': 'ml',
      'Metro': 'cm'
    };
    return map[unidadMedida] || unidadMedida;
  };

  // Calcular cantidad según el tipo de input
  const calculateQuantity = (producto, type, value) => {
    const numValue = parseFloat(value) || 0;
    
    if (type === 'cantidad') {
      return numValue;
    } else {
      // Monto / precio = cantidad
      return numValue / parseFloat(producto.precioVenta);
    }
  };

  // Filtrar productos
  const filteredProducts = searchTerm.trim() 
    ? allProductsData?.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : [];

  // Agregar al carrito
  const addToCart = (producto, cantidadCustom = null) => {
    const cantidad = cantidadCustom !== null ? cantidadCustom : 1;
    const existingItem = cartItems.find(item => item.id === producto.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item  
      ));
    } else {
      setCartItems([...cartItems, { ...producto, cantidad }]);
    }
  };

  // Manejar click en producto
  const handleProductClick = (producto) => {
    if (isWeightVolumeSale(producto.unidadMedidaNombre)) {
      setSelectedProduct(producto);
      setInputType('cantidad');
      setInputValue('');
    } else {
      addToCart(producto);
    }
  };

  // Confirmar producto con peso/volumen
  const handleWeightConfirm = () => {
    if (!selectedProduct || !inputValue) return;
    
    const cantidad = calculateQuantity(selectedProduct, inputType, inputValue);
    
    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (cantidad > selectedProduct.stockActual) {
      alert(`Stock insuficiente. Disponible: ${selectedProduct.stockActual} ${selectedProduct.unidadMedidaNombre}`);
      return;
    }

    addToCart(selectedProduct, cantidad);
    setSelectedProduct(null);
    setInputValue('');
  };

  // Incrementar cantidad
  const incrementQuantity = (id, stock) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.cantidad < stock
        ? { ...item, cantidad: item.cantidad + (isWeightVolumeSale(item.unidadMedidaNombre) ? 0.1 : 1) }
        : item
    ));
  };

  // Decrementar cantidad
  const decrementQuantity = (id) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const isWeight = isWeightVolumeSale(item.unidadMedidaNombre);
        const decrement = isWeight ? 0.1 : 1;
        const minValue = isWeight ? 0.001 : 1;
        return { ...item, cantidad: Math.max(minValue, item.cantidad - decrement) };
      }
      return item;
    }));
  };

  // Eliminar del carrito
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Formatear cantidad para mostrar
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

  // Calcular vista previa
  const getPreview = () => {
    if (!selectedProduct || !inputValue) return null;
    
    const cantidad = calculateQuantity(selectedProduct, inputType, inputValue);
    const monto = cantidad * parseFloat(selectedProduct.precioVenta);
    
    return {
      cantidad,
      monto,
      cantidadFormateada: formatQuantity(selectedProduct, cantidad)
    };
  };

  const preview = getPreview();

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.precioVenta) * item.cantidad), 0);
  const impuesto = subtotal * 0.16;
  const total = subtotal + impuesto;

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
          <div className="bg-white rounded-lg border border-gray-500/30 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o código del producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
                autoFocus
              />
            </div>
          </div>



          {/* Lista de Productos */}
          <div className="bg-white rounded-lg border border-gray-500/30 flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-500/30">
              <h3 className="font-semibold text-gray-800">Productos Disponibles</h3>
              <p className="text-xs text-gray-600 mt-1">
                {searchTerm 
                  ? `${filteredProducts.length} resultados para "${searchTerm}"` 
                  : 'Escribe para buscar productos'}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {!searchTerm ? (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Busca productos por nombre o código</p>
                  <p className="text-gray-400 text-sm mt-1">Escribe en el campo de búsqueda para comenzar</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No se encontraron productos</p>
                  <p className="text-gray-400 text-sm mt-1">Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredProducts.map(producto => {
                    const isSelected = selectedProduct?.id === producto.id;
                    const productPreview = isSelected ? getPreview() : null;
                    
                    return (
                      <div
                        key={producto.id}
                        className={`border rounded-lg p-3 transition ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{producto.nombre}</h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Barcode size={12} />
                              {producto.codigo}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {producto.categoriaNombre}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">${producto.precioVenta}</p>
                            <p className="text-xs text-gray-500">/ {producto.unidadMedidaNombre}</p>
                            <p className={`text-xs ${producto.stockActual > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                              Stock: {producto.stockActual}
                            </p>
                          </div>
                        </div>
                        
                        {/* Formulario expandido para productos por peso/volumen */}
                        {isSelected && isWeightVolumeSale(producto.unidadMedidaNombre) ? (
                          <div className="space-y-2 mt-3 pt-3 border-t border-blue-200">
                            {/* Selector de tipo */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => setInputType('cantidad')}
                                className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition ${
                                  inputType === 'cantidad' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                              >
                                <Scale size={12} className="inline mr-1" />
                                Cantidad
                              </button>
                              <button
                                onClick={() => setInputType('monto')}
                                className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition ${
                                  inputType === 'monto' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                              >
                                <DollarSign size={12} className="inline mr-1" />
                                Monto
                              </button>
                            </div>

                            {/* Input */}
                            <input
                              type="number"
                              step="0.001"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder={inputType === 'cantidad' ? '0.500' : '200'}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              autoFocus
                            />

                            {/* Vista previa */}
                            {productPreview && (
                              <div className="bg-white border border-blue-300 rounded-lg p-2">
                                <p className="text-xs text-gray-600">Vista previa:</p>
                                <p className="text-sm font-semibold text-blue-900">{productPreview.cantidadFormateada}</p>
                                <p className="text-base font-bold text-blue-900">
                                  Total: ${productPreview.monto.toFixed(2)}
                                </p>
                              </div>
                            )}

                            {/* Botones */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedProduct(null)}
                                className="flex-1 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={handleWeightConfirm}
                                disabled={!inputValue || parseFloat(inputValue) <= 0}
                                className="flex-1 py-2 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition"
                              >
                                Agregar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(producto);
                            }}
                            disabled={producto.stockActual === 0}
                            className="w-full mt-2 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition flex items-center justify-center gap-2"
                          >
                            {isWeightVolumeSale(producto.unidadMedidaNombre) ? (
                              <>
                                <Scale size={16} />
                                Pesar/Medir
                              </>
                            ) : (
                              <>
                                <Plus size={16} />
                                Agregar
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Carrito */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-lg border border-gray-500/30 flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-500/30 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Carrito de Compra</h3>
                <p className="text-xs text-gray-600 mt-1">{cartItems.length} productos</p>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">El carrito está vacío</p>
                  <p className="text-gray-400 text-xs mt-1">Agrega productos para continuar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{item.nombre}</h4>
                          <p className="text-xs text-gray-500">
                            ${item.precioVenta} / {item.unidadMedidaNombre}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {formatQuantity(item, item.cantidad)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-50 rounded transition"
                        >
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementQuantity(item.id)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-semibold px-2">
                            {item.cantidad.toFixed(3)}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item.id, item.stockActual)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-gray-800">
                          ${(parseFloat(item.precioVenta) * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-500/30 p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Impuesto (16%):</span>
                    <span>${impuesto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <CreditCard size={20} />
                  Procesar Venta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointSale;