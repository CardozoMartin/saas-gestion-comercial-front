

const AccessDenied = () => {
  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
      <p className="text-gray-600 mb-4">
        No tienes permisos para acceder a esta página
      </p>
      <a 
        href="/dashboard" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Volver al Dashboard
      </a>
    </div>
  </div>
  )
}

export default AccessDenied