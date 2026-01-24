import { api } from "../config"


export const postSaleFn = async (newSale: any) => {
    try {
        const response = await api.post("/ventas/", newSale);
        return response.data;
    } catch (error) {
        console.log((error as any)?.response?.data?.error);
        throw error;
    }
}
export const putSaleDeatailsFn = async (saleId: number, updateData: any) => {
    try {
        const response = await api.put(`/ventas/${saleId}/detalles`, updateData);
        return response.data;
    } catch (error) {
        
    }
}


export const getSaleForByIdFn = async (saleId: number) => {
    try {
        const response = await api.get(`/ventas/${saleId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}