import {
  BarChart3,
  Package,
  Calendar,
} from "lucide-react";

import { useProduct } from "../hooks/useProduct";
import { useRecaudado } from "../hooks/useRecaudado";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCliente } from "../hooks/useCliente";

const DashboardHome = () => {
  //Hook de productos
  const {
    lowStockProductsData,
    isLoadingLowStockProducts,
    isErrorLowStockProducts,
  } = useProduct();
  const lowStockProducts = lowStockProductsData?.data || [];

  //Hook para obtener lo recaudado en ventas
  const {
    recaudadoPorMesData,
    isLoadingRecaudadoPorMes,
    isErrorRecaudadoPorMes,
    recaudadoPorSemanaData,
    isLoadingRecaudadoPorSemana,
    isErrorRecaudadoPorSemana,
  } = useRecaudado();

  //hook para obtener los clientes con deudas
  const { useGetClientesConDeudas } = useCliente();
  const { data: clientesConDeudasData } = useGetClientesConDeudas();
  const clientesConDeudas = clientesConDeudasData?.data || [];
  console.log("Clientes con deudas:", clientesConDeudas);

  const recaudadoPorMes = recaudadoPorMesData?.data || [];
  const recaudadoPorSemana = recaudadoPorSemanaData?.data || [];

  // Preparar datos para el gráfico de MESES
  const salesChartDataMonth = recaudadoPorMes.map((item: any) => ({
    mes: item.nombre_mes?.substring(0, 3) || "",
    total: Number(item.total_recaudado),
    ventas: Number(item.total_ventas),
  }));

  // Preparar datos para el gráfico de SEMANAS
  const salesChartDataWeek = recaudadoPorSemana
    .slice()
    .reverse()
    .map((item: any) => ({
      semana: `S${item.numero_semana}`,
      total: Number(item.total_recaudado),
      ventas: Number(item.total_ventas),
      inicio: item.inicio_semana,
      fin: item.fin_semana,
    }));

  return (
    <>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - MENSUAL */}
        <div className="lg:col-span-2 bg-white border border-gray-500/30 rounded-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Ventas por Mes</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>

          {/* Estado de carga */}
          {isLoadingRecaudadoPorMes && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          )}

          {/* Estado de error */}
          {isErrorRecaudadoPorMes && !isLoadingRecaudadoPorMes && (
            <div className="flex items-center justify-center h-64">
              <p className="text-sm text-red-600">
                Error al cargar datos de ventas
              </p>
            </div>
          )}

          {/* Gráfico con Recharts */}
          {!isLoadingRecaudadoPorMes &&
            !isErrorRecaudadoPorMes &&
            salesChartDataMonth.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salesChartDataMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => [
                      `$${(value ?? 0).toLocaleString()}`,
                      "Total",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

          {/* Sin datos */}
          {!isLoadingRecaudadoPorMes &&
            !isErrorRecaudadoPorMes &&
            salesChartDataMonth.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64">
                <BarChart3 size={48} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-600">No hay datos de ventas</p>
              </div>
            )}
        </div>

        {/* Productos con Stock Bajo */}
        <div className="bg-white border border-gray-500/30 rounded-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Productos con Stock Bajo
          </h2>

          <div className="space-y-4">
            {/* Estado de carga */}
            {isLoadingLowStockProducts && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-2"></div>
                <p className="text-sm text-gray-600">Cargando productos...</p>
              </div>
            )}

            {/* Estado de error */}
            {isErrorLowStockProducts && !isLoadingLowStockProducts && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md text-sm">
                  Error al cargar productos con bajo stock
                </div>
              </div>
            )}

            {/* Sin datos */}
            {!isLoadingLowStockProducts &&
              !isErrorLowStockProducts &&
              lowStockProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Package size={48} className="text-gray-300 mb-2" />
                  <p className="text-sm text-gray-600">
                    No hay productos con stock bajo
                  </p>
                </div>
              )}

            {/* Lista de productos */}
            {!isLoadingLowStockProducts &&
              !isErrorLowStockProducts &&
              lowStockProducts.length > 0 &&
              lowStockProducts.map((product: any, index: number) => (
                <div
                  key={product.id || index}
                  className="border-b border-gray-200 pb-3 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      {product.nombre}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      ${Number(product.precio_venta).toLocaleString()}
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          Number(product.stock_cantidad) === 0
                            ? "bg-red-500"
                            : Number(product.stock_cantidad) <=
                                Number(product.stock_minimo) * 0.5
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (Number(product.stock_cantidad) /
                              Number(product.stock_minimo)) *
                              100,
                            100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {Number(product.stock_cantidad).toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Stock mínimo: {Number(product.stock_minimo).toFixed(0)}{" "}
                      unidades
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        Number(product.stock_cantidad) === 0
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {Number(product.stock_cantidad) === 0
                        ? "¡Sin stock!"
                        : "Stock bajo"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Sales Chart - SEMANAL (Nuevo) */}
      <div className="mt-6 bg-white border border-gray-500/30 rounded-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Ventas por Semana</h2>
          <span className="text-xs text-gray-600">Últimas 12 semanas</span>
        </div>

        {/* Estado de carga */}
        {isLoadingRecaudadoPorSemana && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        )}

        {/* Estado de error */}
        {isErrorRecaudadoPorSemana && !isLoadingRecaudadoPorSemana && (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm text-red-600">
              Error al cargar datos semanales
            </p>
          </div>
        )}

        {/* Gráfico de semanas */}
        {!isLoadingRecaudadoPorSemana &&
          !isErrorRecaudadoPorSemana &&
          salesChartDataWeek.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesChartDataWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [
                    `$${(value ?? 0).toLocaleString()}`,
                    "Total",
                  ]}
                  labelFormatter={(label) => `Semana ${label.substring(1)}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

        {/* Sin datos */}
        {!isLoadingRecaudadoPorSemana &&
          !isErrorRecaudadoPorSemana &&
          salesChartDataWeek.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48">
              <BarChart3 size={48} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-600">
                No hay datos de ventas semanales
              </p>
            </div>
          )}
      </div>

      {/* Recent Sales */}
      <div className="mt-6 bg-white border border-gray-500/30 rounded-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Cuentas Corrientes con mas deudas
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300/70">
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  ID
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Nombre Cliente
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Email
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Telefono
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Saldo Actual
                </th>
                <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                  Estado
                </th>
               
              </tr>
            </thead>
            <tbody>
              {
                clientesConDeudas.map((cliente: any, index: number) => (
              <tr key={cliente.id} className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition">
                <td className="px-3 py-3 text-gray-800/80 font-medium">{index}</td>
                <td className="px-3 py-3 text-gray-800/80 font-medium">{cliente.nombre}{" "}{cliente.apellido}</td>
                <td className="px-3 py-3 text-gray-800/80 font-medium">{cliente.email}</td>
                <td className="px-3 py-3 text-gray-800/80">{cliente.telefono}</td>
                <td className="px-3 py-3 text-gray-800/80 font-bold">{cliente.saldoActual}</td>
                <td className="px-3 py-3">{cliente.estado}</td>
                <td className="px-3 py-3"></td>
              </tr>

                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
