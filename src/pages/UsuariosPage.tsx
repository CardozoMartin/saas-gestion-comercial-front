import { useState } from 'react'
import FormUsers from '../components/Users/FormUsers';
import TableUsers from '../components/Users/TableUsers';
import { useUsers } from '../hooks/useUsers';

const UsuariosPage = () => {
  const [showForm, setShowForm] = useState(false);

  //hook para obtener todos los usuarios
  const { useGetUsers } = useUsers();
  const { data: usersData } = useGetUsers();
  console.log("Usuarios obtenidos:", usersData);
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
      {showForm ? <FormUsers /> : <TableUsers users={usersData} />}
    </div>
  )
}

export default UsuariosPage