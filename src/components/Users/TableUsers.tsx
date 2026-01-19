import React from "react";

const TableUsers = () => {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-300/70">
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            #
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Número Venta
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Fecha
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Descripción
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Monto
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Estado
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition">
          <td className="px-3 py-3 text-gray-800/80 font-medium"></td>
          <td className="px-3 py-3 text-gray-800/80 font-medium"></td>
          <td className="px-3 py-3 text-gray-800/80 font-medium"></td>
          <td className="px-3 py-3 text-gray-800/80"></td>
          <td className="px-3 py-3 text-gray-800/80 font-bold"></td>
          <td className="px-3 py-3"></td>
          <td className="px-3 py-3">
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition font-medium">
              Ver Detalle
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableUsers;
