import { useState, useCallback } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);

    // For now, we'll use console.log and alert as fallbacks
    // In a real app, you might want to integrate with a toast library like react-toastify
    console.log(`${type.toUpperCase()}: ${message}`);
    
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else if (type === 'success') {
      alert(`Éxito: ${message}`);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
    clearNotifications
  };
};

export default useNotifications; 