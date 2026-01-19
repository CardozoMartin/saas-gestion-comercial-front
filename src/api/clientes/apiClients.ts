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
        const response = await api.get(`/clientes/${clienteId}/cuenta-corriente`);
        return response.data;

    } catch (error) {
        throw error;
    }
}

export const getClienteConDeudasFn = async () => {
    try {
        const res = await api.get('/clientes/clientescondeudas');
        return res.data;
    } catch (error) {
        throw error;
    }
}