import React from 'react'
import { useForm } from 'react-hook-form'
import { usePayment } from '../../hooks/usePayment'
import Swal from 'sweetalert2'

const PaymenteModal = ({ isOpen, onClose, clienteId, saldoActual, isPendingPay, isErrorPay }) => {

    const { postPayment } = usePayment()
  
    const {handleSubmit: handleSubmitRHF, register, formState: { errors }, reset } = useForm()

    const handleSubmit = (data: any) => {
        console.log('Submitting payment for clienteId:', clienteId, 'with data:', data);

        // Aquí deberías llamar a tu función de pago
        Swal.fire({
            title: '¿Confirmar pago?',
            text: `Estás a punto de registrar un pago de ${data.amount} para el cliente.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar'
        }).then((result) => {
            if (result.isConfirmed) {
                const paymentData = {
                    clienteId,
                    ...data,
                };
                postPayment({ id: clienteId, paymentData }, {
                    onSuccess: () => {
                        Swal.fire(
                            '¡Pago registrado!',
                            'El pago se ha registrado correctamente.',
                            'success'
                        );
                        reset();
                        onClose();
                    },
                    onError: () => {
                        Swal.fire(
                            'Error',
                            'Hubo un error al registrar el pago. Intente nuevamente.',
                            'error'
                        );
                    }
                });
            }
        });
    }

    // Si el modal no está abierto, no renderizar nada
    if (!isOpen) return null;

    return (
        // Backdrop (fondo oscuro)
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Modal container */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Registrar Pago</h2>
                    <button 
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Saldo actual info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-gray-600">Saldo Pendiente</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                        }).format(Number(saldoActual))}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitRHF(handleSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
                            Monto a pagar:
                        </label>
                        <input 
                            placeholder='Ingrese el monto total' 
                            type="number" 
                            step="0.01" 
                                id="monto" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register('monto', {
                                required: 'El monto es obligatorio',
                                min: {
                                    value: 0.01,
                                    message: 'El monto debe ser mayor a 0'
                                },
                                max: {
                                    value: saldoActual,
                                    message: 'El monto no puede ser mayor al saldo actual'
                                }
                            })} 
                        />
                        {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="medioPagoId" className="block text-sm font-medium text-gray-700 mb-2">
                            Método de Pago:
                        </label>
                        <select
                            id="medioPagoId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register('medioPagoId', { required: 'El método de pago es obligatorio' })}
                        >
                            <option value="">Seleccione un método</option>
                            <option value="1">Efectivo</option>
                            <option value="3">Tarjeta</option>
                            <option value="2">Transferencia</option>
                        </select>
                        {errors.medioPagoId && <p className="text-red-600 text-sm mt-1">{errors.medioPagoId.message}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isPendingPay} 
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                        >
                            {isPendingPay ? 'Procesando...' : 'Pagar'}
                        </button>
                    </div>

                    {isErrorPay && <p className="text-red-600 text-sm mt-3">Error al procesar el pago. Intente nuevamente.</p>}
                </form>
            </div>
        </div>
    )
}

export default PaymenteModal