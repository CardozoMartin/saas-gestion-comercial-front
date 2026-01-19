import React, { useEffect, useState } from 'react'
import FormUsers from '../components/Users/FormUsers';
import TableUsers from '../components/Users/TableUsers';

const UsuariosPage = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="bg-white border border-gray-500/30 rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 ">Base de Clientes</h2>
      <p className="text-gray-600">Administra tu cartera de clientes.</p>
      <div className="justify-self-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium   ml-auto mb-4"
        >
          {showForm ? "Cerrar Formulario" : "Agregar Cliente"}
        </button>
      </div>
      {showForm ? <FormUsers /> : <TableUsers />}
    </div>
  )
}

export default UsuariosPage