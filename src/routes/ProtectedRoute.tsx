import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../store/useSession';
import { canAccessRoute } from '../config/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user } = useSession();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifican roles requeridos, verificar
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = user.rol[0]?.nombre?.toLowerCase();
    console.log('User Role:', userRole);
    const hasPermission = requiredRoles.some(role => 
      role.toLowerCase() === userRole
    );

    if (!hasPermission) {
      // Redirigir a página de acceso denegado o dashboard
      return <Navigate to="/dashboard/acceso-denegado" replace />;
    }
  }

  // También verificar por la ruta actual
  const userRole = user.rol[0]?.nombre?.toLowerCase();
  if (!canAccessRoute(userRole, location.pathname)) {
    return <Navigate to="/dashboard/acceso-denegado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;