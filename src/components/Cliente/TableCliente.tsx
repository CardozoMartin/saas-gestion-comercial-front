import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TableCliente = ({ clientes }) => {
    const navigate = useNavigate()
    const handleDetailAccount = (clienteId: number) => {
        console.log(clienteId,"clienteId")
        Swal.fire({
            title: '¿Ver detalles de la cuenta corriente?',
            text: "Serás redirigido a los detalles de la cuenta corriente del cliente.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ir a detalles'
        }).then((result) => {
            if (result.isConfirmed) {

        navigate('/dashboard/account-details', { state: { clienteId } });
    }
        })
    }


  return (
    <div className="w-full  p-4 bg-white border border-gray-500/30 rounded-md">
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
                Direccion
              </th>
              <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                Email
              </th>
              <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                Telefono
              </th>
              <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clientes &&
              clientes.map((cliente, index) => (
                <tr key={index} className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition cursor-pointer">
                  <td className="px-3 py-3 text-gray-800/80 font-medium">{index}</td>
                   <td className="px-3 py-3 text-gray-800/80 font-medium">{cliente.nombre}{" "}{cliente.apellido}</td>
                   <td className="px-3 py-3 text-gray-800/80 font-medium">{cliente.direccion}</td>
                     <td className="px-3 py-3 text-gray-800/80 font-medium">{cliente.email}</td>
                     <td className="px-3 py-3 text-gray-800/80 font-medium">{cliente.telefono}</td> 
                        <td className="px-3 py-3">
                    <button className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium mr-2">{cliente.activo ? "Activo" : "Inactivo"}</button>
                    <button onClick={() => handleDetailAccount(cliente.id)} className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">Ver Cuenta</button>
                  </td>

                </tr>
                
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCliente;
