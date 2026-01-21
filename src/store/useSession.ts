// src/store/useSession.ts
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken, User, AuthState } from "../types/auth.types";

const STORAGE_KEY = "token";

// Verifica si un token JWT ha expirado

const isTokenExpired = (exp: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
};

// Inicializa el estado de autenticación desde sessionStorage

const initializeAuth = (): AuthState => {
  const token = sessionStorage.getItem(STORAGE_KEY);

  if (!token) {
    return {
      user: null,
      isLoggedIn: false,
      token: null,
    };
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    console.log("Decoded token:", decoded);

    // Verificar si el token ha expirado
    if (!decoded.exp || isTokenExpired(decoded.exp)) {
      console.warn("Token expirado, limpiando sesión");
      sessionStorage.removeItem(STORAGE_KEY);
      return {
        user: null,
        isLoggedIn: false,
        token: null,
      };
    }

    // Token válido
    return {
      user: {
        userId: decoded.id,
        email: decoded.email,
        nombre: decoded.nombre,
        rol: decoded.roles,
      },
      isLoggedIn: true,
      token,
    };
  } catch (error) {
    console.error("Error al decodificar token:", error);
    sessionStorage.removeItem(STORAGE_KEY);
    return {
      user: null,
      isLoggedIn: false,
      token: null,
    };
  }
};

interface SessionStore extends AuthState {
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkSession: () => boolean;
}

export const useSession = create<SessionStore>((set) => ({
  ...initializeAuth(),

  login: (userData: User, token: string) => {
    sessionStorage.setItem(STORAGE_KEY, token);

    // Combine provided userData with decoded token payload so we have
    // `nombre` and `rol` available immediately after login (no refresh needed)
    let finalUser: User = userData;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      finalUser = {
        userId: decoded.id || userData.userId,
        email: decoded.email || userData.email,
        nombre: decoded.nombre || (userData as any).nombre,
        rol: decoded.roles || (userData as any).rol,
      } as User;
    } catch (err) {
      console.warn("Failed to decode token during login:", err);
    }

    set({
      user: finalUser,
      isLoggedIn: true,
      token,
    });
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      isLoggedIn: false,
      token: null,
    });
  },

  checkSession: () => {
    const token = sessionStorage.getItem(STORAGE_KEY);

    if (!token) {
      set({ user: null, isLoggedIn: false, token: null });
      return false;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (!decoded.exp || isTokenExpired(decoded.exp)) {
        sessionStorage.removeItem(STORAGE_KEY);
        set({ user: null, isLoggedIn: false, token: null });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      sessionStorage.removeItem(STORAGE_KEY);
      set({ user: null, isLoggedIn: false, token: null });
      return false;
    }
  },
}));
