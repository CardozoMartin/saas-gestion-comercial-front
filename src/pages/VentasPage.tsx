import React from 'react'
import { useBox } from '../hooks/useBox';
import { useSession } from '../store/useSession';

const VentasPage = () => {
  const { user } = useSession()
  const { useGetBoxesAll } = useBox();

  const { data: boxesAll, isLoading, isError } = useGetBoxesAll();
  console.log("Cajas:", boxesAll);

const boxAll = boxesAll?.data || [];
 
 

 const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(parseFloat(amount));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cajas Registradas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxAll.map((box) => (
          <div 
            key={box.id} 
            className="text-sm p-3 bg-white border border-gray-500/30 text-gray-800/80 rounded-md font-medium"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-300/50">
              <h3 className="text-base font-bold text-gray-800">Caja #{box.id}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                box.estado === 'abierta' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {box.estado.toUpperCase()}
              </span>
            </div>

            <ul className="flex flex-col gap-px text-xs">
              <li className="flex items-center justify-between gap-2 bg-gray-500/5 px-2 py-1.5 rounded">
                <span className="text-gray-600">Apertura</span>
                <span className="font-semibold text-right">{formatDate(box.fechaApertura)}</span>
              </li>
              
              <li className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-gray-500/10 transition">
                <span className="text-gray-600">Cierre</span>
                <span className="font-semibold text-right">{formatDate(box.fechaCierre)}</span>
              </li>

              <div className="w-full h-px bg-gray-300/50 my-1.5"></div>

              <li className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-gray-500/10 transition">
                <span className="text-gray-600">Inicial</span>
                <span className="font-semibold text-blue-600">{formatMoney(box.montoInicial)}</span>
              </li>

              <li className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-gray-500/10 transition">
                <span className="text-gray-600">Final</span>
                <span className="font-semibold text-blue-600">{formatMoney(box.montoFinal)}</span>
              </li>

              <div className="w-full h-px bg-gray-300/50 my-1.5"></div>

              <li className="flex items-center justify-between gap-2 bg-green-50 px-2 py-1.5 rounded">
                <span className="text-gray-600">Ventas</span>
                <span className="font-bold text-green-700">{formatMoney(box.totalVentas)}</span>
              </li>

              <li className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-gray-500/10 transition">
                <span className="text-gray-600">Efectivo</span>
                <span className="font-semibold">{formatMoney(box.totalEfectivo)}</span>
              </li>

              <li className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-gray-500/10 transition">
                <span className="text-gray-600">Transferencias</span>
                <span className="font-semibold">{formatMoney(box.totalTransferencias)}</span>
              </li>

              <div className="w-full h-px bg-gray-300/50 my-1.5"></div>

              <li className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded ${
                parseFloat(box.diferencia) < 0 
                  ? 'bg-red-50' 
                  : parseFloat(box.diferencia) > 0 
                  ? 'bg-yellow-50' 
                  : 'bg-gray-50'
              }`}>
                <span className="text-gray-600">Diferencia</span>
                <span className={`font-bold ${
                  parseFloat(box.diferencia) < 0 
                    ? 'text-red-600' 
                    : parseFloat(box.diferencia) > 0 
                    ? 'text-yellow-600' 
                    : 'text-gray-600'
                }`}>
                  {formatMoney(box.diferencia)}
                </span>
              </li>

              {box.observaciones && (
                <li className="flex items-start gap-2 px-2 py-1.5 rounded bg-blue-50 mt-1">
                  <span className="text-gray-600 shrink-0">Obs:</span>
                  <span className="font-medium text-blue-700">{box.observaciones}</span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VentasPage;