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

  // Funciones específicas para diferentes tipos de notificaciones
  const showError = useCallback((message, duration = 5000) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showSuccess = useCallback((message, duration = 3000) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration = 4000) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration = 3000) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  const showLoading = useCallback((message = 'Cargando...', duration = 0) => {
    showNotification(message, 'loading', duration);
  }, [showNotification]);

  const showConfirmation = useCallback((message, onConfirm, onCancel) => {
    const confirmed = window.confirm(message);
    if (confirmed && onConfirm) {
      onConfirm();
    } else if (!confirmed && onCancel) {
      onCancel();
    }
    return confirmed;
  }, []);

  return {
    notifications,
    showNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showLoading,
    showConfirmation,
    removeNotification,
    clearNotifications
  };
};

export default useNotifications; 