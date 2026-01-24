import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBox } from "../hooks/useBox";
import Swal from "sweetalert2";
import { useSession } from "../store/useSession";
import RowClienteData from "../components/Box/RowClienteData";

import FormBoxOpen from "../components/Box/FormBoxOpen";
import FormBoxClose from "../components/Box/FormBoxClose";

export default function CajaPage() {
  const { user } = useSession();

  const {
    postOpenBox,
    isPostingBox,
    useBoxByUser,
    useBoxDetailByUser,
    closeBox,
    useVerifyOpenBoxByUser,
  } = useBox();

  const [mostrarFormularioCierre, setMostrarFormularioCierre] = useState(false);

  //Verificamos que el usuario tenga caja abierta
  const { isError: isErrorVerifyBox } = useVerifyOpenBoxByUser(Number(user?.userId ?? 0));


  // ✅ PASO 1: Primero obtener solo el estado de la caja
  const { data: responseData, isLoading: isLoadingCaja } = useBoxByUser(
    Number(user?.userId ?? 0),
  );

  const cajaAbierta = responseData?.data?.[0] || null;

  // ✅ PASO 2: Solo obtener detalles si hay caja abierta
 const { data: boxDetails, isLoading: isLoadingDetails } = useBoxDetailByUser(
  Number(user?.userId ?? 0),
  {
    enabled: !!cajaAbierta,
  },
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
      observaciones: "",
      usuarioId: user?.userId || 0,
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
      usuarioId: user?.userId || 0,
      montoFinalContado: 0,
      montoRetirado: 0,
      fondoSiguienteCaja: 0,
    },
  });

  // Calcular diferencia en tiempo real
  const montoFinalContado = Number(watchCerrar("montoFinalContado") || 0);
  const montoEsperado = resumen ? resumen.montoEsperado : 0;
  const diferencia = montoFinalContado - montoEsperado;

  const onSubmitAbrir = (data: any) => {
    console.log("data antes de enviar:", data);
    Swal.fire({
      title: "¿Abrir Caja?",
      text: "¿Estás seguro de que deseas abrir la caja?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, abrirla!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        postOpenBox(
          {
            usuarioId: Number(user?.userId ?? 0),
            observaciones: data.observaciones,
          },
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
                text:
                  error?.response?.data?.message || "No se pudo abrir la caja",
                icon: "error",
              });
            },
          },
        );
      }
    });
  };

  const onSubmitCerrar = (data: any) => {
    Swal.fire({
      title: "¿Cerrar Caja?",
      html: `
        <div class="text-left text-sm space-y-2">
          <p><strong>Monto Final Contado:</strong> $${montoFinalContado.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
          <p><strong>Monto Esperado:</strong> $${montoEsperado.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
          <p class="${diferencia >= 0 ? "text-green-600" : "text-red-600"}">
            <strong>Diferencia:</strong> $${diferencia.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrarla!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          usuarioId: Number(user?.userId ?? 0),
          montoFinalContado: Number(data.montoFinalContado),
          montoRetirado: Number(data.montoRetirado),
          fondoSiguienteCaja: Number(data.fondoSiguienteCaja),
        };

        closeBox(
          {
            boxId: cajaAbierta.id,
            data: payload,
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
                text:
                  error?.response?.data?.message || "No se pudo cerrar la caja",
                icon: "error",
              });
            },
          },
        );
      }
    });
  };

  // Loading solo de la verificación inicial de caja
 if (isLoadingCaja) {
  return (
    <div className="p-6">
      <div className="bg-white border border-gray-500/30 rounded-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600/80">
            Verificando estado de caja...
          </span>
        </div>
      </div>
    </div>
  );
}
  // FORMULARIO DE APERTURA (Sin caja abierta)
 if (!cajaAbierta || isErrorVerifyBox) {
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

          <FormBoxOpen
            handleSubmitAbrir={handleSubmitAbrir}
            onSubmitAbrir={onSubmitAbrir}
            registerAbrir={registerAbrir}
            errorsAbrir={errorsAbrir}
            isPostingBox={isPostingBox}
          />

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
              <span>El monto inicial será registrado en el sistema</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  // Loading de detalles (solo cuando hay caja abierta)
 if (isLoadingDetails) {
  return (
    <div className="p-6">
      <div className="bg-white border border-gray-500/30 rounded-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600/80">
            Cargando información de caja...
          </span>
        </div>
      </div>
    </div>
  );
}

  // VISTA PRINCIPAL (Con caja abierta)

  return (
    <div className="p-6 space-y-6">
      {/* Resumen Superior */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Mi Caja</h2>
          <p className="text-sm text-gray-600/80">
            Caja abierta el{" "}
            {new Date(cajaAbierta.fechaApertura).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {resumen && (
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-md p-5">
            <div className="grid grid-cols-3 gap-8">
              {/* Total General */}
              <div className="border-r border-gray-300/50 pr-8">
                <div className="mb-4">
                  <p className="text-xs text-gray-600/80 font-medium mb-1">
                    Total de Ventas
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    $
                    {resumen.totalVentas.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600/80">
                  <span className="w-2 h-2 rounded-full bg-gray-800"></span>
                  <span>{resumen.cantidadVentas} ventas registradas</span>
                </div>
              </div>

              {/* Desglose por tipo de pago */}
              <div className="border-r border-gray-300/50 pr-8">
                <p className="text-xs text-gray-600/80 font-medium mb-3">
                  Desglose por Tipo de Pago
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600/80"></span>
                      <span className="text-sm text-gray-800/80">Contado</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      $
                      {resumen.totalEfectivo.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600/80"></span>
                      <span className="text-sm text-gray-800/80">
                        Transferencia
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      $
                      {resumen.totalTransferencias.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-600/80"></span>
                      <span className="text-sm text-gray-800/80">
                        Cuenta Corriente
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      $
                      {resumen.ventasCuentaCorriente?.total?.toLocaleString(
                        "es-AR",
                        { minimumFractionDigits: 2 },
                      ) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <p className="text-xs text-gray-600/80 font-medium mb-3">
                  Estadísticas
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600/80">
                      Productos vendidos
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {resumen.cantidadProductosVendidos} items
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600/80">
                      Monto esperado en caja
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      $
                      {resumen.montoEsperado.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/*Botón o Formulario de Cierre - ARRIBA DE LA TABLA */}
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
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Cerrar Caja
            </h3>
            <p className="text-sm text-gray-600/80">
              Ingresa el monto total contado físicamente en caja
            </p>
          </div>

          <FormBoxClose
            handleSubmitCerrar={handleSubmitCerrar}
            onSubmitCerrar={onSubmitCerrar}
            registerCerrar={registerCerrar}
            errorsCerrar={errorsCerrar}
            montoFinalContado={montoFinalContado}
            montoEsperado={montoEsperado}
            diferencia={diferencia}
            setMostrarFormularioCierre={setMostrarFormularioCierre}
          />

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
                El sistema calculará automáticamente la diferencia, totales por
                medio de pago y registrará la fecha de cierre
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Ventas */}
      <div className="bg-white border border-gray-500/30 rounded-md p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Historial de Ventas
          </h3>
          <p className="text-sm text-gray-600/80">
            Detalle de todas las operaciones realizadas
          </p>
        </div>

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
                <th className="text-right px-3 py-3 text-gray-800/80 font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-gray-600/80"
                  >
                    No hay ventas registradas en esta caja
                  </td>
                </tr>
              ) : (
                ventas.map((venta: any) => (
                  <RowClienteData key={venta.id} venta={venta} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
