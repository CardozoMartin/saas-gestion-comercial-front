// hooks/useProduct.ts - ACTUALIZADO
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductsFn, postProductFn, putProductFn } from "../api/products/apiProducts"
import { useState } from "react"

interface ProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    categoriaId?: number;
    activo?: boolean;
    sortBy?: "nombre" | "codigo" | "precioVenta" | "fechaCreacion";
    sortOrder?: "asc" | "desc";
}

export const useProduct = (params?: ProductsParams) => {
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', params],
        queryFn: () => getProductsFn(params)
    })

    // Verificar si la respuesta es un array (sin paginación) o un objeto (con paginación)
    const isArrayResponse = Array.isArray(data);

    const { 
        mutate: postProduct, 
        isPending: isPostingProduct, 
        isError: isPostProductError,
        error: postProductError 
    } = useMutation({
        mutationFn: postProductFn,
        onSuccess: (data: any) => { 
            console.log("Producto creado exitosamente:", data)
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error: any) => { 
            console.error("Error al crear producto:", error)
        }
    })

    const { 
        mutate: putProduct, 
        isError: isPutProductError, 
        isPending: isPutProductPending 
    } = useMutation({
        mutationFn: putProductFn,
        onSuccess: (data: any) => { 
            console.log("Producto actualizado exitosamente:", data)
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error: any) => { 
            console.error("Error al actualizar producto:", error)
        }
    })

    return {
        // Desestructurar la respuesta paginada o array simple
        productos: isArrayResponse ? data : (data?.productos || []),
        total: isArrayResponse ? data?.length || 0 : (data?.total || 0),
        page: isArrayResponse ? 1 : (data?.page || 1),
        limit: isArrayResponse ? data?.length || 10 : (data?.limit || 10),
        totalPages: isArrayResponse ? 1 : (data?.totalPages || 0),
        hasNextPage: isArrayResponse ? false : (data?.hasNextPage || false),
        hasPrevPage: isArrayResponse ? false : (data?.hasPrevPage || false),
        // Mantener compatibilidad con código anterior
        AllProducts: isArrayResponse ? data : (data?.productos || []),
        isLoading,
        isError,
        postProduct,
        isPostingProduct,
        isPostProductError,
        postProductError,
        putProduct,
        isPutProductError,
        isPutProductPending
    }
}