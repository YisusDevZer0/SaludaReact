import { createRoot } from 'react-dom/client';

// Tipos de notificación disponibles
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de colores para cada tipo
const NOTIFICATION_CONFIG = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    color: 'success',
    icon: 'check_circle',
    title: '¡Éxito!'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    color: 'error',
    icon: 'error',
    title: 'Error'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    color: 'warning',
    icon: 'warning',
    title: 'Advertencia'
  },
  [NOTIFICATION_TYPES.INFO]: {
    color: 'info',
    icon: 'info',
    title: 'Información'
  }
};

class NotificationService {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.init();
  }

  init() {
    // Crear contenedor para las notificaciones si no existe
    if (!document.getElementById('notification-container')) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      `;
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('notification-container');
    }
  }

  show(type, message, options = {}) {
    const config = NOTIFICATION_CONFIG[type];
    const id = Date.now() + Math.random();
    
    const notification = {
      id,
      type,
      message,
      title: options.title || config.title,
      icon: options.icon || config.icon,
      color: options.color || config.color,
      duration: options.duration || 5000,
      autoClose: options.autoClose !== false
    };

    this.notifications.push(notification);
    this.renderNotification(notification);

    // Auto cerrar si está habilitado
    if (notification.autoClose) {
      setTimeout(() => {
        this.hide(id);
      }, notification.duration);
    }

    return id;
  }

  renderNotification(notification) {
    const notificationElement = document.createElement('div');
    notificationElement.id = `notification-${notification.id}`;
    notificationElement.style.cssText = `
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 16px;
      margin-bottom: 8px;
      border-left: 4px solid;
      border-left-color: ${this.getColorValue(notification.color)};
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
      word-wrap: break-word;
    `;

    notificationElement.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="
          color: ${this.getColorValue(notification.color)};
          font-size: 20px;
          margin-top: 2px;
        ">
          <span class="material-icons">${notification.icon}</span>
        </div>
        <div style="flex: 1;">
          <div style="
            font-weight: 600;
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          ">${notification.title}</div>
          <div style="
            font-size: 13px;
            color: #666;
            line-height: 1.4;
          ">${notification.message}</div>
        </div>
        <button onclick="window.notificationService.hide('${notification.id}')" style="
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          font-size: 16px;
          margin-left: 8px;
        ">
          <span class="material-icons">close</span>
        </button>
      </div>
    `;

    this.container.appendChild(notificationElement);

    // Animación de entrada
    setTimeout(() => {
      notificationElement.style.transform = 'translateX(0)';
    }, 10);
  }

  hide(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) return;

    const element = document.getElementById(`notification-${id}`);
    if (element) {
      element.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    }

    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getColorValue(color) {
    const colors = {
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3'
    };
    return colors[color] || colors.info;
  }

  // Métodos de conveniencia
  success(message, options = {}) {
    return this.show(NOTIFICATION_TYPES.SUCCESS, message, options);
  }

  error(message, options = {}) {
    return this.show(NOTIFICATION_TYPES.ERROR, message, options);
  }

  warning(message, options = {}) {
    return this.show(NOTIFICATION_TYPES.WARNING, message, options);
  }

  info(message, options = {}) {
    return this.show(NOTIFICATION_TYPES.INFO, message, options);
  }

  // Limpiar todas las notificaciones
  clear() {
    this.notifications.forEach(notification => {
      this.hide(notification.id);
    });
  }
}

// Crear instancia global
const notificationService = new NotificationService();

// Hacer disponible globalmente para el botón de cerrar
window.notificationService = notificationService;

export default notificationService; 