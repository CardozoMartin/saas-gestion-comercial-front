import { useQuery } from "@tanstack/react-query"
import { getUnitsFn } from "../api/units/apiUnits"


export const useUnits = () => {

    //Hook para obtener las unidades de medida
    const {data: units, isLoading, isError, refetch} = useQuery({
        queryKey: ['units'],
        queryFn: getUnitsFn,
        staleTime: 1000 * 60 * 5, 
    })


    return {units, isLoading, isError, refetch}
}