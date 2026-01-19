import React from "react";

interface FormBoxCloseProps {
  handleSubmitCerrar: (
    onSubmit: (data: {
      montoFinalContado: number;
      observaciones?: string;
    }) => void,
  ) => (e: React.FormEvent) => void;
  onSubmitCerrar: (data: {
    montoFinalContado: number;
    observaciones?: string;
  }) => void;
  registerCerrar: (
    name: string,
    options?: Record<string, any>,
  ) => React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
  errorsCerrar: {
    [key: string]: { message: string } | undefined;
  };
  montoFinalContado: number;
  montoEsperado: number;
  diferencia: number;
  setMostrarFormularioCierre: (mostrar: boolean) => void;
}

const FormBoxClose = ({
  handleSubmitCerrar,
  onSubmitCerrar,
  registerCerrar,
  errorsCerrar,
  montoFinalContado,
  montoEsperado,
  diferencia,
  setMostrarFormularioCierre,
}: FormBoxCloseProps) => {
  return (
    <form onSubmit={handleSubmitCerrar(onSubmitCerrar)} className="space-y-4">
      {/* Monto Final Contado */}
      <div>
        <label className="block text-sm font-medium text-gray-800/80 mb-2">
          Monto Final Contado *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
            $
          </span>
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
          Cuenta todo el dinero físico en caja (efectivo + transferencias
          verificadas)
        </p>
      </div>

      {/* Mostrar diferencia en tiempo real */}
      {montoFinalContado > 0 && (
        <div
          className={`p-4 rounded-md border ${
            diferencia >= 0
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600/80 font-medium">Monto Contado</p>
              <p className="font-semibold text-gray-800 text-base">
                $
                {montoFinalContado.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600/80 font-medium">Monto Esperado</p>
              <p className="font-semibold text-gray-800 text-base">
                $
                {montoEsperado.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600/80 font-medium">Diferencia</p>
              <p
                className={`font-bold text-base ${diferencia >= 0 ? "text-green-700" : "text-red-700"}`}
              >
                {diferencia >= 0 ? "+" : ""}$
                {diferencia.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
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
  );
};

export default FormBoxClose;
