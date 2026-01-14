import type { Product } from '../../types/product.types'
import { api } from '../config'

export const getProductsFn = async () => {
    try {
        const response = await api.get('/productos/')
        return response.data
    } catch (error) {
        throw error 
    }
}

export const postProductFn = async (newProduct: Product) => {
    try {
        // El token ya debería estar configurado en el interceptor de axios
        // o en la configuración global de api
        const response = await api.post('/productos/', newProduct)
        return response.data
    } catch (error) {
        console.error("Error en postProductFn:", error)
        throw error
    }
}