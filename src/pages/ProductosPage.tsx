import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import TableProduct from "../components/Producto/TableProduct";

const ProductosPage = () => {
  const Navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { 
    productos, 
    totalPages, 
    hasNextPage, 
    hasPrevPage,
    isLoading 
  } = useProduct({ page, limit });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestión de Productos
        </h2>
        <button
          onClick={() => Navigate("/dashboard/agregar")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
        >
          + Agregar Producto
        </button>
      </div>
      <div className="bg-white border border-gray-500/30 rounded-md p-6">
        <p className="text-gray-600 mb-3 font-bold">
          Lista completa de productos del inventario.
        </p>
        <div className="w-full  p-4 bg-white border border-gray-500/30 rounded-md">
          <div className="overflow-x-auto">
           <TableProduct 
              Productos={productos}
              isLoading={isLoading}
              currentPage={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={setPage}
           />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosPage;
