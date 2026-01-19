// src/hooks/useGlobalShortcuts.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useGlobalShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalShortcuts = (event: KeyboardEvent) => {
      // Ignorar si está escribiendo
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      // Atajos globales de navegación
      switch (event.key) {
        case 'F1':
          event.preventDefault();
          navigate('/dashboard/punto-venta');
          break;
        
        case 'F2':
          event.preventDefault();
          navigate('/dashboard/productos');
          break;

        case 'F3':
          event.preventDefault();
          navigate('/dashboard/clientes');
          break;

        case 'F4':
          event.preventDefault();
          navigate('/dashboard/ventas');
          break;

        case 'F5':
          event.preventDefault();
          navigate('/dashboard');
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    
    return () => {
      window.removeEventListener('keydown', handleGlobalShortcuts);
    };
  }, [navigate]);
}