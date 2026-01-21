import React from "react";

interface FormBoxOpenProps {
  handleSubmitAbrir: (
    onSubmit: (data: { observaciones: string }) => void,
  ) => (e: React.FormEvent) => void;
  onSubmitAbrir: (data: { observaciones: string }) => void;
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
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <input
          id="observaciones"
          type="text"
          {...registerAbrir("observaciones", { required: "Las observaciones son obligatorias" })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Ingresa las observaciones para abrir la caja"
        />
        {errorsAbrir.observaciones && (
          <p className="mt-1 text-sm text-red-600">{errorsAbrir.observaciones.message}</p>
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
