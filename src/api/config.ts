import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSession } from "../store/useSession";
import type { DecodedToken } from "../types/auth.types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Verificar si el token está próximo a expirar (menos de 5 minutos)
const isTokenNearExpiry = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Si quedan menos de 5 minutos (300 segundos)
    return timeUntilExpiry < 300;
  } catch {
    return false;
  }
};



// Interceptor de REQUEST - Agregar token y verificar validez
api.interceptors.request.use(
  (config) => {
    const { token, logout, checkSession } = useSession.getState();
    
    if (token) {
      // Verificar validez del token
      const isValid = checkSession();
      
      if (!isValid) {
        console.error('❌ Token expirado detectado en request');
        logout();
        window.location.href = '/login';
        return Promise.reject(new Error('Token expirado'));
      }
      
      // Advertir si el token está próximo a expirar
      if (isTokenNearExpiry(token)) {
        console.warn('⚠️ Token próximo a expirar (menos de 5 minutos)');
        // Aquí podrías implementar lógica de renovación automática si tu backend lo soporta
      }
      
      // Asignar token al header
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { logout } = useSession.getState();
    
    // Si el servidor responde con 401 (No autorizado)
    if (error.response?.status === 401) {
      console.error('❌ Error 401: Token inválido o expirado');
      
      // Limpiar sesión
      logout();
      
      // Redirigir al login
      window.location.href = '/login';
      
      return Promise.reject(new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'));
    }
    
    // Si el servidor responde con 403 (Forbidden - sin permisos)
    if (error.response?.status === 403) {
      console.error('❌ Error 403: Sin permisos suficientes');
      window.location.href = '/dashboard/acceso-denegado';
      return Promise.reject(new Error('No tienes permisos para realizar esta acción.'));
    }
    
    return Promise.reject(error);
  }
);