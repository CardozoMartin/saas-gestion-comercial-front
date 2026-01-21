
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductAllFn, getProductLowStockFn, getProductosForNameOrCodeFn, getProductsFn, patchUpdateProductStockFn, postProductFn, putChangeProductStatusFn, putProductFn } from "../api/products/apiProducts"

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

    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ['products', params],
        queryFn: () => getProductsFn(params)
    })

    //obtener los productos que estan bajo stock
    const { data: lowStockProductsData, isLoading: isLoadingLowStockProducts, isError: isErrorLowStockProducts } = useQuery({
        queryKey: ['lowStockProducts'],
        queryFn: () => getProductLowStockFn(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    const { data: allProductsData, isLoading: isLoadingAllProducts, isError: isErrorAllProducts } = useQuery<any>({
        queryKey: ['allProducts'],
        queryFn: () => getProductAllFn(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

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

    // MUTACIÓN CON ACTUALIZACIÓN
    const { mutateAsync: putChangeProductStatus } = useMutation({
        mutationFn: putChangeProductStatusFn,
        
        // Antes de la mutación - actualizar UI inmediatamente
        onMutate: async (productId: number) => {
            // Cancelar cualquier refetch en progreso
            await queryClient.cancelQueries({ queryKey: ['products'] })
            
            // Guardar estado anterior para rollback
            const previousData = queryClient.getQueryData(['products', params])
            
            // Actualizar cache optimistamente
            queryClient.setQueryData(['products', params], (old: any) => {
                if (!old) return old
                
                // Si es array simple
                if (Array.isArray(old)) {
                    return old.map((product: any) => 
                        product.id === productId 
                            ? { ...product, activo: !product.activo }
                            : product
                    )
                }
                
                // Si es objeto paginado
                return {
                    ...old,
                    productos: old.productos.map((product: any) => 
                        product.id === productId 
                            ? { ...product, activo: !product.activo }
                            : product
                    )
                }
            })
            
            return { previousData }
        },
        
        // Si hay éxito
        onSuccess: (data: any) => {
            console.log("Estado del producto cambiado exitosamente:", data)
        },
        
        // Si hay error - revertir cambios
        onError: (error: any, _productId, context) => {
            console.error("Error al cambiar el estado del producto:", error)
            
            // Revertir al estado anterior
            if (context?.previousData) {
                queryClient.setQueryData(['products', params], context.previousData)
            }
        },
        
        // Siempre ejecutar al final - sincronizar con servidor
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    //hook para acutalizar el stock de un producto
    const usePatchUpdateProductStock = () => {
        return useMutation({
            mutationFn:patchUpdateProductStockFn,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
            },
            onError: (error) => {
                console.error("Error al actualizar el stock del producto:", error);
            }
        });
    }

    //hook para buscar un producto por nombre o codigo de query params
    const useGetProductsBySearch = (searchTerm: string) => {
        return useQuery({
            
            queryKey: ['productsBySearch', searchTerm],
            queryFn: () => getProductosForNameOrCodeFn(searchTerm),
            enabled: !!searchTerm && searchTerm.length > 0,
        });
    }

    return {
        productos: isArrayResponse ? data : (data?.productos || []),
        total: isArrayResponse ? data?.length || 0 : (data?.total || 0),
        page: isArrayResponse ? 1 : (data?.page || 1),
        limit: isArrayResponse ? data?.length || 10 : (data?.limit || 10),
        totalPages: isArrayResponse ? 1 : (data?.totalPages || 0),
        hasNextPage: isArrayResponse ? false : (data?.hasNextPage || false),
        hasPrevPage: isArrayResponse ? false : (data?.hasPrevPage || false),
        AllProducts: isArrayResponse ? data : (data?.productos || []),
        isLoading,
        isError,
        postProduct,
        isPostingProduct,
        isPostProductError,
        postProductError,
        putProduct,
        isPutProductError,
        isPutProductPending,
        allProductsData,
        isLoadingAllProducts,
        isErrorAllProducts,
        putChangeProductStatus,
        lowStockProductsData,
        isLoadingLowStockProducts,
        isErrorLowStockProducts,
        usePatchUpdateProductStock,
        useGetProductsBySearch,

    }
}