import React from "react";

interface FormBoxOpenProps {
  handleSubmitAbrir: (
    onSubmit: (data: { montoInicial: number }) => void,
  ) => (e: React.FormEvent) => void;
  onSubmitAbrir: (data: { montoInicial: number }) => void;
  registerAbrir: (
    name: string,
    options?: Record<string, any>,
  ) => React.InputHTMLAttributes<HTMLInputElement>;
  errorsAbrir: {
    [key: string]: { message: string } | undefined;
  };
  isPostingBox: boolean;
}

const FormBoxOpen = ({
  handleSubmitAbrir,
  onSubmitAbrir,
  registerAbrir,
  errorsAbrir,
  isPostingBox,
}: FormBoxOpenProps) => {
  return (
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
  );
};

export default FormBoxOpen;
