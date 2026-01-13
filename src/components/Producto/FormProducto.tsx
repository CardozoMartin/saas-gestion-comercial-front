import { AlertCircle, Save, Upload, X, Package, DollarSign, Layers, Tag, Ruler, ToggleLeft, Calendar, Hash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Producto {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  precioCosto: string;
  precioVenta: string;
  unidadMedidaId: string;
  fraccionable: boolean;
  stockMinimo: string;
  activo: boolean;
}

const FormProducto = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Producto>({
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      categoriaId: "",
      precioCosto: "",
      precioVenta: "",
      unidadMedidaId: "",
      fraccionable: false,
      stockMinimo: "0",
      activo: true,
    },
  });

  const onSubmit = (data: Producto) => {
    console.log("Producto guardado:", data);
    reset();
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fraccionable = watch("fraccionable");
  const activo = watch("activo");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="bg-white rounded-md border border-gray-500/30 p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-gray-800/80">Nuevo Producto</h2>
            <p className="text-sm text-gray-600/70 mt-1">Completa la información del producto</p>
          </div>
          <button className="p-2 text-gray-600/70 hover:text-gray-800 hover:bg-gray-500/10 rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Información Básica */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <Package className="w-4 h-4 text-gray-700/70 mr-2" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Hash className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Código del Producto *
                </label>
                <input
                  {...register("codigo", {
                    required: "El código es obligatorio",
                    maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.codigo ? "border-red-400/60 bg-red-50/30" : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="Ej: PROD-001"
                />
                {errors.codigo && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">{errors.codigo.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Nombre del Producto *
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    maxLength: { value: 200, message: "Máximo 200 caracteres" },
                  })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.nombre ? "border-red-400/60 bg-red-50/30" : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                  placeholder="Ej: Café Americano Premium"
                />
                {errors.nombre && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">{errors.nombre.message}</span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register("descripcion")}
                  rows={3}
                  className="w-full border border-gray-500/30 hover:border-gray-500/50 rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition resize-none"
                  placeholder="Describe las características y beneficios del producto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Categoría *
                </label>
                <select
                  {...register("categoriaId", { required: "Selecciona una categoría" })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.categoriaId ? "border-red-400/60 bg-red-50/30" : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="1">Cafés</option>
                  <option value="2">Bebidas Frías</option>
                  <option value="3">Postres</option>
                  <option value="4">Snacks</option>
                  <option value="5">Otros</option>
                </select>
                {errors.categoriaId && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">{errors.categoriaId.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2 flex items-center">
                  <Ruler className="w-3.5 h-3.5 mr-1.5 text-gray-600/60" />
                  Unidad de Medida *
                </label>
                <select
                  {...register("unidadMedidaId", { required: "Selecciona una unidad" })}
                  className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                    errors.unidadMedidaId ? "border-red-400/60 bg-red-50/30" : "border-gray-500/30 hover:border-gray-500/50"
                  }`}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="1">Unidad</option>
                  <option value="2">Kilogramo</option>
                  <option value="3">Litro</option>
                  <option value="4">Gramo</option>
                  <option value="5">Metro</option>
                </select>
                {errors.unidadMedidaId && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">{errors.unidadMedidaId.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Precios */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <DollarSign className="w-4 h-4 text-gray-700/70 mr-2" />
              Precios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Precio de Costo *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700/70 font-medium text-sm">
                    $
                  </span>
                  <input
                    {...register("precioCosto", {
                      required: "El precio de costo es obligatorio",
                      min: { value: 0, message: "Debe ser mayor a 0" },
                    })}
                    type="number"
                    step="0.01"
                    className={`w-full border rounded-md pl-8 pr-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                      errors.precioCosto ? "border-red-400/60 bg-red-50/30" : "border-gray-500/30 hover:border-gray-500/50"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.precioCosto && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">{errors.precioCosto.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Precio de Venta *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700/70 font-medium text-sm">
                    $
                  </span>
                  <input
                    {...register("precioVenta", {
                      required: "El precio de venta es obligatorio",
                      min: { value: 0, message: "Debe ser mayor a 0" },
                    })}
                    type="number"
                    step="0.01"
                    className={`w-full border rounded-md pl-8 pr-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition ${
                      errors.precioVenta ? "border-red-400/60 bg-red-50/30" : "border-gray-500/30 hover:border-gray-500/50"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.precioVenta && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                    <span className="text-red-600/80 text-xs font-medium">{errors.precioVenta.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inventario y Configuración */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <Package className="w-4 h-4 text-gray-700/70 mr-2" />
              Inventario y Configuración
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2">
                  Stock Mínimo
                </label>
                <input
                  {...register("stockMinimo")}
                  type="number"
                  step="0.001"
                  className="w-full border border-gray-500/30 hover:border-gray-500/50 rounded-md px-3 py-2 text-sm font-medium text-gray-800/80 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                  placeholder="0"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2.5 cursor-pointer bg-white border border-gray-500/30 hover:bg-gray-500/10 rounded-md px-3 py-2 w-full transition">
                  <input
                    {...register("fraccionable")}
                    type="checkbox"
                    className="w-4 h-4 text-gray-700 border-gray-400 rounded focus:ring-1 focus:ring-gray-400"
                  />
                  <span className="flex items-center text-sm font-medium text-gray-800/80">
                    <ToggleLeft className={`w-4 h-4 mr-1.5 ${fraccionable ? 'text-gray-700/80' : 'text-gray-500/60'}`} />
                    Fraccionable
                  </span>
                </label>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2.5 cursor-pointer bg-white border border-gray-500/30 hover:bg-gray-500/10 rounded-md px-3 py-2 w-full transition">
                  <input
                    {...register("activo")}
                    type="checkbox"
                    className="w-4 h-4 text-gray-700 border-gray-400 rounded focus:ring-1 focus:ring-gray-400"
                  />
                  <span className="flex items-center text-sm font-medium text-gray-800/80">
                    <Calendar className={`w-4 h-4 mr-1.5 ${activo ? 'text-gray-700/80' : 'text-gray-500/60'}`} />
                    Activo
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-gray-500/5 rounded-md p-5 border border-gray-500/20">
            <h3 className="text-sm font-medium text-gray-800/80 mb-4 flex items-center">
              <Upload className="w-4 h-4 text-gray-700/70 mr-2" />
              Imagen del Producto
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-800/80 mb-2.5">
                  Subir Imagen
                </label>
                <div className="border border-dashed border-gray-400/50 hover:border-gray-500/70 rounded-md p-6 text-center transition bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-10 h-10 text-gray-600/60 mb-2.5" />
                    <span className="text-sm font-medium text-gray-800/80">
                      Haz clic para subir imagen
                    </span>
                    <span className="text-xs text-gray-600/60 mt-1.5 font-medium">
                      PNG, JPG, JPEG (máx. 5MB)
                    </span>
                  </label>
                </div>
              </div>
              
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-800/80 mb-2.5">
                    Vista Previa
                  </label>
                  <div className="border border-gray-500/30 rounded-md p-3 bg-white">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-300/70">
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-md transition"
            >
              <Save className="w-4 h-4" />
              Guardar Producto
            </button>
            <button
              onClick={() => {
                reset();
                setImagePreview(null);
              }}
              className="px-5 py-2.5 border border-gray-500/30 text-gray-800/80 text-sm font-medium rounded-md hover:bg-gray-500/10 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProducto;