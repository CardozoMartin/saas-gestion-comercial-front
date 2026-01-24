


import { useSaleEdit } from "../../store/useSaleEdit";
import { useNavigate } from 'react-router-dom';

type Venta = {
  id: number;
  numeroVenta: string;
  fechaVenta: string;
  cliente: {
    nombre: string;
    apellido?: string;
  } | null;
  tipoVenta: "contado" | "transferencia" | "cuenta_corriente";
  detalles: {
    id: number;
    producto: { nombre: string };
    cantidad: number;
    unidadMedida: { abreviatura: string };
  }[];
  total: string;
};

interface RowClienteDataProps {
  venta: Venta;
  onEditSale?: (saleData: Venta) => void;
}

const RowClienteData = ({ venta, onEditSale }: RowClienteDataProps) => {
  const { setSaleEdit } = useSaleEdit();
  const navigate = useNavigate()

  const handleEditSale = (id: number) => {
    console.log("Editar venta con ID:", id);
    console.log("Datos completos de la venta:", venta);

    // Guardar en el store la venta a editar
    setSaleEdit(venta);

    // Llamar a callback externo si existe
    if (onEditSale) onEditSale(venta);

    // Navegar a la vista de edición
    navigate('/dashboard/ventas/editar');
  }
  return (
    <tr
      key={venta.id}
      className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition"
    >
      <td className="px-3 py-3 text-gray-800/80 font-medium">
        {venta.numeroVenta}
      </td>
      <td className="px-3 py-3 text-gray-800/80">
        {new Date(venta.fechaVenta).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td className="px-3 py-3 text-gray-800/80">
        {venta.cliente
          ? `${venta.cliente.nombre} ${venta.cliente.apellido || ""}`.trim()
          : "-"}
      </td>
      <td className="px-3 py-3">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            venta.tipoVenta === "contado"
              ? "bg-green-500/20 text-green-900/80"
              : venta.tipoVenta === "transferencia"
                ? "bg-blue-500/20 text-blue-900/80"
                : "bg-orange-500/20 text-orange-900/80"
          }`}
        >
          {venta.tipoVenta === "contado"
            ? "Contado"
            : venta.tipoVenta === "transferencia"
              ? "Transferencia"
              : "Cta. Cte."}
        </span>
      </td>
      <td className="px-3 py-3 text-gray-800/80">
        <div className="flex flex-col gap-1">
          {venta.detalles.map((detalle) => (
            <div key={detalle.id} className="text-xs">
              <span className="font-medium">{detalle.producto.nombre}</span>{" "}
              <span className="text-gray-600/80">
                ({detalle.cantidad} {detalle.unidadMedida.abreviatura})
              </span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-3 py-3 text-right font-semibold text-gray-800">
        $
        {parseFloat(venta.total).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="px-3 py-3 text-right font-semibold text-gray-800">
        <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        onClick={() => handleEditSale(venta.id)}>Editar</button>
      </td>
    </tr>
  );
};

export default RowClienteData;
