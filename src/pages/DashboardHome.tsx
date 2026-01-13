import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Package,
  Calendar,
  Settings,
  LogOut,
  Home,
  FileText,
  Tag,
  Menu,
  X,
} from "lucide-react";

const DashboardHome = () => {
  const salesData = [
    { month: "Ene", amount: 45000 },
    { month: "Feb", amount: 52000 },
    { month: "Mar", amount: 48000 },
    { month: "Abr", amount: 61000 },
    { month: "May", amount: 55000 },
    { month: "Jun", amount: 67000 },
  ];

  const recentSales = [
    {
      id: 1,
      customer: "Ana García",
      product: 'Laptop Pro 15"',
      amount: 1250,
      date: "2026-01-11",
      status: "Completado",
    },
    {
      id: 2,
      customer: "Carlos Ruiz",
      product: "Mouse Inalámbrico",
      amount: 890,
      date: "2026-01-11",
      status: "Completado",
    },
    {
      id: 3,
      customer: "María López",
      product: 'Monitor 27" 4K',
      amount: 2100,
      date: "2026-01-10",
      status: "Pendiente",
    },
    {
      id: 4,
      customer: "Juan Pérez",
      product: "Teclado Mecánico",
      amount: 750,
      date: "2026-01-10",
      status: "Completado",
    },
    {
      id: 5,
      customer: "Laura Martín",
      product: "Webcam HD",
      amount: 1580,
      date: "2026-01-09",
      status: "Completado",
    },
  ];

  const topProducts = [
    { name: 'Laptop Pro 15"', sales: 234, revenue: 28080, stock: 45 },
    { name: 'Monitor 27" 4K', sales: 189, revenue: 22680, stock: 78 },
    { name: "Mouse Inalámbrico", sales: 167, revenue: 20040, stock: 120 },
    { name: "Teclado Mecánico", sales: 145, revenue: 17400, stock: 92 },
  ];

  const maxSales = Math.max(...salesData.map((d) => d.amount));

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-500/30 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Ventas Totales</span>
            <div className="p-2 bg-blue-100 rounded-md">
              <DollarSign size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">$67,450</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} />
            +12.5% vs mes anterior
          </p>
        </div>

        <div className="bg-white border border-gray-500/30 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Pedidos</span>
            <div className="p-2 bg-green-100 rounded-md">
              <ShoppingCart size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">342</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} />
            +8.2% vs mes anterior
          </p>
        </div>

        <div className="bg-white border border-gray-500/30 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Clientes</span>
            <div className="p-2 bg-purple-100 rounded-md">
              <Users size={18} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">1,284</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} />
            +15.3% vs mes anterior
          </p>
        </div>

        <div className="bg-white border border-gray-500/30 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Productos</span>
            <div className="p-2 bg-orange-100 rounded-md">
              <Package size={18} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">1,847</p>
          <p className="text-xs text-gray-600 mt-2">En inventario</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-500/30 rounded-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Ventas por Mes</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>2026</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-64">
            {salesData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gray-100 rounded-t-md relative group cursor-pointer hover:bg-gray-200 transition"
                  style={{ height: `${(item.amount / maxSales) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-500/30 rounded-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Productos Top</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{product.name}</span>
                  <span className="text-xs font-bold text-gray-700">
                    ${product.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(product.sales / 234) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{product.sales}</span>
                </div>
                <span className="text-xs text-gray-500">Stock: {product.stock} unidades</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="mt-6 bg-white border border-gray-500/30 rounded-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Ventas Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-600 pb-3">Cliente</th>
                <th className="text-left text-xs font-medium text-gray-600 pb-3">Producto</th>
                <th className="text-left text-xs font-medium text-gray-600 pb-3">Fecha</th>
                <th className="text-left text-xs font-medium text-gray-600 pb-3">Monto</th>
                <th className="text-left text-xs font-medium text-gray-600 pb-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 text-sm font-medium text-gray-800">{sale.customer}</td>
                  <td className="py-3 text-sm text-gray-600">{sale.product}</td>
                  <td className="py-3 text-sm text-gray-600">{sale.date}</td>
                  <td className="py-3 text-sm font-bold text-gray-800">
                    ${sale.amount.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        sale.status === "Completado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default DashboardHome;
