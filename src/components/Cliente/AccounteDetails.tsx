import { useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { useCliente } from "../../hooks/useCliente";
import { usePayment } from "../../hooks/usePayment";
import PaymentModal from "./PaymenteModal";
import { FileText } from "lucide-react";
const AccountDetails = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedVenta, setExpandedVenta] = useState<number | null>(null);

  const { clienteId } = location.state || {};
  const { useGetCuentaCorrienteCliente } = useCliente();
  const {
    data: cuentaCorriente,
    isLoading,
    isError,
  } = useGetCuentaCorrienteCliente(clienteId);

  const { postPayment, isPendingPay, isErrorPay } = usePayment();

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

  const {
    cliente,
    saldoActual,
    fechaProximoVencimiento,
    ventas,
  } = cuentaCorriente;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(amount));
  };

  const handlePaymentSubmit = (data: any) => {
    const paymentData = {
      clienteId: cliente.id,
      ...data,
    };

    postPayment(paymentData, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const toggleVentaDetails = (ventaId: number) => {
    setExpandedVenta(expandedVenta === ventaId ? null : ventaId);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header - Información del Cliente */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Cuenta Corriente - {cliente.nombre} {cliente.apellido}
          </h1>

          <button className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition cursor-pointer">
            <FileText size={22} />
            <span className="text-sm font-medium mt-1">Descargar PDF</span>
          </button>
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

            <div>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                onClick={() => setIsModalOpen(true)}
                disabled={Number(saldoActual) <= 0}
              >
                Realizar Pago
              </button>
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

      {/* Tabla de Ventas */}
      <div className="w-full p-4 bg-white border border-gray-500/30 rounded-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Historial de Ventas ({ventas?.length || 0})
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
                  Total
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
              {ventas && ventas.length > 0 ? (
                ventas.map((venta: any, index: number) => (
                  <Fragment key={venta.ventaId}>
                    {/* Fila principal de la venta */}
                    <tr className="border-b border-gray-300/50 hover:bg-gray-500/20 transition">
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        {venta.numeroVenta}
                      </td>
                      <td className="px-3 py-3 text-gray-800/80 font-medium">
                        {formatDate(venta.fechaVenta)}
                      </td>
                      <td className="px-3 py-3 text-gray-800/80 font-bold">
                        {formatCurrency(venta.total)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            venta.estado === "pendiente"
                              ? "text-yellow-600/80 bg-yellow-600/10"
                              : venta.estado === "pagada"
                                ? "text-green-600/80 bg-green-600/10"
                                : "text-gray-600/80 bg-gray-600/10"
                          }`}
                        >
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition font-medium"
                          onClick={() => toggleVentaDetails(venta.ventaId)}
                        >
                          {expandedVenta === venta.ventaId
                            ? "Ocultar Detalle"
                            : "Ver Detalle"}
                        </button>
                      </td>
                    </tr>

                    {/* Fila expandible con detalles de productos */}
                    {expandedVenta === venta.ventaId && venta.detalles && (
                      <tr className="bg-gray-500/10">
                        <td colSpan={6} className="px-3 py-4">
                          <div className="ml-8">
                            <h4 className="text-sm font-bold text-gray-800 mb-3">
                              Productos de la venta:
                            </h4>
                            <div className="bg-white border border-gray-300/50 rounded-md overflow-hidden">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gray-500/10 border-b border-gray-300/50">
                                    <th className="text-left px-3 py-2 text-gray-800/80 font-medium text-xs">
                                      Código
                                    </th>
                                    <th className="text-left px-3 py-2 text-gray-800/80 font-medium text-xs">
                                      Producto
                                    </th>
                                    <th className="text-left px-3 py-2 text-gray-800/80 font-medium text-xs">
                                      Cantidad
                                    </th>
                                    <th className="text-left px-3 py-2 text-gray-800/80 font-medium text-xs">
                                      Precio Unit.
                                    </th>
                                    <th className="text-left px-3 py-2 text-gray-800/80 font-medium text-xs">
                                      Subtotal
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {venta.detalles.map((detalle: any) => (
                                    <tr
                                      key={detalle.id}
                                      className="border-b border-gray-300/30 last:border-0"
                                    >
                                      <td className="px-3 py-2 text-gray-800/80">
                                        {detalle.producto?.codigo || "-"}
                                      </td>
                                      <td className="px-3 py-2 text-gray-800/80 font-medium">
                                        {detalle.producto?.nombre || "-"}
                                      </td>
                                      <td className="px-3 py-2 text-gray-800/80">
                                        {detalle.cantidad}{" "}
                                        {detalle.unidadMedida?.abreviatura ||
                                          ""}
                                      </td>
                                      <td className="px-3 py-2 text-gray-800/80">
                                        {formatCurrency(detalle.precioUnitario)}
                                      </td>
                                      <td className="px-3 py-2 text-gray-800/80 font-bold">
                                        {formatCurrency(detalle.subtotal)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-gray-500"
                  >
                    No hay ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen Total */}
        {ventas && ventas.length > 0 && (
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

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clienteId={cliente.id}
        saldoActual={saldoActual}
        isPendingPay={isPendingPay}
        isErrorPay={isErrorPay}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default AccountDetails;
