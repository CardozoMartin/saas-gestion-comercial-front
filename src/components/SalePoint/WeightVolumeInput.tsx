import { Scale, DollarSign } from "lucide-react";

import { RefObject } from 'react';

interface WeightVolumeInputProps {
  inputType: "cantidad" | "monto";
  inputValue: string;
  productPreview: {
    cantidad: number;
    monto: number;
    cantidadFormateada: string;
  } | null;
  onInputTypeChange: (type: "cantidad" | "monto") => void;
  onInputValueChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  inputRef?: RefObject<HTMLInputElement>;
}

const WeightVolumeInput = ({
  inputType,
  inputValue,
  productPreview,
  onInputTypeChange,
  onInputValueChange,
  onCancel,
  onConfirm,
}: WeightVolumeInputProps) => {
  return (
    <div className="space-y-2 mt-3 pt-3 border-t border-blue-200">
      {/* Selector de tipo */}
      <div className="flex gap-2">
        <button
          onClick={() => onInputTypeChange("cantidad")}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition ${
            inputType === "cantidad"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          <Scale size={12} className="inline mr-1" />
          Cantidad
        </button>
        <button
          onClick={() => onInputTypeChange("monto")}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition ${
            inputType === "monto"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          <DollarSign size={12} className="inline mr-1" />
          Monto
        </button>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="number"
        step="0.001"
        value={inputValue}
        onChange={(e) => onInputValueChange(e.target.value)}
        placeholder={inputType === "cantidad" ? "0.500" : "200"}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        autoFocus
      />

      {/* Vista previa */}
      {productPreview && (
        <div className="bg-white border border-blue-300 rounded-lg p-2">
          <p className="text-xs text-gray-600">Vista previa:</p>
          <p className="text-sm font-semibold text-blue-900">
            {productPreview.cantidadFormateada}
          </p>
          <p className="text-base font-bold text-blue-900">
            Total: ${productPreview.monto.toFixed(2)}
          </p>
        </div>
      )}

      {/* Atajos */}
      <div className="text-xs text-gray-500">
        Atajos: presiona <kbd className="bg-gray-100 px-1 rounded">c</kbd> para <b>cantidad</b>, <kbd className="bg-gray-100 px-1 rounded">m</kbd> para <b>monto</b>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={!inputValue || parseFloat(inputValue) <= 0}
          className="flex-1 py-2 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default WeightVolumeInput;