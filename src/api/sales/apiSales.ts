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
