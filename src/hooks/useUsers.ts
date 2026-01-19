import { useMutation } from "@tanstack/react-query";
import { postUserFn } from "../api/users/apiUsers";

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

  return {
    usePostUser,
  };
};
