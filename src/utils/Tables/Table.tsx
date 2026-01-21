
import { useLocation } from "react-router-dom";
import { useCliente } from "../../hooks/useCliente";

const AccountDetails = () => {
  const location = useLocation();
  const { clienteId } = location.state || {};
  const { useGetCuentaCorrienteCliente } = useCliente();
  const { data: cuentaCorriente, isLoading, isError } = useGetCuentaCorrienteCliente(clienteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando cuenta corriente...</div>
      </div>
    );
  }

  if (isError || !cuentaCorriente) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error al cargar la cuenta corriente</div>
      </div>
    );
  }

  const { cliente, saldoActual, condicionPago, fechaProximoVencimiento, movimientos } = cuentaCorriente;

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear moneda
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(Number(amount));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header - Información del Cliente */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Cuenta Corriente - {cliente.nombre} {cliente.apellido}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Razón Social</p>
            <p className="text-lg font-medium text-gray-800">{cliente.razonSocial}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Condición de Pago</p>
            <p className="text-lg font-medium text-gray-800">
              {condicionPago?.nombre} ({condicionPago?.dias} días)
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Límite de Crédito</p>
            <p className="text-lg font-medium text-gray-800">
              {formatCurrency(cliente.limiteCredito)}
            </p>
          </div>
        </div>

        {/* Saldo Actual - Destacado */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Saldo Pendiente</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(saldoActual)}
              </p>
            </div>
            
            {fechaProximoVencimiento && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Próximo Vencimiento</p>
                <p className="text-lg font-medium text-gray-800">
                  {formatDate(fechaProximoVencimiento)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Movimientos/Ventas */}
      <div className="w-full p-4 bg-white border border-gray-500/30 rounded-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Historial de Ventas ({movimientos?.length || 0})
        </h2>
        
        <div className="overflow-x-auto">
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
              {movimientos && movimientos.length > 0 ? (
                movimientos.map((movimiento: any, index: number) => (
                  <tr
                    key={movimiento.id}
                    className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition"
                  >
                    <td className="px-3 py-3 text-gray-800/80 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 text-gray-800/80 font-medium">
                      {movimiento.venta?.numeroVenta || '-'}
                    </td>
                    <td className="px-3 py-3 text-gray-800/80 font-medium">
                      {formatDate(movimiento.fechaMovimiento)}
                    </td>
                    <td className="px-3 py-3 text-gray-800/80">
                      {movimiento.descripcion}
                    </td>
                    <td className="px-3 py-3 text-gray-800/80 font-bold">
                      {formatCurrency(movimiento.monto)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          movimiento.venta?.estado === 'pendiente'
                            ? 'text-yellow-600/80 bg-yellow-600/10'
                            : movimiento.venta?.estado === 'pagada'
                            ? 'text-green-600/80 bg-green-600/10'
                            : 'text-gray-600/80 bg-gray-600/10'
                        }`}
                      >
                        {movimiento.venta?.estado || 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button 
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition font-medium"
                        onClick={() => {
                          // Aquí puedes navegar a detalles de la venta específica
                          console.log('Ver detalles de venta:', movimiento.venta?.id);
                        }}
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                    No hay movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen Total */}
        {movimientos && movimientos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-300/50 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Adeudado</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(saldoActual)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;