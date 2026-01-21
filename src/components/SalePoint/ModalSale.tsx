import { X, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSale } from '../../hooks/useSale';
import { useSession } from '../../store/useSession';
import { toast } from 'sonner';
import { useCart } from '../../store/useCart';
import { useQueryClient } from '@tanstack/react-query';

interface FinishSale {
    clienteId?: number;
    usuarioId?: number;
    tipoVenta: string;
    descuento: number;
    observaciones?: string;
    subtotal: number;
    total: number;
    detalles: Array<{
        productoId: number;
        unidadMedidaId: number;
        cantidad: number;
        precioUnitario: number;
    }>;
}

interface CartItem {
  id: number;
  nombre: string;
  precioVenta: string | number;
  cantidad: number;
  unidadMedidaNombre: string;
  unidadMedidaId?: number;
}

interface ModalSaleProps {
  cart: CartItem[];
  setCart?: (cart: CartItem[]) => void;
  showModal: boolean;
  setShowModal: (v: boolean) => void;
}

export default function ModalSale({ cart, showModal, setShowModal }: ModalSaleProps) {

  const [paymentMethod, setPaymentMethod] = useState('contado'); // Ya está en 'contado' (efectivo)
  const [moneyReceived, setMoneyReceived] = useState(0);
  const { postSale, isPostingSale } = useSale();
  const { user } = useSession();
  const {clearCart} = useCart();
  const queryClient = useQueryClient();

  // Atajo: barra espaciadora para procesar la venta automáticamente si es EFECTIVO
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isSpace = e.code === 'Space' || e.key === ' ';
      if (!isSpace) return;

      // No ejecutar si un input/textarea/select está enfocado
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName;
      const isTextInput = !!(
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        active?.getAttribute('contenteditable') === 'true'
      );
      if (isTextInput) return;

      if (paymentMethod === 'contado' && !isPostingSale && cart.length > 0) {
        e.preventDefault();
        // Confirmación de seguridad: evitar ejecutar la venta accidentalmente con Space
        if (confirm('¿Procesar venta en efectivo?')) {
          handleProcessSale();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [paymentMethod, isPostingSale, cart]);

  const formatQuantity = (item: { unidadMedidaNombre: string }, quantity: number) => {
    return `${quantity.toFixed(3)} ${item.unidadMedidaNombre}${quantity > 1 ? 's' : ''}`;
  };

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.precioVenta) * item.cantidad), 0);
  const total = subtotal;
  const cambio = Math.max(0, moneyReceived - total);
  const faltaPagar = Math.max(0, total - moneyReceived);

  const handleProcessSale = async () => {
    // Removida la validación obligatoria del monto recibido
    // Ya no es necesario que moneyReceived >= total para efectivo
    
    const saleData: FinishSale = {
      clienteId: undefined,
      usuarioId: user?.userId ? Number(user.userId) : undefined,
      tipoVenta: paymentMethod,
      descuento: 0,
      observaciones: "Venta realizada desde punto de venta",
      subtotal: subtotal,
      total: total,
      detalles: cart.map((item) => ({
        productoId: item.id,
        unidadMedidaId: item.unidadMedidaId as number,
        cantidad: item.cantidad,
        precioUnitario: Number(item.precioVenta),
      }))
    };

    try {
      await postSale(saleData);

      
      // Si la petición fue exitosa
      toast.success('¡Venta procesada exitosamente!', {
        description: `Total: $${total.toFixed(2)}`,
        duration: 4000,
      });
      
      // Limpiar carrito y cerrar modal
      clearCart();
      //invalidamos la query para que se refresquen los productos
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowModal(false);
      setMoneyReceived(0);
      
    } catch (err: any) {

        const errorDeCaja = err?.response?.data?.error
       
        if(errorDeCaja === "No tienes una caja abierta. Abre una caja antes de registrar ventas."){
          toast.error('Error, Debes abrir una caja antes de registrar ventas', {
            description: 'El usuario no tiene una caja abierta',
          });
          return;
        }
      toast.error('Error al procesar la venta', {
        description: 'Por favor, intente nuevamente',
      });
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-gray-700" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Procesar Venta</h2>
          </div>
          <button 
            onClick={() => setShowModal(false)} 
            disabled={isPostingSale}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Contenido en dos columnas */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
              <p>No hay productos en el carrito</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda: Items del carrito */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Productos ({cart.length})</h3>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {item.nombre}
                        </h4>
                        <p className="text-xs text-gray-500">
                          ${item.precioVenta} / {item.unidadMedidaNombre}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">
                            {formatQuantity(item, item.cantidad)}
                          </p>
                          <p className="font-bold text-gray-800">
                            ${(Number(item.precioVenta) * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna derecha: Pago y totales */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Resumen de Pago</h3>
                
                {/* Método de pago */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Método de Pago
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setMoneyReceived(0);
                    }}
                    disabled={isPostingSale}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="contado">💵 Efectivo</option>
                    <option value="transferencia">💳 Transferencia</option>
                    <option value="cuenta_corriente">📋 Cuenta Corriente</option>
                  </select>
                </div>

                {/* Monto recibido para efectivo (OPCIONAL) */}
                {paymentMethod === 'contado' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Monto Recibido <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      disabled={isPostingSale}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Ingrese el monto para calcular cambio"
                      value={moneyReceived || ''}
                      onChange={(e) => setMoneyReceived(parseFloat(e.target.value) || 0)}
                    />
                    
                    {/* Indicador de cambio o falta (solo si se ingresó un monto) */}
                    {moneyReceived > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        {cambio > 0 ? (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Cambio a devolver:</span>
                            <span className="text-lg font-bold text-green-600">${cambio.toFixed(2)}</span>
                          </div>
                        ) : faltaPagar > 0 ? (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle size={18} />
                            <div className="flex justify-between items-center flex-1">
                              <span className="text-sm font-medium">Falta pagar:</span>
                              <span className="text-lg font-bold">${faltaPagar.toFixed(2)}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-green-600">
                            <span className="text-sm font-medium">✓ Monto exacto</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Totales */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                {paymentMethod === 'contado' && (
                  <div className="mb-2 text-sm text-gray-500">Presiona <kbd className="bg-gray-100 px-2 py-1 rounded">Space</kbd> para procesar la venta en efectivo</div>
                )}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleProcessSale}
                    disabled={isPostingSale}
                    className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isPostingSale ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Procesando venta...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Procesar Venta
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isPostingSale}
                    className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}