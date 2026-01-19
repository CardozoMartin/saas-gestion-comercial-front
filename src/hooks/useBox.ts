import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { closeBoxFn, getBoxByUserFn, getBoxDatailByUserFn, getVerifyOpenBoxByUserFn, postOpenBoxFn } from "../api/boxes/apiBox";

export const useBox = () => {
    const queryClient = useQueryClient();

    const {
        mutate: postOpenBox,
        isPending: isPostingBox,
        isError: isPostBoxError,
        error: postBoxError,
    } = useMutation({
        mutationFn: postOpenBoxFn,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['boxByUser'] });
            queryClient.invalidateQueries({ queryKey: ['boxDetailByUser'] });
            queryClient.invalidateQueries({ queryKey: ['verifyOpenBoxByUser'] });
        },
        onError: (error: any) => {
            console.error("Error al abrir caja:", error);
        },
    });

    // Función para obtener la caja abierta por usuario
    const useBoxByUser = (userId: number) => {
        return useQuery({
            queryKey: ['boxByUser', userId],
            queryFn: () => getBoxByUserFn(userId),
            enabled: !!userId && userId > 0,
            staleTime: 1000 * 60 * 5,
            retry: 1,
        });
    };
    //Funcion para obtener si el usuario tiene caja abierta
    const useVerifyOpenBoxByUser = (userId: number) => {
        return useQuery({
            queryKey: ['verifyOpenBoxByUser', userId],
            queryFn: () => getVerifyOpenBoxByUserFn(userId),
            enabled: !!userId && userId > 0,
            staleTime: 1000 * 60 * 5,
            retry: 1,
        });
    }

    // Agregar parámetro options para poder pasar { enabled: false }
    const useBoxDetailByUser = (userId: number, options = {}) => {
        return useQuery({
            queryKey: ['boxDetailByUser', userId],
            queryFn: () => getBoxDatailByUserFn(userId),
            enabled: !!userId && userId > 0,
            staleTime: 1000 * 60 * 5,
            retry: 1,
            ...options, 
        });
    }


    const {
        mutate: closeBox,
        isPending: isClosingBox,
        isError: isCloseBoxError,
        error: closeBoxError,
    } = useMutation({
        mutationFn: ({ boxId, data }: { boxId: number; data: any }) => closeBoxFn(boxId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boxByUser'] });
            queryClient.invalidateQueries({ queryKey: ['boxDetailByUser'] });
            queryClient.invalidateQueries({ queryKey: ['verifyOpenBoxByUser'] });
        },
        onError: (error: any) => {
            console.error("Error al cerrar caja:", error);
        },
    });

    return {
        postOpenBox,
        isPostingBox,
        isPostBoxError,
        postBoxError,
        useBoxByUser,
        useBoxDetailByUser,
        closeBox,
        isClosingBox,
        isCloseBoxError,
        closeBoxError,
        useVerifyOpenBoxByUser
    };
};