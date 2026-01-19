import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClienteConDeudasFn, getClientesFn, getResumenCuentaCorrienteFn } from "../api/clientes/apiClients";

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

    return {
        useGetClientes,
        useGetCuentaCorrienteCliente,
        useGetClientesConDeudas
    };
};