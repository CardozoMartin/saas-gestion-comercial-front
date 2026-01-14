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
import { useState } from "react";
import FormCategory from "../components/Category/FormCategory";
import Producto from "../components/Producto/Producto";
import UnitsPage from "../pages/UnitsPage";

const SalesDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "products", name: "Productos", icon: Package },
    { id: "sales", name: "Ventas", icon: ShoppingCart },
    { id: "customers", name: "Clientes", icon: Users },
    { id: "orders", name: "Pedidos", icon: FileText },
    { id: "categories", name: "Categorías", icon: Tag },
    { id: "analytics", name: "Análisis", icon: BarChart3 },
    { id: "settings", name: "Configuración", icon: Settings },
    { id: "units", name: "Unidades", icon: DollarSign },
  ];

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

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-500/30 rounded-md p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Ventas Totales
                  </span>
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
                  <span className="text-sm font-medium text-gray-600">
                    Pedidos
                  </span>
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
                  <span className="text-sm font-medium text-gray-600">
                    Clientes
                  </span>
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
                  <span className="text-sm font-medium text-gray-600">
                    Productos
                  </span>
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
                  <h2 className="text-lg font-bold text-gray-800">
                    Ventas por Mes
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>2026</span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-3 h-64">
                  {salesData.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full bg-gray-100 rounded-t-md relative group cursor-pointer hover:bg-gray-200 transition"
                        style={{ height: `${(item.amount / maxSales) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          ${item.amount.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white border border-gray-500/30 rounded-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Productos Top
                </h2>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-3 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          {product.name}
                        </span>
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
                        <span className="text-xs text-gray-600">
                          {product.sales}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock} unidades
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="mt-6 bg-white border border-gray-500/30 rounded-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Ventas Recientes
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-600 pb-3">
                        Cliente
                      </th>
                      <th className="text-left text-xs font-medium text-gray-600 pb-3">
                        Producto
                      </th>
                      <th className="text-left text-xs font-medium text-gray-600 pb-3">
                        Fecha
                      </th>
                      <th className="text-left text-xs font-medium text-gray-600 pb-3">
                        Monto
                      </th>
                      <th className="text-left text-xs font-medium text-gray-600 pb-3">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="py-3 text-sm font-medium text-gray-800">
                          {sale.customer}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {sale.product}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {sale.date}
                        </td>
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

      case "products":
        return <Producto />;

      case "sales":
        return (
          <div className="bg-white border border-gray-500/30 rounded-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Historial de Ventas
            </h2>
            <p className="text-gray-600">
              Vista detallada de todas las ventas realizadas con filtros
              avanzados.
            </p>
          </div>
        );

      case "customers":
        return (
          <div className="bg-white border border-gray-500/30 rounded-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Base de Clientes
            </h2>
            <p className="text-gray-600">
              Administra tu cartera de clientes y visualiza su historial de
              compras.
            </p>
          </div>
        );

      case "orders":
        return (
          <div className="bg-white border border-gray-500/30 rounded-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Gestión de Pedidos
            </h2>
            <p className="text-gray-600">
              Procesa y administra todos los pedidos pendientes y completados.
            </p>
          </div>
        );

      case "categories":
        return (
          <div className="bg-white border border-gray-500/30 rounded-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Categorías de Productos
            </h2>
            <p className="text-gray-600">
              Organiza tus productos en categorías para facilitar la búsqueda.
            </p>
            <FormCategory />
          </div>
        );

      case "analytics":
        return (
          <div className="bg-white border border-gray-500/30 rounded-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Análisis Detallado
            </h2>
            <p className="text-gray-600">
              Reportes avanzados y métricas de rendimiento de tu negocio.
            </p>
          </div>
        );
      case "units":
        return <UnitsPage />;

      case "settings":
        return (
          <div className="bg-white border border-gray-500/30 rounded-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Configuración
            </h2>
            <p className="text-gray-600">
              Ajusta las preferencias de tu sistema de ventas.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // Login Screen

  // Dashboard (después del login)
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Sistema Ventas</h1>
          <p className="text-sm text-gray-500 mt-1">Panel de Control</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                      currentView === item.id
                        ? "bg-gray-500/20 text-gray-800"
                        : "text-gray-700 hover:bg-gray-500/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-500/10 transition">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-500/30 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-md transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  Admin Usuario
                </p>
                <p className="text-xs text-gray-600">admin@ventas.com</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

export default SalesDashboard;
