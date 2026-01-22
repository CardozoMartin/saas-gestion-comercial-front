import { useState } from "react";
import { Search, X } from "lucide-react";
import Swal from "sweetalert2";
import { useProductEdite } from "../../store/useProductEdite";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { obtenerProductoPorNombreOCodigoFn } from "../../api/products/apiProducts";
import { useProduct } from "../../hooks/useProduct";

interface SearchProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchProductModal = ({ isOpen, onClose }: SearchProductModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const { setProductEdite } = useProductEdite();
  const navigate = useNavigate();
  const { putChangeProductStatus } = useProduct();

  // Query para buscar productos - obtiene datos completos
  const { data: searchResults, isLoading, isError } = useQuery({
    queryKey: ["productSearch", activeSearch],
    queryFn: () => obtenerProductoPorNombreOCodigoFn(activeSearch),
    enabled: !!activeSearch && activeSearch.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      setActiveSearch(searchTerm.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
  };

  const handleEditProduct = (product: any) => {
    Swal.fire({
      title: `¿Desea editar ${product.nombre}?`,
      text: "Serás redirigido al formulario de edición.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setProductEdite(product);
        navigate("/dashboard/agregar");
        onClose();
      }
    });
  };

  const handleChangeStatusProduct = async (id: number) => {
    const result = await Swal.fire({
      title: `¿Desea cambiar el estado de este producto?`,
      text: "Esta acción activará o desactivará el producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await putChangeProductStatus(id);
        
        Swal.fire({
          title: "¡Actualizado!",
          text: "El estado del producto ha sido cambiado.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo cambiar el estado del producto.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const getUnidadMedida = (unidadMedida: any): string => {
    if (!unidadMedida?.id) return "Un";
    const unidades: Record<number, string> = {
      1: "Un",
      2: "Kg",
      4: "Lt",
    };
    return unidades[unidadMedida.id] || "Un";
  };

  if (!isOpen) return null;

  const productos = searchResults?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Buscar Productos
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o código..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                autoFocus
              />
              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-md transition"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium"
            >
              Buscar
            </button>
          </form>

          {activeSearch && (
            <p className="mt-3 text-sm text-gray-600">
              Resultados para: <span className="font-semibold">"{activeSearch}"</span>
              {!isLoading && (
                <span className="ml-2">
                  ({productos.length} {productos.length === 1 ? "resultado" : "resultados"})
                </span>
              )}
            </p>
          )}
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-600">
              <p>Error al buscar productos. Intenta nuevamente.</p>
            </div>
          ) : !activeSearch ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Ingresa un término de búsqueda para comenzar</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No se encontraron productos con "{activeSearch}"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300/70">
                    <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                      ID
                    </th>
                    <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                      Nombre
                    </th>
                    <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                      Categoría
                    </th>
                    <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                      Stock
                    </th>
                    <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                      Precio Venta
                    </th>
                    <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                      Precio Costo
                    </th>
                    <th className="text-left px-10 py-3 text-gray-800/80 font-medium">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((product: any, index: number) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-300/70 hover:bg-gray-100/50"
                    >
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        {product.nombre}
                      </td>
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        {product.categoria?.nombre || "Sin categoría"}
                      </td>
                      <td className={`px-3 py-3 font-medium ${
                        (product.stockActual?.cantidad || 0) > 10 
                          ? "text-green-800/80" 
                          : "text-red-600/80"
                      }`}>
                        {getUnidadMedida(product.unidadMedida)}{" "}
                        {product.stockActual?.cantidad || 0}
                      </td>
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        $ {product.precioVenta || 0}
                      </td>
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        $ {product.precioCosto || 0}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {/* Botón Editar */}
                          <button
                            className="p-2 rounded-md hover:bg-gray-500/20 transition"
                            onClick={() => handleEditProduct(product)}
                            title="Editar producto"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.672 6.763 5.58 15.854l-.166 2.995 2.995-.166L17.5 9.59m-2.828-2.828 1.348-1.349a2 2 0 1 1 2.829 2.829L17.5 9.59m-2.828-2.828L17.5 9.591"
                                stroke="#070707"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                          {/* Switch con animación */}
                          <button
                            onClick={() => handleChangeStatusProduct(product.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                              product.activo
                                ? "bg-gray-800/80 hover:bg-gray-800"
                                : "bg-gray-300/70 hover:bg-gray-400/70"
                            }`}
                            title={
                              product.activo
                                ? "Desactivar producto"
                                : "Activar producto"
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                product.activo ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProductModal;