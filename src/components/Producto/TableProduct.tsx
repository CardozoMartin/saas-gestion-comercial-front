import { ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { useProductEdite } from "../../store/useProductEdite";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";

interface TableProductProps {
  Productos: any[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  params?: any;
}

const TableProduct = ({
  Productos,
  isLoading,
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  params,
}: TableProductProps) => {
  const { setProductEdite: setGlobalProductEdite } = useProductEdite();
  const navigate = useNavigate();
  const taleProductos = Productos || [];
  
  const { putChangeProductStatus } = useProduct(params);

  const handleEditClick = (product: any) => {
    Swal.fire({
      title: `¿Desea editar este producto ${product.nombre}?`,
      text: "Estás a punto de editar un producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar!",
    }).then((result) => {
      if (result.isConfirmed) {
        setGlobalProductEdite(product);
        navigate("/dashboard/agregar");
      }
    });
  };

  const handleViewProduct = (product: any) => {
    console.log("Ver producto:", product);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`min-w-[2.5rem] h-10 px-3 rounded-md font-medium transition ${
            currentPage === i
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };


const formatStock = (cantidad: number | undefined | null, unidadMedidaId: number | undefined): string => {
  const cantidadSegura = cantidad || 0;
  
  if (!unidadMedidaId) return `${cantidadSegura} Un`;
  
  const unidades: Record<number, { nombre: string; usarDecimales: boolean }> = {
    1: { nombre: "Un", usarDecimales: false },
    2: { nombre: "kg", usarDecimales: true },
    4: { nombre: "Lt", usarDecimales: true },
  };

  const unidad = unidades[unidadMedidaId] || { nombre: "Un", usarDecimales: false };
  
  if (unidad.usarDecimales) {
    return `${Number(cantidadSegura).toFixed(3)} ${unidad.nombre}`;
  }
  
  return `${Math.floor(cantidadSegura)} ${unidad.nombre}`;
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

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <>
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
              {taleProductos.length === 0 && (
                <tr className="border-b border-gray-300/70">
                  <td
                    colSpan={7}
                    className="px-3 py-3 text-center text-gray-800/80 font-medium"
                  >
                    No se encontraron productos.
                  </td>
                </tr>
              )}
              {taleProductos.map((product, index) => (
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

                  {/* ⭐ Stock con validación mejorada */}
                 <td className={`px-3 py-3 font-medium ${
  (product.stockActual?.cantidad || 0) > 10 
    ? "text-green-800/80" 
    : "text-red-600/80"
}`}>
  {formatStock(
    product.stockActual?.cantidad || 0,
    product.unidadMedida?.id
  )}
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
                        onClick={() => handleEditClick(product)}
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

                      {/* Botón Ver */}
                      <button
                        className="p-2 rounded-md hover:bg-blue-600/20 transition"
                        onClick={() => handleViewProduct(product)}
                        title="Ver detalles"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            stroke="#2563EB"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            stroke="#2563EB"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                    hasPrevPage
                      ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  {renderPageButtons()}
                </div>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                    hasNextPage
                      ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TableProduct;