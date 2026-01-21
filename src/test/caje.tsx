import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBox } from "../hooks/useBox";
import Swal from "sweetalert2";
import { useSession } from "../store/useSession";

export default function CajaPage() {
  const { user } = useSession();
  const { 
    postOpenBox, 
    isPostingBox, 
    useBoxByUser,
    useBoxDetailByUser,
    closeBox
  } = useBox();
  
  const [mostrarFormularioCierre, setMostrarFormularioCierre] = useState(false);
  
  // ✅ PASO 1: Primero obtener solo el estado de la caja
  const { 
    data: responseData, 
    isLoading: isLoadingCaja, 
  } = useBoxByUser(Number(user?.userId ?? 0));

  const cajaAbierta = responseData?.data?.[0] || null;

  // ✅ PASO 2: Solo obtener detalles si hay caja abierta
 const { 
  data: boxDetails, 
  isLoading: isLoadingDetails 
} = useBoxDetailByUser(
  Number(user?.userId ?? 0),
  {
    enabled: !!cajaAbierta // Solo ejecutar si cajaAbierta existe
  }
);

  const ventas = boxDetails?.data?.ventas || [];
  const resumen = boxDetails?.data?.resumen;

  // Formulario de apertura
  const {
    handleSubmit: handleSubmitAbrir,
    register: registerAbrir,
    formState: { errors: errorsAbrir },
    reset: resetAbrir,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      montoInicial: ""
    },
  });

  // Formulario de cierre
  const {
    handleSubmit: handleSubmitCerrar,
    register: registerCerrar,
    formState: { errors: errorsCerrar },
    watch: watchCerrar,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      montoFinalContado: "",
      observaciones: ""
    },
  });

  // Calcular diferencia en tiempo real
  const montoFinalContado = Number(watchCerrar("montoFinalContado") || 0);
  const montoEsperado = resumen ? resumen.montoEsperado : 0;
  const diferencia = montoFinalContado - montoEsperado;

  const onSubmitAbrir = (data: any) => {
    Swal.fire({
      title: "¿Abrir Caja?",
      text: "¿Estás seguro de que deseas abrir la caja?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, abrirla!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        postOpenBox(
          ({
            montoInicial: parseFloat(data.montoInicial),
            usuarioId: Number(user?.userId ?? 0),
          } as any),
          {
            onSuccess: () => {
              Swal.fire({
                title: "¡Caja Abierta!",
                text: "La caja ha sido abierta correctamente.",
                icon: "success",
              });
              resetAbrir();
            },
            onError: (error: any) => {
              Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || "No se pudo abrir la caja",
                icon: "error",
              });
            }
          }
        );
      }
    });
  };

  const onSubmitCerrar = (data: any) => {
    Swal.fire({
      title: "¿Cerrar Caja?",
      html: `
        <div class="text-left text-sm space-y-2">
          <p><strong>Monto Final Contado:</strong> $${montoFinalContado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
          <p><strong>Monto Esperado:</strong> $${montoEsperado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
          <p class="${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}">
            <strong>Diferencia:</strong> $${diferencia.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrarla!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          montoFinalContado: parseFloat(data.montoFinalContado),
          observaciones: data.observaciones || null
        };

        closeBox(
          { 
            boxId: cajaAbierta.id, 
            data: payload 
          },
          {
            onSuccess: () => {
              Swal.fire({
                title: "¡Caja Cerrada!",
                text: "La caja ha sido cerrada correctamente.",
                icon: "success",
              }).then(() => {
                setMostrarFormularioCierre(false);
              });
            },
            onError: (error: any) => {
              Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || "No se pudo cerrar la caja",
                icon: "error",
              });
            }
          }
        );
      }
    });
  };

  // ✅ Loading solo de la verificación inicial de caja
  if (isLoadingCaja) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-500/30 rounded-md p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600/80">Verificando estado de caja...</span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // FORMULARIO DE APERTURA (Sin caja abierta)
  // ========================================
  if (!cajaAbierta) {
    return (
      <div className="p-6">
        <div className="max-w-lg">
          <div className="bg-white border border-gray-500/30 rounded-md p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Abrir Caja
              </h2>
              <p className="text-sm text-gray-600/80">
                Ingresa el monto inicial para comenzar las operaciones del día
              </p>
            </div>

            <form onSubmit={handleSubmitAbrir(onSubmitAbrir)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Monto Inicial
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                    $
                  </span>
                  <input
                    {...registerAbrir("montoInicial", {
                      required: "El monto inicial es obligatorio",
                      min: {
                        value: 0,
                        message: "El monto no puede ser negativo",
                      },
                    })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    disabled={isPostingBox}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300/70 rounded-md text-gray-800 placeholder-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                {errorsAbrir.montoInicial && (
                  <p className="text-xs text-red-600/80 mt-1.5 font-medium">
                    {errorsAbrir.montoInicial.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPostingBox}
                className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-md font-medium transition-colors text-sm shadow-sm"
              >
                {isPostingBox ? "Abriendo..." : "Abrir Caja"}
              </button>
            </form>

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
                  El monto inicial será registrado en el sistema
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Loading de detalles (solo cuando hay caja abierta)
  if (isLoadingDetails) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-500/30 rounded-md p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600/80">Cargando información de caja...</span>
          </div>
        </div>
      </div>
    );
  }


  // ========================================
  // VISTA PRINCIPAL (Con caja abierta)
  // ========================================
  return (
    <div className="p-6 space-y-6">
      {/* Resumen Superior */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Mi Caja</h2>
          <p className="text-sm text-gray-600/80">
            Caja abierta el {new Date(cajaAbierta.fechaApertura).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {resumen && (
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-md p-5">
            <div className="grid grid-cols-3 gap-8">
              {/* Total General */}
              <div className="border-r border-gray-300/50 pr-8">
                <div className="mb-4">
                  <p className="text-xs text-gray-600/80 font-medium mb-1">Total de Ventas</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${resumen.totalVentas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600/80">
                  <span className="w-2 h-2 rounded-full bg-gray-800"></span>
                  <span>{resumen.cantidadVentas} ventas registradas</span>
                </div>
              </div>

              {/* Desglose por tipo de pago */}
              <div className="border-r border-gray-300/50 pr-8">
                <p className="text-xs text-gray-600/80 font-medium mb-3">Desglose por Tipo de Pago</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600/80"></span>
                      <span className="text-sm text-gray-800/80">Contado</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${resumen.totalEfectivo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600/80"></span>
                      <span className="text-sm text-gray-800/80">Transferencia</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${resumen.totalTransferencias.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-600/80"></span>
                      <span className="text-sm text-gray-800/80">Cuenta Corriente</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${resumen.ventasCuentaCorriente?.total?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <p className="text-xs text-gray-600/80 font-medium mb-3">Estadísticas</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600/80">Productos vendidos</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {resumen.cantidadProductosVendidos} items
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600/80">Monto esperado en caja</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ${resumen.montoEsperado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Botón o Formulario de Cierre - ARRIBA DE LA TABLA */}
      {!mostrarFormularioCierre ? (
        <div className="flex justify-end">
          <button
            onClick={() => setMostrarFormularioCierre(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors text-sm shadow-sm"
          >
            Cerrar Caja
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Cerrar Caja</h3>
            <p className="text-sm text-gray-600/80">Ingresa el monto total contado físicamente en caja</p>
          </div>

          <form onSubmit={handleSubmitCerrar(onSubmitCerrar)} className="space-y-4">
            {/* Monto Final Contado */}
            <div>
              <label className="block text-sm font-medium text-gray-800/80 mb-2">
                Monto Final Contado *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>
                <input
                  {...registerCerrar("montoFinalContado", {
                    required: "El monto final contado es obligatorio",
                    min: { value: 0, message: "El monto no puede ser negativo" },
                  })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300/70 rounded-md text-gray-800 placeholder-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all text-sm font-medium"
                />
              </div>
              {errorsCerrar.montoFinalContado && (
                <p className="text-xs text-red-600/80 mt-1.5 font-medium">
                  {errorsCerrar.montoFinalContado.message}
                </p>
              )}
              <p className="text-xs text-gray-600/80 mt-1.5">
                Cuenta todo el dinero físico en caja (efectivo + transferencias verificadas)
              </p>
            </div>

            {/* Mostrar diferencia en tiempo real */}
            {montoFinalContado > 0 && (
              <div className={`p-4 rounded-md border ${
                diferencia >= 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600/80 font-medium">Monto Contado</p>
                    <p className="font-semibold text-gray-800 text-base">
                      ${montoFinalContado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600/80 font-medium">Monto Esperado</p>
                    <p className="font-semibold text-gray-800 text-base">
                      ${montoEsperado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600/80 font-medium">Diferencia</p>
                    <p className={`font-bold text-base ${diferencia >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {diferencia >= 0 ? '+' : ''}${diferencia.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-800/80 mb-2">
                Observaciones
              </label>
              <textarea
                {...registerCerrar("observaciones")}
                rows={3}
                placeholder="Notas adicionales sobre el cierre (opcional)"
                className="w-full px-4 py-2.5 border border-gray-300/70 rounded-md text-gray-800 placeholder-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all text-sm resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMostrarFormularioCierre(false)}
                className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-800 py-2.5 rounded-md font-medium transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-md font-medium transition-colors text-sm shadow-sm"
              >
                Confirmar Cierre
              </button>
            </div>
          </form>

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
                El sistema calculará automáticamente la diferencia, totales por medio de pago y registrará la fecha de cierre
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Ventas */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Historial de Ventas</h3>
          <p className="text-sm text-gray-600/80">Detalle de todas las operaciones realizadas</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300/70">
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">Nº Venta</th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">Fecha</th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">Cliente</th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">Tipo</th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">Productos</th>
                <th className="text-right px-3 py-3 text-gray-800/80 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-gray-600/80">
                    No hay ventas registradas en esta caja
                  </td>
                </tr>
              ) : (
                ventas.map((venta: any) => (
                  <tr
                    key={venta.id}
                    className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition"
                  >
                    <td className="px-3 py-3 text-gray-800/80 font-medium">{venta.numeroVenta}</td>
                    <td className="px-3 py-3 text-gray-800/80">
                      {new Date(venta.fechaVenta).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-3 py-3 text-gray-800/80">
                      {venta.cliente 
                        ? `${venta.cliente.nombre} ${venta.cliente.apellido || ''}`.trim()
                        : '-'
                      }
                    </td>
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
                    <td className="px-3 py-3 text-gray-800/80">
                      <div className="flex flex-col gap-1">
                        {venta.detalles.map((detalle: any) => (
                          <div key={detalle.id} className="text-xs">
                            <span className="font-medium">{detalle.producto.nombre}</span>
                            {' '}
                            <span className="text-gray-600/80">
                              ({detalle.cantidad} {detalle.unidadMedida.abreviatura})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-800">
                      ${parseFloat(venta.total).toLocaleString('es-AR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}