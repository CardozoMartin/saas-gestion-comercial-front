import React, { useState } from "react";
import { useCliente } from "../../hooks/useCliente";
import { useSale } from "../../hooks/useSale";
import { toast } from "sonner";
import { useCart } from "../../store/useCart";
import { QueryClient } from "@tanstack/react-query";

interface FinishSale {
  clienteId?: number;
  usuarioId?: number;
  tipoVenta: string;
  descuento: number | 0;
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

const DrawerCliente = ({ open, onClose, onSelectCliente, cart, setCart }) => {
  const { useGetClientes } = useCliente();
  const { data: clientes, isLoading, isError } = useGetClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { postSale } = useSale();
  const { clearCart } = useCart();
  const queryCliente = new QueryClient();

  const filteredClientes = clientes?.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleSelectCliente = async (cliente) => {
    setSelectedCliente(cliente);
    setIsProcessing(true);

    const saleData: FinishSale = {
      clienteId: cliente.id,
      usuarioId: 1,
      tipoVenta: "cuenta_corriente",
      descuento: 0,
      observaciones: "Venta desde sale point cuenta corriente",
      subtotal: 0,
      total: 0,
      detalles: cart.map((item) => ({
        productoId: item.id,
        unidadMedidaId: item.unidadMedidaId,
        cantidad: item.cantidad,
        precioUnitario: parseFloat(item.precioVenta),
      })),
    };

    try {
      await postSale(saleData);

      toast.success("¡Venta procesada exitosamente!", {
        description: `Cliente: ${cliente.nombre} ${cliente.apellido} - Cargado en cuenta corriente.`,
        duration: 4000,
      });

      clearCart();
      queryCliente.invalidateQueries({ queryKey: ["products"] });
      
      setTimeout(() => {
        setSelectedCliente(null);
        setSearchTerm("");
        setIsProcessing(false);
        onClose();
      }, 300);
    } catch (error) {
      setIsProcessing(false);
      setSelectedCliente(null);
      
      const errorDeCaja = error.response?.data?.error;

      if (
        errorDeCaja ===
        "No tienes una caja abierta. Abre una caja antes de registrar ventas."
      ) {
        toast.error("Error: Caja cerrada", {
          description: "Debes abrir una caja antes de registrar ventas",
        });
        return;
      }
      toast.error("Error al procesar la venta", {
        description: "Por favor, intente nuevamente",
      });
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSearchTerm("");
      setSelectedCliente(null);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-white shadow-2xl
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-500/30">
          <div>
            <h2 className="text-base font-semibold text-gray-800/90">
              Seleccionar Cliente
            </h2>
            <p className="text-sm text-gray-600/70 mt-0.5">
              Buscar y cargar en cuenta corriente
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700/80 hover:bg-gray-500/20 transition disabled:opacity-50"
            aria-label="Cerrar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-73px)]">
          <div className="space-y-4">
            {/* Buscador */}
            <div>
              <label
                htmlFor="search-cliente"
                className="block text-sm font-medium text-gray-800/80 mb-2"
              >
                Buscar cliente
              </label>
              <div className="relative">
                <input
                  id="search-cliente"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-500/30 rounded-md text-gray-800/80 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Nombre o apellido..."
                  autoComplete="off"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700/60"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {searchTerm && !isProcessing && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600/70 hover:text-gray-800/80 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M15 5L5 15M5 5l10 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Lista de clientes */}
            <div className="mt-4">
              {searchTerm.trim() === "" ? (
                <div className="text-center py-16 text-gray-600/60">
                  <svg
                    className="mx-auto mb-3 text-gray-500/50"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M21 21l-4.35-4.35"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-700/70">
                    Ingrese un nombre para buscar
                  </p>
                </div>
              ) : (
                <>
                  {isLoading && (
                    <div className="text-center py-12">
                      <div className="w-10 h-10 mx-auto mb-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-gray-600/70">Buscando clientes...</p>
                    </div>
                  )}

                  {isError && (
                    <div className="text-center py-12 px-4">
                      <svg className="mx-auto mb-3 text-red-600/70" width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <p className="text-sm font-medium text-red-600/80">Error al cargar clientes</p>
                      <p className="text-xs text-gray-600/70 mt-1">Intente nuevamente</p>
                    </div>
                  )}

                  {!isLoading && !isError && filteredClientes?.length === 0 && (
                    <div className="text-center py-12 px-4">
                      <svg className="mx-auto mb-3 text-gray-500/50" width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <p className="text-sm font-medium text-gray-700/70">No se encontraron clientes</p>
                    </div>
                  )}

                  {!isLoading && !isError && filteredClientes?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-gray-600/70 px-1">
                        {filteredClientes.length}{" "}
                        {filteredClientes.length === 1 ? "resultado" : "resultados"}
                      </p>
                      <ul className="flex flex-col gap-2">
                        {filteredClientes.map((cliente) => (
                          <li
                            key={cliente.id}
                            className={`bg-white border border-gray-500/30 rounded-md transition
                              ${isProcessing && selectedCliente?.id !== cliente.id ? 'opacity-50 pointer-events-none' : ''}
                            `}
                          >
                            <div className="p-3">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-gray-700/80 font-semibold text-sm">
                                    {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800/80 text-sm truncate">
                                    {cliente.nombre} {cliente.apellido}
                                  </p>
                                  <p className="text-xs text-gray-600/60 mt-0.5">
                                    ID: {cliente.id}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleSelectCliente(cliente)}
                                disabled={isProcessing}
                                className={`w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
                                  ${selectedCliente?.id === cliente.id && isProcessing
                                    ? 'bg-green-600/90 text-white cursor-wait'
                                    : 'bg-gray-500/20 text-gray-800/80 hover:bg-gray-500/30 cursor-pointer'
                                  }
                                  disabled:opacity-50
                                `}
                              >
                                {selectedCliente?.id === cliente.id && isProcessing ? (
                                  <>
                                    <span>Procesando venta...</span>
                                    <svg className="animate-spin flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <span>Cargar en cuenta corriente</span>
                                    <svg className="flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </>
                                )}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DrawerCliente;