import React from 'react'
import { useBox } from '../hooks/useBox';
import { useSession } from '../store/useSession';

const VentasPage = () => {
  const { user } = useSession()
  const { useBoxDetailByUser } = useBox();
  const { data: boxDetails, isLoading } = useBoxDetailByUser(user?.userId || 0);
 
  console.log("Box Details in VentasPage:", boxDetails);

  // Si no hay datos o está cargando
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-500/30 rounded-md p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600/80">Cargando ventas...</span>
          </div>
        </div>
      </div>
    );
  }

  const ventas = boxDetails?.data?.ventas || [];

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Historial de Ventas</h2>
          <p className="text-sm text-gray-600/80">Vista detallada de todas las ventas realizadas en la caja actual.</p>
        </div>
        
        {/* Resumen superior - NUEVA VERSIÓN */}
        {boxDetails?.data?.resumen && (
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-md p-5 mb-6">
            <div className="grid grid-cols-3 gap-8">
              {/* Columna 1: Total General */}
              <div className="border-r border-gray-300/50 pr-8">
                <div className="mb-4">
                  <p className="text-xs text-gray-600/80 font-medium mb-1">Total de Ventas</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${boxDetails.data.resumen.totalVentas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600/80">
                  <span className="w-2 h-2 rounded-full bg-gray-800"></span>
                  <span>{boxDetails.data.resumen.cantidadVentas} ventas registradas</span>
                </div>
              </div>

              {/* Columna 2: Desglose por tipo de pago */}
              <div className="border-r border-gray-300/50 pr-8">
                <p className="text-xs text-gray-600/80 font-medium mb-3">Desglose por Tipo de Pago</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600/80"></span>
                      <span className="text-sm text-gray-800/80">Contado</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${boxDetails.data.resumen.totalEfectivo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600/80"></span>
                      <span className="text-sm text-gray-800/80">Transferencia</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${boxDetails.data.resumen.totalTransferencias.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-600/80"></span>
                      <span className="text-sm text-gray-800/80">Cuenta Corriente</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${boxDetails.data.resumen.ventasCuentaCorriente.total?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Columna 3: Estadísticas adicionales */}
              <div>
                <p className="text-xs text-gray-600/80 font-medium mb-3">Estadísticas</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600/80">Productos vendidos</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {boxDetails.data.resumen.cantidadProductosVendidos} items
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600/80">Monto esperado en caja</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ${boxDetails.data.resumen.montoEsperado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de ventas */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300/70">
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Nº Venta
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Fecha
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Cliente
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Tipo
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Productos
                </th>
                <th className="text-right px-3 py-3 text-gray-800/80 font-medium">
                  Total
                </th>
                <th className="text-center px-3 py-3 text-gray-800/80 font-medium">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-600/80">
                    No hay ventas registradas en esta caja
                  </td>
                </tr>
              ) : (
                ventas.map((venta) => (
                  <tr
                    key={venta.id}
                    className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition cursor-pointer"
                  >
                    {/* Número de venta */}
                    <td className="px-3 py-3 text-gray-800/80 font-medium">
                      {venta.numeroVenta}
                    </td>

                    {/* Fecha */}
                    <td className="px-3 py-3 text-gray-800/80">
                      {new Date(venta.fechaVenta).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Cliente */}
                    <td className="px-3 py-3 text-gray-800/80">
                      {venta.cliente 
                        ? `${venta.cliente.nombre} ${venta.cliente.apellido || ''}`.trim()
                        : venta.cliente?.razonSocial || '-'
                      }
                    </td>

                    {/* Tipo de venta */}
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        venta.tipoVenta === 'contado' 
                          ? 'bg-green-500/20 text-green-900/80' 
                          : venta.tipoVenta === 'transferencia'
                          ? 'bg-blue-500/20 text-blue-900/80'
                          : 'bg-orange-500/20 text-orange-900/80'
                      }`}>
                        {venta.tipoVenta === 'contado' ? 'Contado' 
                          : venta.tipoVenta === 'transferencia' ? 'Transferencia'
                          : 'Cta. Cte.'}
                      </span>
                    </td>

                    {/* Productos (resumen) */}
                    <td className="px-3 py-3 text-gray-800/80">
                      <div className="flex flex-col gap-1">
                        {venta.detalles.map((detalle) => (
                          <div key={detalle.id} className="text-xs">
                            <span className="font-medium">{detalle.producto.nombre}</span>
                            {' '}
                            <span className="text-gray-600/80">
                              ({detalle.cantidad} {detalle.unidadMedida.abreviatura} × ${detalle.precioUnitario})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-3 py-3 text-right font-semibold text-gray-800">
                      ${parseFloat(venta.total).toLocaleString('es-AR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </td>

                    {/* Estado */}
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        venta.estado === 'pagada' 
                          ? 'bg-green-500/20 text-green-900/80' 
                          : venta.estado === 'pendiente'
                          ? 'bg-yellow-500/20 text-yellow-900/80'
                          : 'bg-red-500/20 text-red-900/80'
                      }`}>
                        {venta.estado === 'pagada' ? 'Pagada' 
                          : venta.estado === 'pendiente' ? 'Pendiente'
                          : 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totales al final */}
        {ventas.length > 0 && boxDetails?.data?.resumen && (
          <div className="mt-5 pt-4 border-t border-gray-300/50">
            <div className="flex justify-end gap-8 text-sm">
              <div>
                <span className="text-gray-600/80">Subtotal: </span>
                <span className="font-semibold text-gray-800">
                  ${ventas.reduce((sum, v) => sum + parseFloat(v.subtotal), 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-gray-600/80">Descuentos: </span>
                <span className="font-semibold text-red-600/80">
                  -${ventas.reduce((sum, v) => sum + parseFloat(v.descuento || 0), 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-gray-600/80">Total: </span>
                <span className="font-bold text-gray-800 text-base">
                  ${boxDetails.data.resumen.totalVentas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info footer */}
        <div className="mt-5 pt-4 border-t border-gray-300/50">
          <div className="flex items-center gap-2 text-xs text-gray-600/80">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334M8 5.333V8m0 2.667h.007"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              Mostrando ventas de la caja abierta el {boxDetails?.data?.caja?.fechaApertura && 
                new Date(boxDetails.data.caja.fechaApertura).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VentasPage