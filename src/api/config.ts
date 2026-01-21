import axios from "axios";
import { useSession } from "../store/useSession";





export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar un interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const { token } = useSession.getState();
    if (token) {
      // asignar de forma segura para evitar problemas de tipos con AxiosHeaders
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
