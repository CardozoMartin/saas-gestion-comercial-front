import { api} from '../config' 



export const getRecaudadoPorMesFn = async () => {
    try {
        const response = await api.get('/recaudado/pormes');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRecaudadoPorSemanaFn = async () => {
    try {
        const response = await api.get('/recaudado/porsemana');
        return response.data;
    } catch (error) {
        throw error;
    }
}