import { useState } from "react";
import FormCliente from "../components/Cliente/FormCliente";
import TableCliente from "../components/Cliente/TableCliente";
import { useCliente } from "../hooks/useCliente";

const ClientesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { useGetClientes } = useCliente();

  //funcion para manejar la obtencion de clientes
  const { data: clientes, isLoading, isError } = useGetClientes();

  if(isLoading){
    return <div>Cargando clientes...</div>
  }

  if(isError){
    return <div>Error al cargar los clientes.</div>
  }

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
      {showForm ? <FormCliente /> : <TableCliente clientes={clientes} />}
    </div>
  );
};

export default ClientesPage;
