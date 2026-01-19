// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutesPublic from "./routes/RoutesPublic";
import RoutesPrivate from "./routes/RoutesPrivate";
import LoginPage from "./pages/LoginPage";
import SalesDashboard from "./pages/SalesDashboard";
import Producto from "./components/Producto/Producto";
import FormProducto from "./components/Producto/FormProducto";
import DashboardLayout from "./pages/DashboardLayaout";
import DashboardHome from "./pages/DashboardHome";
import ProductosPage from "./pages/ProductosPage";
import VentasPage from "./pages/VentasPage";
import ClientesPage from "./pages/ClientesPage";
import PedidosPage from "./pages/PedidosPage";
import CategoriasPage from "./pages/CategoriasPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ConfiguracionPage from "./pages/UsuariosPage";
import UnitsPage from "./pages/UnitsPage";
import PointSale from "./pages/PointSale";
import AccounteDetails from "./components/Cliente/AccounteDetails";
import UsuariosPage from "./pages/UsuariosPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<RoutesPublic />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<RoutesPrivate />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="agregar" element={<FormProducto />} /> 
            <Route path="ventas" element={<VentasPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="pedidos" element={<PedidosPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="unidades" element={<UnitsPage />} />
            <Route path="punto-venta" element={<PointSale />} />
            <Route path="account-details" element={<AccounteDetails />} />
          </Route>
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Componente simple para 404
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">Página no encontrada</p>
    </div>
  </div>
);

export default App;
