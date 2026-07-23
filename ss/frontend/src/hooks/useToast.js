import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Date.now();
    setToasts(p => [...p, { id, title, description, variant }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  return { toasts, toast, dismiss };
};
