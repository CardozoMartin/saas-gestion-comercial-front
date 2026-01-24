// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import RoutesPublic from "./routes/RoutesPublic";
import RoutesPrivate from "./routes/RoutesPrivate";
import ProtectedRoute from "./routes/ProtectedRoute";
import SessionHandler from "./components/SessionHandler";
import { ROLES } from "./config/permissions";

// Solo cargar estas páginas críticas al inicio
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayaout";
import EditSalePage from "./pages/EditSalePage";

// Lazy load del resto de páginas
const ProductosPage = lazy(() => import("./pages/ProductosPage"));
const FormProducto = lazy(() => import("./components/Producto/FormProducto"));
const VentasPage = lazy(() => import("./pages/VentasPage"));
const ClientesPage = lazy(() => import("./pages/ClientesPage"));
const PedidosPage = lazy(() => import("./pages/PedidosPage"));
const CategoriasPage = lazy(() => import("./pages/CategoriasPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const UsuariosPage = lazy(() => import("./pages/UsuariosPage"));
const UnitsPage = lazy(() => import("./pages/UnitsPage"));
const PointSale = lazy(() => import("./pages/PointSale"));
const AccounteDetails = lazy(() => import("./components/Cliente/AccounteDetails"));
const PageUpdateStock = lazy(() => import("./pages/PageUpdateStock"));

// Componente de carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      {/* Manejador de eventos de sesión global */}
      <SessionHandler />
      
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<RoutesPublic />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Rutas privadas */}
          <Route element={<RoutesPrivate />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<PointSale />} />
              
              <Route 
                path="productos" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <ProductosPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="agregar" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO]}>
                    <FormProducto />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="ventas" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.CAJERO]}>
                    <VentasPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="ventas/editar" 
                element={<EditSalePage />} 
              />
              
              <Route 
                path="clientes" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO]}>
                    <ClientesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="pedidos" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO]}>
                    <PedidosPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="categorias" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <CategoriasPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="analytics" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="usuarios" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <UsuariosPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="unidades" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <UnitsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="punto-venta" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.CAJERO, ROLES.VENDEDOR]}>
                    <PointSale />
                  </ProtectedRoute>
                } 
              />
              
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
                    <PageUpdateStock />
                  </ProtectedRoute>
                } 
              />

              <Route path="acceso-denegado" element={<AccessDenied />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

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

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">Página no encontrada</p>
    </div>
  </div>
);

export default App;