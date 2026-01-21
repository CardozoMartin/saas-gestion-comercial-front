import { useQuery } from "@tanstack/react-query"
import { getRecaudadoPorMesFn, getRecaudadoPorSemanaFn } from "../api/recaudado/apiRecaudado"


export const useRecaudado = () => {

    //obtener los recaudado por mes
    const { data: recaudadoPorMesData, isLoading: isLoadingRecaudadoPorMes, isError: isErrorRecaudadoPorMes } = useQuery({
        queryKey: ['recaudadoPorMes'],
        queryFn: () => getRecaudadoPorMesFn(),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    //obtener los recaudado por semana
    const { data: recaudadoPorSemanaData, isLoading: isLoadingRecaudadoPorSemana, isError: isErrorRecaudadoPorSemana } = useQuery({
        queryKey: ['recaudadoPorSemana'],
        queryFn: () => getRecaudadoPorSemanaFn(),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    return {
        recaudadoPorMesData,
        isLoadingRecaudadoPorMes,
        isErrorRecaudadoPorMes,
        recaudadoPorSemanaData,
        isLoadingRecaudadoPorSemana,
        isErrorRecaudadoPorSemana,
    }
}