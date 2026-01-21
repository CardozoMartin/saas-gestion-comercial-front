import React, { useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import Swal from 'sweetalert2';

const PageUpdateStock = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [stockInputs, setStockInputs] = useState({});

  // Hook para buscar productos
  const { useGetProductsBySearch, usePatchUpdateProductStock } = useProduct();
  const { data, isLoading } = useGetProductsBySearch(searchTerm);
  const { mutateAsync: patchUpdateProductStock, isPending } = usePatchUpdateProductStock();

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleEditStock = (id, currentStock) => {
    setEditingId(id);
    setStockInputs({ ...stockInputs, [id]: 0 }); // Empieza en 0 para incrementar
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setStockInputs({});
  };

  const handleSaveStock = async (id) => {
    const cantidadAIncrementar = Number(stockInputs[id]) || 0;
    
    if (cantidadAIncrementar === 0) {
      alert('Ingresa una cantidad diferente de 0');
      return;
    }

    try {
        Swal.fire({
            title: '¿Confirmar actualización de stock?',
            text: `Se sumará ${cantidadAIncrementar} unidades al stock del producto.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6', 
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar stock'
        }).then( async (result) => {
            if (result.isConfirmed) {
                await patchUpdateProductStock({ 
        id: id, 
        newStock: cantidadAIncrementar 
      });
                Swal.fire(
                    '¡Stock actualizado!',
                    'El stock del producto ha sido actualizado exitosamente.',
                    'success'
                );
            }
        });
     
      
      setEditingId(null);
      setStockInputs({});
      
      // Refrescar búsqueda para ver el stock actualizado
      setSearchTerm('');
      setTimeout(() => setSearchTerm(inputValue), 100);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      alert('Error al actualizar el stock');
    }
  };

  const handleStockChange = (id, value) => {
    setStockInputs({ ...stockInputs, [id]: value });
  };

  // Obtener productos del response del backend
  const productos = data?.data || [];
  const productosCount = data?.count || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Actualizar Stock
          </h2>
          <p className="text-sm text-gray-600/80">
            Busca productos por nombre o código y actualiza su stock
          </p>
        </div>

        {/* Buscador */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <path
                d="M8.25 14.25a6 6 0 1 0 0-12 6 6 0 0 0 0 12M15.75 15.75l-3.262-3.262"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar por nombre o código..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isLoading || !inputValue}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando...
              </>
            ) : (
              'Buscar'
            )}
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Productos Encontrados
          </h3>
          <p className="text-sm text-gray-600/80">
            {searchTerm && !isLoading && (
              <>
                {productosCount} {productosCount === 1 ? 'producto encontrado' : 'productos encontrados'}
              </>
            )}
            {!searchTerm && 'Busca un producto para ver resultados'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300/70">
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Código
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Producto
                </th>
                <th className="text-center px-3 py-3 text-gray-800/80 font-medium">
                  Stock Actual
                </th>
                <th className="text-center px-3 py-3 text-gray-800/80 font-medium">
                  Cantidad a Sumar
                </th>
                <th className="text-right px-3 py-3 text-gray-800/80 font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {!searchTerm || isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-gray-600/80"
                  >
                    {isLoading ? 'Buscando productos...' : 'Busca un producto para actualizar su stock'}
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-gray-600/80"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr
                    key={producto.id}
                    className="border-b border-gray-300/40 last:border-0 hover:bg-gray-500/5 transition"
                  >
                    <td className="px-3 py-4 text-gray-800/80 font-medium">
                      {producto.codigo}
                    </td>
                    <td className="px-3 py-4 text-gray-800">
                      {producto.nombre}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        producto.stock <= 10 
                          ? 'bg-red-100 text-red-800' 
                          : producto.stock <= 30 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {producto.stock} unidades
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      {editingId === producto.id ? (
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number"
                            value={stockInputs[producto.id] || ''}
                            onChange={(e) => handleStockChange(producto.id, e.target.value)}
                            placeholder="0"
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          />
                          <span className="text-xs text-gray-500">
                            {stockInputs[producto.id] ? 
                              `Nuevo: ${producto.stock + Number(stockInputs[producto.id])}` 
                              : 'Ingresa cantidad'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-right">
                      {editingId === producto.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveStock(producto.id)}
                            disabled={isPending}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            {isPending ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isPending}
                            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditStock(producto.id, producto.stock)}
                          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          Actualizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info adicional */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-gray-600/80">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334M8 5.333V8m0 2.667h.007"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Los cambios de stock se sumarán al stock actual del producto</span>
        </div>
      </div>
    </div>
  );
};

export default PageUpdateStock;