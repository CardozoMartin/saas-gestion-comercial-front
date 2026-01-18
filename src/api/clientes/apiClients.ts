import { api } from '../config';


export const getClientesFn = async () => {
    try {
        const response = await api.get('/clientes');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getResumenCuentaCorrienteFn = async (clienteId: number) => {
    try {
        const response = await api.get(`/clientes/cuenta-corriente/${clienteId}`);
        return response.data;

    } catch (error) {
        throw error;
    }
}