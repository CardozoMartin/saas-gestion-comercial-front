import {
  AlertCircle,
  Save,
  X,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUsers } from "../../hooks/useUsers";

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
    rolId: number;
}

const FormUsers = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //hook para crear usuario
  const { usePostUser } = useUsers();
  const { mutate: postUser, isPending: isPostingUser } = usePostUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Usuario>({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      telefono: "",
      rolId:0
    },
  });

  const password = watch("password");

  const onSubmit = (data: Usuario) => {
    const datos: Usuario = {
    ...data,
    rolId: Number(data.rolId), // Convertir a número
  };
    setIsLoading(true);
    postUser(datos);
    console.log("Datos del usuario:", data);

    // Simular envío al servidor
    setTimeout(() => {
      setShowSuccessMessage(true);
      setIsLoading(false);
      reset();
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 1500);
  };

  const handleClose = () => {
    reset();
    console.log("Cerrar formulario");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Usuario creado exitosamente
          </span>
        </div>
      )}

      <div className="bg-white rounded-md border border-gray-500/30 p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-gray-800/80">
              Agregar Nuevo Usuario
            </h2>
            <p className="text-sm text-gray-600/70 mt-1">
              Completa la información del usuario del sistema
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
                    minLength: {
                      value: 2,
                      message: "Mínimo 2 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Máximo 50 caracteres",
                    },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.nombre
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="Ej: Martín"
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
                    minLength: {
                      value: 2,
                      message: "Mínimo 2 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Máximo 50 caracteres",
                    },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.apellido
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="Ej: Cardozo"
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
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Selecciona el rol *
                </label>
                <select
                  {...register("rolId", {
                    required: "Selecciona un rol",
                    validate: (value) =>
                      value > 0 || "Debes seleccionar un rol válido",
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.rolId
                      ? "border-red-400/60 bg-red-50/30"
                      : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="1">Admin</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Cajero</option>
                  
                </select>
                {errors.rolId && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.rolId.message}
                    </span>
                  </div>
                )}
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
                  placeholder="martin@gmail.com"
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
                  placeholder="38120326661"
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
            </div>
          </div>

          {/* Información de Seguridad */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <Lock className="w-4 h-4 text-gray-700/70 mr-2" />
              Información de Seguridad
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Mínimo 6 caracteres",
                      },
                      maxLength: {
                        value: 50,
                        message: "Máximo 50 caracteres",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`w-full border rounded-md px-3 py-2 pr-10 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                      errors.password
                        ? "border-red-400/60 bg-red-50/30"
                        : "border-gray-500/30 hover:border-gray-500/50"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600/60 hover:text-gray-800 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">
                      {errors.password.message}
                    </span>
                  </div>
                )}
                {password && password.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">
                      Fortaleza de la contraseña:
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          password.length < 6
                            ? "w-1/3 bg-red-500"
                            : password.length < 10
                              ? "w-2/3 bg-yellow-500"
                              : "w-full bg-green-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
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
              {isLoading ? "Guardando..." : "Crear Usuario"}
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

export default FormUsers;
