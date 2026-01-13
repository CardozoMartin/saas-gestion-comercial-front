// src/routes/RoutesPrivate.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../store/useSession';
import { useEffect, useState } from 'react';

const RoutesPrivate = () => {
  const { isLoggedIn, checkSession } = useSession();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Verificar la sesión al montar el componente
  useEffect(() => {
    const check = checkSession();
    setIsChecking(false);
    console.log("Session check result:", check);
  }, [checkSession]);

  // Mostrar un loading mientras se verifica la sesión
  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!isLoggedIn) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoutesPrivate;