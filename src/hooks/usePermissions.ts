import { useSession } from '../store/useSession';
import { canAccessRoute, ROLES } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useSession();
  
  const userRole = user?.rol?.[0]?.nombre?.toLowerCase() ?? '';

  const hasRole = (roles: string[]): boolean => {
    return roles.some(role => role.toLowerCase() === userRole);
  };

  const canAccess = (route: string): boolean => {
    return canAccessRoute(userRole, route);
  };

  const isAdmin = userRole === ROLES.ADMIN;
  const isVendedor = userRole === ROLES.VENDEDOR;
  const isCajero = userRole === ROLES.CAJERO;

  return {
    userRole,
    hasRole,
    canAccess,
    isAdmin,
    isVendedor,
    isCajero
  };
};