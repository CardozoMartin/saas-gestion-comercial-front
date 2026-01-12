import { ShoppingCart } from 'lucide-react'
import React from 'react'
import LoginForm from '../components/LoginForm/LoginForm'

const LoginPage = () => {
  return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-500/30 rounded-lg p-8 shadow-sm">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <ShoppingCart size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sistema de Ventas
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Login Form */}
         <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage