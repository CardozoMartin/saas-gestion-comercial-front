import { useState, useEffect } from "react";
import { Trash2, Save, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSale } from "../hooks/useSale";
import { useSaleEdit } from "../store/useSaleEdit";

// Types
type SaleDetail = {
  id: number;
  productoId: number;
  producto: { nombre: string; codigo?: string };
  cantidad: number;
  precioUnitario: number;
  unidadMedida: { id?: number; abreviatura?: string };
};

type Sale = {
  id: number;
  numeroVenta: string;
  fechaVenta: string;
  cliente?: { nombre: string; apellido?: string } | null;
  tipoVenta: string;
  detalles: SaleDetail[];
  total: string | number;
  descuento?: number | string;
  estado?: string;
  observaciones?: string;
};

const EditSalePage = () => {
  const navigate = useNavigate();
  const { saleEdit, clearSaleEdit } = useSaleEdit();
  const { putSaleDetails: putSaleDetailsFn, isPuttingSaleDetails } = useSale();

  const [localSale, setLocalSale] = useState<Sale | null>(() => (saleEdit ? JSON.parse(JSON.stringify(saleEdit)) : null));
  const [observaciones, setObservaciones] = useState<string>(() => saleEdit?.observaciones || "");
  const [error, setError] = useState<string | null>(null);

  // If no sale to edit, redirect back
  useEffect(() => {
    if (!saleEdit) {
      // prevent staying on the page without data
      navigate("/dashboard/ventas");
    }
  }, [saleEdit, navigate]);

  // Calcular totales
  const calcularSubtotal = (cantidad: number, precioUnitario: number) => {
    return cantidad * precioUnitario;
  };

  const calcularTotales = () => {
    if (!localSale) return { subtotal: 0, descuento: 0, total: 0 };
    const subtotal = localSale.detalles.reduce((acc: number, d: any) => {
      return acc + calcularSubtotal(d.cantidad, d.precioUnitario);
    }, 0);
    const descuento = Number(localSale.descuento) || 0;
    const total = subtotal - descuento;
    return { subtotal, descuento, total };
  };

  const totales = calcularTotales();

  if (!localSale) return null; // o un placeholder de carga

  // Handlers
  const handleCantidadChange = (detalleId: number, value: string) => {
    const cantidad = parseFloat(value) || 0;
    setLocalSale((prev) => (
      prev
        ? {
            ...prev,
            detalles: prev.detalles.map((d) =>
              d.id === detalleId ? { ...d, cantidad } : d
            ),
          }
        : prev
    ));
  };

  const handlePrecioChange = (detalleId: number, value: string) => {
    const precioUnitario = parseFloat(value) || 0;
    setLocalSale((prev) => (
      prev
        ? {
            ...prev,
            detalles: prev.detalles.map((d) =>
              d.id === detalleId ? { ...d, precioUnitario } : d
            ),
          }
        : prev
    ));
  };

  const handleRemoveDetalle = (detalleId: number) => {
    if (!localSale) return;
    if (localSale.detalles.length <= 1) {
      setError("Debe haber al menos un producto en la venta");
      return;
    }
    setLocalSale((prev) =>
      prev ? { ...prev, detalles: prev.detalles.filter((d) => d.id !== detalleId) } : prev
    );
  };

  const handleSave = async () => {
    setError(null);

    // Validaciones
    if (localSale.detalles.length === 0) {
      setError("Debe haber al menos un producto en la venta");
      return;
    }

    const invalidDetail = localSale.detalles.find(
      (d: SaleDetail) => d.cantidad <= 0 || d.precioUnitario <= 0
    );
    if (invalidDetail) {
      setError("Todos los productos deben tener cantidad y precio mayores a 0");
      return;
    }

    if (totales.total <= 0) {
      setError("El total de la venta debe ser mayor a 0");
      return;
    }

    try {
      // Preparar datos según el backend espera
      const updateData = {
        detalles: localSale.detalles.map((d: SaleDetail) => ({
          productoId: d.productoId,
          unidadMedidaId: d.unidadMedida.id,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        })),
        observaciones: observaciones.trim() || undefined,
      };

      // Usar la función del hook useSale para editar
      await putSaleDetailsFn({ saleId: localSale.id, updateData });

      // limpiar y regresar a la lista de ventas
      clearSaleEdit();
      navigate('/dashboard/ventas');
    } catch (error: unknown) {
      const err: any = error;
      setError(err?.response?.data?.error || "Error al actualizar la venta");
      console.error("Error actualizando venta:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Venta #{localSale.numeroVenta}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(localSale.fechaVenta).toLocaleString("es-AR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { clearSaleEdit(); navigate('/dashboard/ventas'); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                <X size={18} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isPuttingSaleDetails}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isPuttingSaleDetails ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>

          {/* Info de la venta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Cliente
              </label>
              <p className="text-gray-900">
                {localSale.cliente
                  ? `${localSale.cliente.nombre} ${localSale.cliente.apellido || ""}`
                  : "Venta sin cliente"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tipo de Venta
              </label>
              <p className="text-gray-900 capitalize">
                {localSale.tipoVenta.replace("_", " ")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Estado
              </label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  localSale.estado === "pagada"
                    ? "bg-green-100 text-green-800"
                    : localSale.estado === "pendiente"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {localSale.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Detalles de la venta */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Productos
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Producto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Unidad
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                    Cantidad
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    Precio Unit.
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    Subtotal
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {localSale.detalles.map((detalle: any) => {
                  const subtotal = calcularSubtotal(
                    detalle.cantidad,
                    detalle.precioUnitario
                  );
                  return (
                    <tr key={detalle.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {detalle.producto.nombre}
                        </div>
                        <div className="text-xs text-gray-500">
                          Código: {detalle.producto.codigo}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {detalle.unidadMedida?.abreviatura || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={detalle.cantidad}
                          onChange={(e) =>
                            handleCantidadChange(detalle.id, e.target.value)
                          }
                          className="w-24 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={detalle.precioUnitario}
                          onChange={(e) =>
                            handlePrecioChange(detalle.id, e.target.value)
                          }
                          className="w-28 px-2 py-1 border rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        ${subtotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRemoveDetalle(detalle.id)}
                          disabled={localSale.detalles.length <= 1}
                          className="text-red-600 hover:text-red-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                          title="Eliminar producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="mt-6 border-t pt-4">
            <div className="flex flex-col items-end space-y-2">
              <div className="flex justify-between w-64">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${totales.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64">
                <span className="text-gray-600">Descuento:</span>
                <span className="font-medium text-red-600">
                  -${totales.descuento.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-64 text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">${totales.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones de la edición (opcional)
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Motivo de la edición o comentarios adicionales..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Esta observación se agregará al historial de la venta
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditSalePage;