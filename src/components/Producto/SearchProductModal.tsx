import { useState } from "react";
import { Search, X, Edit, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { useProductEdite } from "../../store/useProductEdite";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { obtenerProductoPorNombreOCodigoFn } from "../../api/products/apiProducts";

interface SearchProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchProductModal = ({ isOpen, onClose }: SearchProductModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const { setProductEdite } = useProductEdite();
  const navigate = useNavigate();

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

  // ✅ SIMPLIFICADO: Ya no necesita mutation, el producto ya está completo
  const handleEditProduct = (product: any) => {
    console.log("📝 Producto a editar:", product);
    
    Swal.fire({
      title: `¿Desea editar ${product.nombre}?`,
      text: "Serás redirigido al formulario de edición.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ El producto ya tiene todos los datos necesarios
        setProductEdite(product);
        navigate("/dashboard/agregar");
        onClose();
      }
    });
  };

  const handleViewProduct = (product: any) => {
    Swal.fire({
      title: product.nombre,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Código:</strong> ${product.codigo}</p>
          <p><strong>Categoría:</strong> ${product.categoria?.nombre || "Sin categoría"}</p>
          <p><strong>Stock:</strong> ${product.stockActual?.cantidad || 0} ${product.unidadMedida?.nombre || ""}</p>
          <p><strong>Precio Venta:</strong> $${product.precioVenta}</p>
          <p><strong>Precio Costo:</strong> $${product.precioCosto}</p>
          <p><strong>Estado:</strong> ${product.activo ? "Activo" : "Inactivo"}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Cerrar",
    });
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
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

        {/* Results */}
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
            <div className="space-y-3">
              {productos.map((product: any) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {product.nombre}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {product.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Código:</span> {product.codigo}
                        </div>
                        <div>
                          <span className="font-medium">Categoría:</span>{" "}
                          {product.categoria?.nombre || "Sin categoría"}
                        </div>
                        <div>
                          <span className="font-medium">Stock:</span>{" "}
                          <span className={
                            (product.stockActual?.cantidad || 0) > 10
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }>
                            {getUnidadMedida(product.unidadMedida)}{" "}
                            {product.stockActual?.cantidad || 0}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Precio:</span> ${product.precioVenta}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 rounded-md hover:bg-blue-100 transition"
                        title="Editar producto"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-2 rounded-md hover:bg-gray-200 transition"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProductModal;