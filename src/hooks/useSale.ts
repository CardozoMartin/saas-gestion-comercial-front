import { useMutation, useQuery } from "@tanstack/react-query"
import { getSaleForByIdFn, postSaleFn, putSaleDeatailsFn } from "../api/sales/apiSales"


export const useSale = () => {

    const { mutateAsync: postSale, isPending: isPostingSale, isError: isPostSaleError, error: postSaleError } = useMutation({
        mutationFn: postSaleFn,
        onSuccess: () => {},
        onError: (error: any) => {
            console.log(error.response?.data?.error);
        }
    })

    //hook para acutalizar detalles de venta
    const { mutateAsync: putSaleDetails, isPending: isPuttingSaleDetails, isError: isPutSaleDetailsError, error: putSaleDetailsError } = useMutation({
        mutationFn: (data: {saleId: number, updateData: any}) => putSaleDeatailsFn(data.saleId, data.updateData),
        onSuccess: () => {},
        onError: (error: any) => {
            console.log(error.response?.data?.error);
        }
    })

    //hook para obtener una venta por su id
    const getSaleById = (saleId: number) => {
        return useQuery({
            queryKey: ['saleById', saleId],
            queryFn: () => getSaleForByIdFn(saleId),
            enabled: !!saleId,
        })
    }


    return {
        postSale,
        isPostingSale,
        isPostSaleError,
        postSaleError,
        putSaleDetails,
        isPuttingSaleDetails,
        isPutSaleDetailsError,
        putSaleDetailsError,
        getSaleById,

    }
}