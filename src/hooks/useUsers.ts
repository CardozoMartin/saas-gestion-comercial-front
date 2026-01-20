import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsersFn, postUserFn } from "../api/users/apiUsers";

export const useUsers = () => {
  //hook para crear un usuario
  const usePostUser = () => {
    return useMutation({
      mutationFn: postUserFn,
      onSuccess: () => {
        // Aquí podrías invalidar queries relacionadas con usuarios si las tienes
      },
      onError: (error) => {
        console.error("Error al crear el usuario:", error);
      },
    });
  };
  //hook para obtener todos los usuarios
  const useGetUsers = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: getUsersFn,
      staleTime: 1000 * 60 * 5, 
      retry: 1, 
    });
  }

  return {
    usePostUser,
    useGetUsers,
  };
};
