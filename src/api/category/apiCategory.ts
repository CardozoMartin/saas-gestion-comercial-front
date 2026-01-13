import type { Category } from "../../types/category.types";
import { api } from "../config";


export const getCategoriesFn = async () => {
    try {
        const response = await api.get("/categories/");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const postCategoryFn = async (data: Category)=>{
    try {
        const response = await api.post("/categories/", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const putCategoryFn = async (id: string, data: Category)=>{
    try {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}