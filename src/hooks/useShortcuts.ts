// src/hooks/useShortcuts.ts
import { useEffect } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;
type ShortcutsMap = Record<string, ShortcutHandler>;

interface UseShortcutsOptions {
  enabled?: boolean;
  ignoreInputs?: boolean;
}

export function useShortcuts(
  shortcuts: ShortcutsMap,
  options: UseShortcutsOptions = {}
) {
  const { enabled = true, ignoreInputs = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignorar si está escribiendo en un input/textarea/select
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
          return;
        }
        // También ignorar si tiene contentEditable
        if (target.contentEditable === 'true') {
          return;
        }
      }

      // Construir la tecla con modificadores
      const keys: string[] = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.shiftKey) keys.push('shift');
      if (event.altKey) keys.push('alt');
      
      // Normalizar el nombre de la tecla
      const key = event.key.toLowerCase();
      keys.push(key);
      
      const shortcutKey = keys.join('+');

      // Buscar primero con modificadores, luego sin modificadores
      const handler = shortcuts[shortcutKey] || shortcuts[key];

      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [shortcuts, enabled, ignoreInputs]);
}