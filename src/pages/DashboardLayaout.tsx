import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
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

// Layout del Dashboard
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home, path: "/dashboard" },
    {
      id: "products",
      name: "Productos",
      icon: Package,
      path: "/dashboard/productos",
    },
    {
      id: "sales",
      name: "Ventas",
      icon: ShoppingCart,
      path: "/dashboard/ventas",
    },
    {
      id: "customers",
      name: "Clientes",
      icon: Users,
      path: "/dashboard/clientes",
    },
    {
      id: "orders",
      name: "Pedidos",
      icon: FileText,
      path: "/dashboard/pedidos",
    },
    {
      id: "categories",
      name: "Categorías",
      icon: Tag,
      path: "/dashboard/categorias",
    },
    {
      id: "analytics",
      name: "Análisis",
      icon: BarChart3,
      path: "/dashboard/analytics",
    },
    {
      id: "settings",
      name: "Configuración",
      icon: Settings,
      path: "/dashboard/configuracion",
    },
  ];

  const handleLogout = () => {
    // Aquí implementarías tu lógica de logout real
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-gray-500/30 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-500/30">
          <h1 className="text-xl font-bold text-gray-800">Sistema Ventas</h1>
          <p className="text-xs text-gray-600 mt-1">Panel de Control</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/dashboard" &&
                  location.pathname.startsWith(item.path));
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-gray-500/20 text-gray-800"
                        : "text-gray-700 hover:bg-gray-500/10"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600/80 hover:bg-red-600/10 transition"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
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

        {/* Content - Aquí se renderizan las rutas hijas */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default DashboardLayout;
