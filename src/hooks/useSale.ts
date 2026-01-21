import { useMutation } from "@tanstack/react-query"
import { postSaleFn } from "../api/sales/apiSales"


export const useSale = () => {

    const { mutateAsync: postSale, isPending: isPostingSale, isError: isPostSaleError, error: postSaleError } = useMutation({
        mutationFn: postSaleFn,
        onSuccess: (data: any) => {},
        onError: (error: any) => {
            console.log(error.response.data.error);
        }
    })


    return {
        postSale,
        isPostingSale,
        isPostSaleError,
        postSaleError
    }
}