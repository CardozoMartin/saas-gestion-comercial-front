import type { LoginCredentials } from "../../types/auth.types";
import { api } from "../config";


export const postLoginFn = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("/usuarios/auth/login", credentials);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
