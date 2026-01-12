// src/routes/RoutesPrivate.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../store/useSession';
import { useEffect } from 'react';

const RoutesPrivate = () => {
  const { isLoggedIn, checkSession } = useSession();
  const location = useLocation();

  // Verificar la sesión al montar el componente
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!isLoggedIn) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoutesPrivate;