// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { postLoginFn } from "../api/auth/auth";
import { useSession } from "../store/useSession";
import type {
  LoginCredentials,
  LoginResponse,
  ApiError,
} from "../types/auth.types";

export const useAuth = () => {
  const { login: setSession } = useSession();

  const {
    mutate: postLogin,
    isPending,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation<LoginResponse, ApiError, LoginCredentials>({
    mutationFn: postLoginFn,
    onSuccess: (data) => {
      console.log("Login successful:", data);

      // Guardar sesión en el store
      setSession(data.user, data.token);
    
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    postLogin,
    isPending,
    isError,
    isSuccess,
    error,
    data,
  };
};
