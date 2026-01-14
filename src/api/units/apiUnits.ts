import { api } from "../config"

export const getUnitsFn = async ()=>{
    try {
        const res = await api.get('/units/')
        return res.data
    } catch (error) {
       throw error 
    }
}