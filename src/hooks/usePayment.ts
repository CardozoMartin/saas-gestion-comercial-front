// hooks/usePayment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postProccessPaymentFn } from "../api/payment/apiPayment";

export const usePayment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: postPayment,
    isPending: isPendingPay,
    isError: isErrorPay,
    isSuccess: isSuccessPay,
  } = useMutation({
   
    mutationFn: ({ id, paymentData }: { id: number; paymentData: any }) => 
      postProccessPaymentFn(id, paymentData),    
    onSuccess: (data: any) => {
      console.log("✅ Pago procesado con éxito:", data);
      
      // Invalidar queries para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['cuentaCorriente'] });
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    
    onError: (error: any) => {
      console.error("❌ Error al procesar el pago:", error);
    },
  });

  return { 
    postPayment, 
    isPendingPay, 
    isErrorPay,
    isSuccessPay 
  };
};