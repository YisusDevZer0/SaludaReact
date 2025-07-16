import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

/**
 * Hook personalizado para manejar notificaciones en la aplicación
 */
export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Configuración base para SweetAlert2
  const defaultConfig = {
    customClass: {
      popup: 'swalert-popup',
      title: 'swalert-title',
      content: 'swalert-content',
      confirmButton: 'swalert-confirm-btn',
      cancelButton: 'swalert-cancel-btn'
    },
    buttonsStyling: false,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    }
  };

  /**
   * Muestra una notificación simple
   */
  const showNotification = useCallback((message, type = 'info', options = {}) => {
    const iconMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
      question: 'question'
    };

    const config = {
      ...defaultConfig,
      title: options.title || getDefaultTitle(type),
      text: message,
      icon: iconMap[type] || 'info',
      timer: options.timer || (type === 'success' ? 3000 : 5000),
      timerProgressBar: true,
      toast: options.toast !== false,
      position: options.position || 'top-end',
      showConfirmButton: options.showConfirmButton || false,
      showCancelButton: false,
      ...options
    };

    return Swal.fire(config);
  }, []);

  /**
   * Muestra un diálogo de confirmación
   */
  const showConfirmation = useCallback((message, options = {}) => {
    const config = {
      ...defaultConfig,
      title: options.title || '¿Estás seguro?',
      text: message,
      icon: options.icon || 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmText || 'Sí, confirmar',
      cancelButtonText: options.cancelText || 'Cancelar',
      confirmButtonColor: options.confirmColor || '#3085d6',
      cancelButtonColor: options.cancelColor || '#d33',
      focusCancel: options.focusCancel || false,
      reverseButtons: options.reverseButtons || true,
      ...options
    };

    return Swal.fire(config);
  }, []);

  /**
   * Muestra un modal de carga
   */
  const showLoading = useCallback((message = 'Procesando...', options = {}) => {
    setIsLoading(true);
    
    const config = {
      ...defaultConfig,
      title: message,
      html: options.html || `
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
          <div class="spinner" style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <span>Por favor espera...</span>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      showCancelButton: false,
      ...options
    };

    return Swal.fire(config);
  }, []);

  /**
   * Cierra el modal de carga
   */
  const hideLoading = useCallback(() => {
    setIsLoading(false);
    Swal.close();
  }, []);

  /**
   * Muestra un modal con input
   */
  const showInput = useCallback((message, options = {}) => {
    const config = {
      ...defaultConfig,
      title: options.title || 'Ingresa el valor',
      text: message,
      input: options.inputType || 'text',
      inputPlaceholder: options.placeholder || '',
      inputValue: options.defaultValue || '',
      inputAttributes: options.inputAttributes || {},
      showCancelButton: true,
      confirmButtonText: options.confirmText || 'Confirmar',
      cancelButtonText: options.cancelText || 'Cancelar',
      inputValidator: options.validator,
      ...options
    };

    return Swal.fire(config);
  }, []);

  /**
   * Muestra un modal personalizado con HTML
   */
  const showCustomModal = useCallback((html, options = {}) => {
    const config = {
      ...defaultConfig,
      title: options.title || '',
      html: html,
      width: options.width || '600px',
      showCancelButton: options.showCancelButton || false,
      confirmButtonText: options.confirmText || 'Cerrar',
      ...options
    };

    return Swal.fire(config);
  }, []);

  /**
   * Muestra notificación de éxito con acción opcional
   */
  const showSuccess = useCallback((message, actionText = null, actionCallback = null) => {
    const config = {
      ...defaultConfig,
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      timer: actionText ? undefined : 3000,
      timerProgressBar: !actionText,
      showConfirmButton: !!actionText,
      confirmButtonText: actionText || 'OK'
    };

    const result = Swal.fire(config);
    
    if (actionText && actionCallback) {
      result.then((result) => {
        if (result.isConfirmed) {
          actionCallback();
        }
      });
    }

    return result;
  }, []);

  /**
   * Muestra notificación de error con detalles opcionales
   */
  const showError = useCallback((message, details = null) => {
    const config = {
      ...defaultConfig,
      title: 'Error',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'Entendido'
    };

    if (details) {
      config.footer = `<small style="color: #666;">${details}</small>`;
    }

    return Swal.fire(config);
  }, []);

  /**
   * Muestra un modal de eliminación estándar
   */
  const showDeleteConfirmation = useCallback((itemName = 'este elemento') => {
    return showConfirmation(
      `Esta acción no se puede deshacer. ${itemName} será eliminado permanentemente.`,
      {
        title: '¿Eliminar elemento?',
        icon: 'warning',
        confirmText: 'Sí, eliminar',
        confirmColor: '#d33',
        focusCancel: true
      }
    );
  }, [showConfirmation]);

  // Obtener título por defecto según el tipo
  const getDefaultTitle = (type) => {
    const titles = {
      success: '¡Éxito!',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información',
      question: 'Confirmación'
    };
    return titles[type] || 'Notificación';
  };

  return {
    showNotification,
    showConfirmation,
    showLoading,
    hideLoading,
    showInput,
    showCustomModal,
    showSuccess,
    showError,
    showDeleteConfirmation,
    isLoading
  };
};

export default useNotifications; 