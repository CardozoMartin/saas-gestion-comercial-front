import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductsFn, postProductFn } from "../api/products/apiProducts"

export const useProduct = () => {
    const queryClient = useQueryClient()

    const { data: AllProducts, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: getProductsFn
    })

    const { 
        mutate: postProduct, 
        isPending: isPostingProduct, 
        isError: isPostProductError,
        error: postProductError 
    } = useMutation({
        mutationFn: postProductFn,
        onSuccess: (data: any) => { 
            console.log("Producto creado exitosamente:", data)
            // Invalida el cache para refrescar la lista de productos
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error: any) => { 
            console.error("Error al crear producto:", error)
            console.error("Detalles del error:", error.response?.data)
        }
    })

    return {
        AllProducts,
        isLoading,
        isError,
        postProduct,
        isPostingProduct,
        isPostProductError,
        postProductError
    }
}