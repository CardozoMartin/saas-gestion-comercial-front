import React from 'react'
import FormCategory from '../components/Category/FormCategory'

const CategoriasPage = () => {
  return (
    <div className="bg-white border border-gray-500/30 rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Categorías</h2>
      <p className="text-gray-600">Administra las categorías de productos.</p>
      <FormCategory />
    </div>
  )
}

export default CategoriasPage