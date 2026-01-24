// src/components/SessionHandler.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../store/useSession';

/**
 * Componente que maneja eventos de sesión global
 * - Verifica la sesión cuando la pestaña vuelve a estar visible
 * - Verifica la sesión cuando la ventana recibe foco
 * - Maneja el cierre de sesión automático
 */
export const SessionHandler = () => {
  const { checkSession, isLoggedIn } = useSession();
  const navigate = useNavigate();

  // Verificar expiración al enfocar la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoggedIn) {
        console.log('Pestaña visible, verificando sesión...');
        const isValid = checkSession();
        if (!isValid) {
          navigate('/login', { replace: true });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoggedIn, checkSession, navigate]);

  // Verificar sesión al enfocar la ventana
  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) {
        console.log('Ventana enfocada, verificando sesión...');
        const isValid = checkSession();
        if (!isValid) {
          navigate('/login', { replace: true });
        }
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isLoggedIn, checkSession, navigate]);

  return null; // Este componente no renderiza nada
};

export default SessionHandler;