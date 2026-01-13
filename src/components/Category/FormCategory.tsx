import { useForm } from 'react-hook-form';
import { useCategory } from '../../hooks/useCategory';
import type { Category } from '../../types/category.types';

export default function FormCategory() {

    const { postCategory,
        isPostingCategory,
        isPostCategoryError} = useCategory()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            nombre: '',
            descripcion: ''
        }
    });

    const onSubmit = (data : Category) => {
        console.log('Categoría guardada:', data);
        postCategory(data);
        reset();
    };

    return (
        <div className="mt-6">
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Nombre
                    </label>
                    <input
                        placeholder="Ingrese el nombre de la categoría"
                        className={`w-full px-3 py-2.5 text-sm bg-white border ${
                            errors.nombre 
                                ? 'border-red-400 focus:border-red-500' 
                                : 'border-gray-500/30 focus:border-gray-500/50'
                        } rounded-md text-gray-800 outline-none transition`}
                        type="text"
                        {...register('nombre', {
                            required: 'El nombre es requerido',
                            minLength: {
                                value: 3,
                                message: 'El nombre debe tener al menos 3 caracteres'
                            }
                        })}
                    />
                    {errors.nombre && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.nombre.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Descripción
                    </label>
                    <textarea
                        placeholder="Ingrese la descripción de la categoría"
                        className={`w-full px-3 py-2.5 text-sm bg-white border ${
                            errors.descripcion 
                                ? 'border-red-400 focus:border-red-500' 
                                : 'border-gray-500/30 focus:border-gray-500/50'
                        } rounded-md text-gray-800 outline-none resize-none transition`}
                        rows="3"
                        {...register('descripcion', {
                            required: 'La descripción es requerida',
                            minLength: {
                                value: 10,
                                message: 'La descripción debe tener al menos 10 caracteres'
                            }
                        })}
                    />
                    {errors.descripcion && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.descripcion.message}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-2 mt-6">
                <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
                >
                    Guardar Categoría
                </button>
                <button
                    type="button"
                    onClick={() => reset()}
                    className="px-4 py-2.5 text-sm font-medium text-gray-800/80 bg-gray-500/20 rounded-md hover:bg-gray-500/30 transition"
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
}