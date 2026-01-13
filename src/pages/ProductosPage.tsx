import React from 'react'
import { useNavigate } from 'react-router-dom'
import StyledTable from '../utils/Tables/Table'

const ProductosPage = () => {
    const Navigate = useNavigate()
  return (
   <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
        <button 
          onClick={() => Navigate('/dashboard/productos/agregar')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Agregar Producto
        </button>
      </div>
      <div className="bg-white border border-gray-500/30 rounded-md p-6">
        <p className="text-gray-600">Lista completa de productos del inventario.</p>
        <StyledTable />
      </div>
    </div>
  )
}

export default ProductosPage