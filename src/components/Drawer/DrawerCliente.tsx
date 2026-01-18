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
  const { postSale } = useSale();
  const { clearCart } = useCart();
  const queryCliente = new QueryClient();

  const filteredClientes = clientes?.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleSelectCliente = (cliente) => {
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
      postSale(saleData);

      //si la peticion es exitosa
      toast.success("¡Venta procesada exitosamente!", {
        description: `Cliente: ${cliente.nombre} ${cliente.apellido} se cargo a su cuenta corriente.`,
        duration: 4000,
      });

      //ahora limpiamos el carrito y cerramos el drawer
      clearCart();
      queryCliente.invalidateQueries({ queryKey: ["products"] });
      onClose();
    } catch (error) {
      const errorDeCaja = error.response.data.error;

      if (
        errorDeCaja ===
        "No tienes una caja abierta. Abre una caja antes de registrar ventas."
      ) {
        toast.error("Error, Debes abrir una caja antes de registrar ventas", {
          description: "El usuario no tiene una caja abierta",
        });
        return;
      }
      toast.error("Error al procesar la venta", {
        description: "Por favor, intente nuevamente",
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Buscar Cliente
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
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
                strokeWidth="2"
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ingrese el nombre del cliente
              </label>
              <div className="relative">
                <input
                  id="search-cliente"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Ej: Martin Cardozo"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                    strokeWidth="2"
                  />
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Lista de clientes */}
            <div className="mt-4">
              {searchTerm.trim() === "" ? (
                <div className="text-center py-12 text-gray-400">
                  <svg
                    className="mx-auto mb-3 text-gray-300"
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
                  <p className="text-sm">Ingrese un nombre para buscar</p>
                </div>
              ) : (
                <>
                  {isLoading && (
                    <div className="text-center py-8 text-gray-500">
                      Cargando clientes...
                    </div>
                  )}

                  {isError && (
                    <div className="text-center py-8 text-red-600">
                      Error al cargar los clientes
                    </div>
                  )}

                  {!isLoading && !isError && filteredClientes?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No se encontraron clientes
                    </div>
                  )}

                  {!isLoading && !isError && filteredClientes?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 mb-3 px-1">
                        {filteredClientes.length}{" "}
                        {filteredClientes.length === 1
                          ? "resultado"
                          : "resultados"}
                      </p>
                      <ul className="flex flex-col gap-px">
                        {filteredClientes.map((cliente) => (
                          <li
                            key={cliente.id}
                            onClick={() => handleSelectCliente(cliente)}
                            className="flex items-start justify-between gap-3 cursor-pointer px-4 py-3 rounded-md hover:bg-gray-100 transition-colors duration-150 border border-transparent hover:border-gray-200"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-dm truncate">
                                {cliente.nombre} {cliente.apellido}
                              </p>

                              <div>
                                <button className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
                                  Cargar en cuenta corriente
                                </button>
                              </div>
                            </div>
                            <svg
                              className="flex-shrink-0 mt-1 text-gray-400"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 18l6-6-6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
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
