import { useCallback } from 'react';
import notificationService from 'services/notification-service';

/**
 * Hook personalizado para usar el sistema de notificaciones
 * @returns {Object} Métodos para mostrar diferentes tipos de notificaciones
 */
const useNotifications = () => {
  const success = useCallback((message, options = {}) => {
    return notificationService.success(message, options);
  }, []);

  const error = useCallback((message, options = {}) => {
    return notificationService.error(message, options);
  }, []);

  const warning = useCallback((message, options = {}) => {
    return notificationService.warning(message, options);
  }, []);

  const info = useCallback((message, options = {}) => {
    return notificationService.info(message, options);
  }, []);

  const show = useCallback((type, message, options = {}) => {
    return notificationService.show(type, message, options);
  }, []);

  const hide = useCallback((id) => {
    return notificationService.hide(id);
  }, []);

  const clear = useCallback(() => {
    return notificationService.clear();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    show,
    hide,
    clear
  };
};

export default useNotifications; 