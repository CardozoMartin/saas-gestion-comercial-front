// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutesPublic from "./routes/RoutesPublic";
import RoutesPrivate from "./routes/RoutesPrivate";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayaout";
import DashboardHome from "./pages/DashboardHome";
import ProductosPage from "./pages/ProductosPage";
import FormProducto from "./components/Producto/FormProducto";
import VentasPage from "./pages/VentasPage";
import ClientesPage from "./pages/ClientesPage";
import PedidosPage from "./pages/PedidosPage";
import CategoriasPage from "./pages/CategoriasPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsuariosPage from "./pages/UsuariosPage";
import UnitsPage from "./pages/UnitsPage";
import PointSale from "./pages/PointSale";
import AccounteDetails from "./components/Cliente/AccounteDetails";
import { ROLES } from "./config/permissions";
import PageUpdateStock from "./pages/PageUpdateStock";

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
            
            {/* Productos - Admin y Vendedor */}
            <Route 
              path="productos" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO]}>
                  <ProductosPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Agregar producto - Solo Admin */}
            <Route 
              path="agregar" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO]}>
                  <FormProducto />
                </ProtectedRoute>
              } 
            />
            
            {/* Ventas - Todos */}
            <Route 
              path="ventas" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.CAJERO]}>
                  <VentasPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Clientes - Admin y Vendedor */}
            <Route 
              path="clientes" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO]}>
                  <ClientesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Pedidos - Admin y Vendedor */}
            <Route 
              path="pedidos" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO]}>
                  <PedidosPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Categorías - Solo Admin */}
            <Route 
              path="categorias" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                  <CategoriasPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Analytics - Solo Admin */}
            <Route 
              path="analytics" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Usuarios - Solo Admin */}
            <Route 
              path="usuarios" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                  <UsuariosPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Unidades - Solo Admin */}
            <Route 
              path="unidades" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                  <UnitsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Punto de Venta - Admin y Cajero */}
            <Route 
              path="punto-venta" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO, ROLES.VENDEDOR]}>
                  <PointSale />
                </ProtectedRoute>
              } 
            />
            
            {/* Account Details - Todos */}
            <Route 
              path="account-details" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.CAJERO]}>
                  <AccounteDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="update-stock" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.CAJERO]}>
                  <PageUpdateStock  />
                </ProtectedRoute>
              } 
            />

            {/* Página de acceso denegado */}
            <Route path="acceso-denegado" element={<AccessDenied />} />
          </Route>
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
// Componente de Acceso Denegado
const AccessDenied = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
      <p className="text-gray-600 mb-4">
        No tienes permisos para acceder a esta página
      </p>
      <a 
        href="/dashboard" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Volver al Dashboard
      </a>
    </div>
  </div>
);

// Componente para 404
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">Página no encontrada</p>
    </div>
  </div>
);

export default App;
