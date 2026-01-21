
export const ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  CAJERO: 'cajero'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Define qué rutas puede acceder cada rol
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/dashboard': [ROLES.ADMIN],
  '/dashboard/productos': [ROLES.ADMIN],
  '/dashboard/agregar': [ROLES.ADMIN],
  '/dashboard/ventas': [ROLES.ADMIN],
  '/dashboard/clientes': [ROLES.ADMIN, ROLES.CAJERO],
  '/dashboard/pedidos': [ROLES.ADMIN, ROLES.CAJERO],
  '/dashboard/categorias': [ROLES.ADMIN],
  '/dashboard/analytics': [ROLES.ADMIN],
  '/dashboard/usuarios': [ROLES.ADMIN],
  '/dashboard/unidades': [ROLES.ADMIN],
  '/dashboard/punto-venta': [ROLES.ADMIN, ROLES.CAJERO],
  '/dashboard/account-details': [ROLES.ADMIN, ROLES.CAJERO],
    '/dashboard/update-stock': [ROLES.ADMIN],
};

// Función para verificar si un rol tiene acceso a una ruta
export const canAccessRoute = (userRole: string, route: string): boolean => {
  const allowedRoles = ROUTE_PERMISSIONS[route];
  return allowedRoles ? allowedRoles.includes(userRole as Role) : false;
};