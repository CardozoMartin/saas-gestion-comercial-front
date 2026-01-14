import { useNavigate } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import { Table } from "lucide-react";
import TableCategory from "../components/Category/TableCategory";

const CategoriasPage = () => {
  const Navigate = useNavigate();

  const { AllCategories } = useCategory();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestión de Categorías
        </h2>
        <button
          onClick={() => Navigate("/dashboard/categorias/agregar")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
        >
          + Agregar Categoria
        </button>
      </div>
      <div className="bg-white border border-gray-500/30 rounded-md p-6">
        <p className="text-gray-600 mb-3 font-bold">
          Lista completa de categorias de productos
        </p>
        <div className="w-full  p-4 bg-white border border-gray-500/30 rounded-md">
          <div className="overflow-x-auto">
            <TableCategory AllCategories={AllCategories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriasPage;
