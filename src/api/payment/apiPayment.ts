// api/payment/apiPayment.ts
import { api } from "../config";

export const postProccessPaymentFn = async (id: number, paymentData: any) => {
    console.log("📤 Procesando pago para cliente:", id);
    console.log("💰 Datos del pago:", paymentData);
    
    try {
        const response = await api.post(`/clientes/${id}/pagar`, paymentData);
        console.log("✅ Respuesta del servidor:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Error en la petición:", error.response?.data || error.message);
        throw error;
    }
};