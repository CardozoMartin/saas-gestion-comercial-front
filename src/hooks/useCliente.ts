import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClienteConDeudasFn, getClientesFn, getResumenCuentaCorrienteFn, patchChangeStateClienteFn, postClienteFn } from "../api/clientes/apiClients";

export const useCliente = () => {
    const queryClient = useQueryClient();

    // Hook para obtener los clientes
    const useGetClientes = () => {
        return useQuery({
            queryKey: ['clientes'],
            queryFn: getClientesFn,
            staleTime: 1000 * 60 * 5, 
            retry: 1, 
        });
    };

    //obtener clientes con deudas
    const useGetClientesConDeudas = () => {
        return useQuery({
            queryKey: ['clientesConDeudas'],
            queryFn: getClienteConDeudasFn,
            staleTime: 1000 * 60 * 5,
            retry: 1,
        });
    }

    const useGetCuentaCorrienteCliente = (clienteId: number) => {
        return useQuery({
            queryKey: ['cuentaCorriente', clienteId],
            queryFn: () => getResumenCuentaCorrienteFn(clienteId),
            enabled: !!clienteId && clienteId > 0, 
            staleTime: 1000 * 60 * 5,
            retry: 1,
        }); 
    }

    const usePostCliente = () => {
        return useMutation({
            mutationFn: postClienteFn,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['clientes'] });
            },
            onError: (error) => {
                console.error("Error al crear el cliente:", error);
            }
        });
    }

    //Hook para cambiar el estado activo/inactivo del cliente
    const usePatchChangeStateCliente = () => {
        return useMutation({
            mutationFn: patchChangeStateClienteFn,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['clientes'] });
            },
            onError: (error) => {
                console.error("Error al cambiar el estado del cliente:", error);
            }
        });
    }

    return {
        useGetClientes,
        useGetCuentaCorrienteCliente,
        useGetClientesConDeudas,
        usePostCliente,
        usePatchChangeStateCliente
    };
};