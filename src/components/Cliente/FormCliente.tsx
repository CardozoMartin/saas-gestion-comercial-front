import {
  AlertCircle,
  Save,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  Hash,
  DollarSign,
  Building2,
  CheckCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Cliente {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  razonSocial?: string;
  email: string;
  telefono: string;
  direccion: string;
  limiteCredito: number;
  condicionPagoId: number;
  fechaProximaVencimiento?: string;
}

const FormCliente = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Cliente>({
    defaultValues: {
      tipoDocumento: "DNI",
      numeroDocumento: "",
      nombre: "",
      apellido: "",
      razonSocial: "",
      email: "",
      telefono: "",
      direccion: "",
      limiteCredito: 0,
      condicionPagoId: undefined as any,
      fechaProximaVencimiento: "",
    },
  });

  const tipoDocumento = watch("tipoDocumento");

  const onSubmit = (data: Cliente) => {
    setIsLoading(true);
    
    // Simular envío de datos
    console.log("Datos del cliente:", data);
    
    // Simular respuesta del servidor
    setTimeout(() => {
      setShowSuccessMessage(true);
      setIsLoading(false);
      reset();
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 1500);
  };

  const handleClose = () => {
    reset();
    // Aquí puedes agregar navegación si usas react-router
    console.log("Cerrar formulario");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Cliente guardado exitosamente
          </span>
        </div>
      )}

      <div className="bg-white rounded-md border border-gray-500/30 p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-gray-800/80">
              Agregar Nuevo Cliente
            </h2>
            <p className="text-sm text-gray-600/70 mt-1">
              Completa la información del cliente
            </p>
          </div>
          <button
            className="p-2 text-gray-600/70 hover:text-gray-800 hover:bg-gray-500/10 rounded transition"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Información de Identificación */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <FileText className="w-4 h-4 text-gray-700/70 mr-2" />
              Información de Identificación
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Hash className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Tipo de Documento *
                </label>
                <select
                  {...register("tipoDocumento", {
                    required: "Selecciona un tipo de documento",
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.tipoDocumento
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                >
                  <option value="DNI">DNI</option>
                  <option value="CUIT">CUIT</option>
                  <option value="CUIL">CUIL</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
                {errors.tipoDocumento && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.tipoDocumento.message}
                    </span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <CreditCard className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Número de Documento *
                </label>
                <input
                  {...register("numeroDocumento", {
                    required: "El número de documento es obligatorio",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo números",
                    },
                    minLength: {
                      value: 7,
                      message: "Mínimo 7 dígitos",
                    },
                    maxLength: {
                      value: 11,
                      message: "Máximo 11 dígitos",
                    },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.numeroDocumento
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder={
                    tipoDocumento === "CUIT" || tipoDocumento === "CUIL"
                      ? "20-12345678-9"
                      : "12345678"
                  }
                />
                {errors.numeroDocumento && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.numeroDocumento.message}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <User className="w-4 h-4 text-gray-700/70 mr-2" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Nombre *
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    maxLength: {
                      value: 100,
                      message: "Máximo 100 caracteres",
                    },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.nombre
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="Ej: Juan"
                />
                {errors.nombre && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.nombre.message}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Apellido *
                </label>
                <input
                  {...register("apellido", {
                    required: "El apellido es obligatorio",
                    maxLength: {
                      value: 100,
                      message: "Máximo 100 caracteres",
                    },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.apellido
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="Ej: Pérez"
                />
                {errors.apellido && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.apellido.message}
                    </span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Razón Social
                </label>
                <input
                  {...register("razonSocial")}
                  className="w-full border border-gray-500/30 hover:border-gray-500/50 rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                  placeholder="Ej: Empresa S.A."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opcional - Para clientes comerciales
                </p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <Phone className="w-4 h-4 text-gray-700/70 mr-2" />
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Email *
                </label>
                <input
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  type="email"
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.email
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.email.message}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Teléfono *
                </label>
                <input
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^[0-9]{7,15}$/,
                      message: "Solo números, entre 7 y 15 dígitos",
                    },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.telefono
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="3815908348"
                />
                {errors.telefono && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.telefono.message}
                    </span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Dirección *
                </label>
                <input
                  {...register("direccion", {
                    required: "La dirección es obligatoria",
                    maxLength: {
                      value: 200,
                      message: "Máximo 200 caracteres",
                    },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.direccion
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="Ej: Av. Siempreviva 742"
                />
                {errors.direccion && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.direccion.message}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información de Crédito */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <DollarSign className="w-4 h-4 text-gray-700/70 mr-2" />
              Información de Crédito
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Límite de Crédito *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700/70 font-medium text-sm">
                    $
                  </span>
                  <input
                    {...register("limiteCredito", {
                      required: "El límite de crédito es obligatorio",
                      min: { value: 0, message: "Debe ser mayor o igual a 0" },
                    })}
                    type="number"
                    step="0.01"
                    className={`w-full border rounded-md pl-8 pr-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                      errors.limiteCredito
                        ? "border-red-400/60 bg-red-50/30"
                        : "border-gray-500/30 hover:border-gray-500/50"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.limiteCredito && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.limiteCredito.message}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Condición de Pago *
                </label>
                <select
                  {...register("condicionPagoId", {
                    required: "Selecciona una condición de pago",
                    validate: (value) =>
                      value > 0 || "Debes seleccionar una condición válida",
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.condicionPagoId
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="1">Contado</option>
                  <option value="2">7 días</option>
                  <option value="3">15 días</option>
                  <option value="4">30 días</option>
                  <option value="5">60 días</option>
                  <option value="6">90 días</option>
                </select>
                {errors.condicionPagoId && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.condicionPagoId.message}
                    </span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Fecha Próxima de Vencimiento
                </label>
                <input
                  {...register("fechaProximaVencimiento")}
                  className="w-full border border-gray-500/30 hover:border-gray-500/50 rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                  placeholder="Ej: 10 de cada mes"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opcional - Puedes especificar un patrón de vencimiento
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-300/70">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Guardando..." : "Guardar Cliente"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
              }}
              className="px-5 py-2.5 border border-gray-500/30 text-gray-800/80 text-sm font-medium rounded-md hover:bg-gray-500/10 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCliente;