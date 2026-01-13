import React from "react";
import StyledTable from "../../utils/Tables/Table";
import { Link } from "react-router-dom";


const Producto = () => {
  return (
    <div className="bg-white border border-gray-500/30 rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestión de Productos
        </h2>
        <Link to="/productos/agregar" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition">
          + Nuevo Producto
        </Link>
      </div>
        <StyledTable />
    </div>
  );
};

export default Producto;
