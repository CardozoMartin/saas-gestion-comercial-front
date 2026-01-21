// api/products/apiProducts.ts - ACTUALIZADO
import type { Product, ProductUpdate } from "../../types/product.types";
import { api } from "../config";

interface ProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    categoriaId?: number;
    activo?: boolean;
    sortBy?: string;
    sortOrder?: string;
}

export const getProductsFn = async (params?: ProductsParams) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.categoriaId) queryParams.append('categoriaId', params.categoriaId.toString());
        if (params?.activo !== undefined) queryParams.append('activo', params.activo.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        
        const response = await api.get(`/productos/?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getProductAllFn = async ()=>{
    try {
        const response = await api.get("/productos/allproducts/");
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const postProductFn = async (newProduct: Product) => {
    try {
        const response = await api.post("/productos/", newProduct);
        return response.data;
    } catch (error) {
        console.error("Error en postProductFn:", error);
        throw error;
    }
};
export const putProductFn = async (updatedProduct: ProductUpdate) => {
    try {
        const { id, ...productData } = updatedProduct;
        const response = await api.put(`/productos/${id}/`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const putChangeProductStatusFn = async (id: number) => {
    try {
        const response = await api.put(`/productos/change-status/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getProductLowStockFn = async () =>{
    try {
        const response = await api.get("/productos/lowstock/");
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const patchUpdateProductStockFn = async ({ id, newStock }: { id: number, newStock: number }) => {
    try {
        const response = await api.patch(`/productos/${id}/stock/`, { cantidad: newStock });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getProductosForNameOrCodeFn = async (search: string) => {
    try {
        const response = await api.get('/productos/product/nameorcode', {
            params: { search }  // Se convierte en ?search=valor
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}