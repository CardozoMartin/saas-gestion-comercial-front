import { useMutation, useQuery } from "@tanstack/react-query"
import { getCategoriesFn, postCategoryFn, putCategoryFn } from "../api/category/apiCategory"


export const useCategory = () => {

    const { data: AllCategories, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategoriesFn
    })

    

    //useMutatio para crear una categoria
    const { mutate: postCategory, isPending: isPostingCategory, isError: isPostCategoryError } = useMutation({
        mutationFn: postCategoryFn,
        onSuccess: (data) => {
            console.log("Category created successfully:", data);
        },
        onError: (error: any) => {
            console.error("Error creating category:", error);
        }
    })
    //useMutation para editar una categoria
    const { mutate: putCategory, isPending: isPuttingCategory, isError: isPutCategoryError } = useMutation({
        mutationFn: putCategoryFn,
        onSuccess: (data) => {
            console.log("Category updated successfully:", data);
        },
        onError: (error: any) => {
            console.error("Error updating category:", error);
        }
    })


    return {
        AllCategories,
        isLoading,
        isError,
        postCategory,
        isPostingCategory,
        isPostCategoryError,
        putCategory,
        isPuttingCategory,
        isPutCategoryError
    }
}