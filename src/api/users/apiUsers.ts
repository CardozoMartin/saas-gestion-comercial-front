import { api } from "../config";


export const postUserFn = async (userData: any) => {
    try {
        const response = await api.post('/usuarios/', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUsersFn = async () => {
    try {
        const response = await api.get('/usuarios/');
        return response.data;
    } catch (error) {
        throw error;
    }   
}