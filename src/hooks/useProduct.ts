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

    // Query principal - SE DESACTIVA cuando hay búsqueda activa
    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ['products', params],
        queryFn: () => getProductsFn(params),
        enabled: !params?.search, 
    })

    // Query para búsqueda por nombre o codigo
    const { data: productByNameOrCodeData, isLoading: isLoadingProductByNameOrCode, isError: isErrorProductByNameOrCode } = useQuery({
        queryKey: ['productByNameOrCode', params?.search],
        queryFn: () => getProductosForNameOrCodeFn(params?.search || ""),
        enabled: !!params?.search, 
    })

    // Obtener los productos que están bajo stock
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
            queryClient.invalidateQueries({ queryKey: ['productByNameOrCode'] })
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
            queryClient.invalidateQueries({ queryKey: ['productByNameOrCode'] })
            queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] })
            queryClient.invalidateQueries({ queryKey: ['allProducts'] })
        },
        onError: (error: any) => { 
            console.error("Error al actualizar producto:", error)
        }
    })

    //búsqueda y paginación
    const { mutateAsync: putChangeProductStatus } = useMutation({
        mutationFn: putChangeProductStatusFn,
        
        onMutate: async (productId: number) => {
            // Determinar qué query actualizar según el contexto
            const queryKeyProducts = ['products', params]
            const queryKeySearch = ['productByNameOrCode', params?.search]
            
            // Cancelar refetches
            await queryClient.cancelQueries({ queryKey: queryKeyProducts })
            await queryClient.cancelQueries({ queryKey: queryKeySearch })
            
            // Guardar estados anteriores
            const previousProducts = queryClient.getQueryData(queryKeyProducts)
            const previousSearch = queryClient.getQueryData(queryKeySearch)
            
            //  Actualizar cache de BÚSQUEDA si está activa
            if (params?.search && previousSearch) {
                queryClient.setQueryData(queryKeySearch, (old: any) => {
                    if (!old) return old
                    
                    return {
                        ...old,
                        data: old.data.map((product: any) => 
                            product.id === productId 
                                ? { ...product, activo: !product.activo }
                                : product
                        )
                    }
                })
            }
            
            // Actualizar cache de PRODUCTOS PAGINADOS si no hay búsqueda
            if (!params?.search && previousProducts) {
                queryClient.setQueryData(queryKeyProducts, (old: any) => {
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
            }
            
            return { previousProducts, previousSearch }
        },
        
        onSuccess: (data: any) => {
            console.log("Estado del producto cambiado exitosamente:", data)
        },
        
        onError: (error: any, _productId, context) => {
            console.error("Error al cambiar el estado del producto:", error)
            
            // Revertir cambios
            if (context?.previousProducts) {
                queryClient.setQueryData(['products', params], context.previousProducts)
            }
            if (context?.previousSearch) {
                queryClient.setQueryData(['productByNameOrCode', params?.search], context.previousSearch)
            }
        },
        
        onSettled: () => {
            // Invalidar ambas queries para sincronizar
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['productByNameOrCode'] })
        }
    })

    // Hook para actualizar el stock de un producto
    const usePatchUpdateProductStock = () => {
        return useMutation({
            mutationFn: patchUpdateProductStockFn,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
                queryClient.invalidateQueries({ queryKey: ['productByNameOrCode'] });
            },
            onError: (error) => {
                console.error("Error al actualizar el stock del producto:", error);
            }
        });
    }

    // Hook para buscar un producto por nombre o codigo
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
        productByNameOrCodeData,
        isLoadingProductByNameOrCode,
        isErrorProductByNameOrCode,
    }
}