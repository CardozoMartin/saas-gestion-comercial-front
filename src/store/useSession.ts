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
        userId: decoded.userId,
        email: decoded.email,
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
    set({
      user: userData,
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
