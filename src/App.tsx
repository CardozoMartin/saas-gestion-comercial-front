// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutesPublic from "./routes/RoutesPublic";
import RoutesPrivate from "./routes/RoutesPrivate";
import LoginPage from "./pages/LoginPage";
import SalesDashboard from "./pages/SalesDashboard";

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
          <Route path="/dashboard" element={<SalesDashboard />} />
          {/* Agrega más rutas privadas aquí */}
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
