import { useEffect, useRef } from 'react';

interface UseBarcodeReaderProps {
  onScan: (barcode: string) => void;
  minLength?: number;
  timeout?: number;
  enabled?: boolean;
  preventDefaultOnEnter?: boolean;
}

/**
 * Hook para capturar códigos de barras del escáner
 * Los escáneres escriben muy rápido y terminan con Enter
 */
export const useBarcodeReader = ({
  onScan,
  minLength = 3,
  timeout = 100,
  enabled = true,
  preventDefaultOnEnter = true,
}: UseBarcodeReaderProps) => {
  const bufferRef = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 🔥 CAMBIO IMPORTANTE: Ignorar SOLO si estamos en inputs de texto editables
      // (modales, formularios, etc.) pero NO en el input de búsqueda principal
      const target = e.target as HTMLElement;
      const tag = target?.tagName;
      
      // Permitir escaneo si:
      // 1. No estamos en ningún input
      // 2. Estamos en el input de búsqueda (id="search-product")
      // 3. Estamos en cualquier parte de la página
      const isEditableInput = 
        (tag === 'INPUT' && target?.getAttribute('type') === 'number') ||
        (tag === 'INPUT' && target?.getAttribute('type') === 'text' && target?.id !== 'search-product') ||
        tag === 'TEXTAREA' ||
        target?.getAttribute('contenteditable') === 'true';

      // Solo ignorar si estamos en un input EDITABLE (no el de búsqueda)
      if (isEditableInput) return;

      // Limpiar el timer anterior
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Si es Enter, procesar el código escaneado
      if (e.key === 'Enter') {
        if (preventDefaultOnEnter) {
          e.preventDefault();
        }
        
        if (bufferRef.current.length >= minLength) {
          onScan(bufferRef.current.trim());
          bufferRef.current = '';
        }
        return;
      }

      // Ignorar teclas especiales (excepto números y letras)
      if (e.key.length > 1) return;

      // Prevenir que se escriba en el input de búsqueda cuando estamos escaneando
      if (target?.id === 'search-product' && bufferRef.current.length === 0) {
        // Si es el primer caracter, dejarlo pasar al input
        // El escáner escribirá en el input naturalmente
      }

      // Agregar caracter al buffer
      bufferRef.current += e.key;

      // Resetear el buffer después del timeout
      timerRef.current = setTimeout(() => {
        bufferRef.current = '';
      }, timeout);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onScan, minLength, timeout, enabled, preventDefaultOnEnter]);
};