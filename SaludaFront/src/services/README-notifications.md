# Sistema de Notificaciones Material Design

Este sistema de notificaciones se integra perfectamente con el diseño Material de tu aplicación y reemplaza los `alert()` nativos del navegador.

## Características

- ✅ **Diseño Material Design** - Se integra con tu tema
- ✅ **Animaciones suaves** - Entrada y salida con transiciones
- ✅ **Múltiples tipos** - Éxito, Error, Advertencia, Información
- ✅ **Auto-cierre configurable** - Duración personalizable
- ✅ **Múltiples notificaciones** - Se apilan automáticamente
- ✅ **Responsive** - Se adapta a diferentes tamaños de pantalla
- ✅ **Fácil de usar** - API simple y consistente

## Uso Básico

### Importar el servicio
```javascript
import notificationService from 'services/notification-service';
```

### Mostrar notificaciones
```javascript
// Notificación de éxito
notificationService.success('Operación completada exitosamente');

// Notificación de error
notificationService.error('Ha ocurrido un error');

// Notificación de advertencia
notificationService.warning('Ten cuidado con esta acción');

// Notificación informativa
notificationService.info('Información importante');
```

## Uso con Hook Personalizado

### Importar el hook
```javascript
import useNotifications from 'hooks/useNotifications';
```

### En tu componente
```javascript
const MyComponent = () => {
  const { success, error, warning, info } = useNotifications();

  const handleSave = async () => {
    try {
      await saveData();
      success('Datos guardados correctamente');
    } catch (err) {
      error('Error al guardar los datos');
    }
  };

  return (
    <button onClick={handleSave}>
      Guardar
    </button>
  );
};
```

## Opciones Avanzadas

### Configurar duración y título personalizado
```javascript
notificationService.success('Mensaje personalizado', {
  title: 'Título Personalizado',
  duration: 3000, // 3 segundos
  autoClose: true
});
```

### Notificación sin auto-cierre
```javascript
notificationService.info('Esta notificación no se cierra automáticamente', {
  autoClose: false
});
```

### Cerrar notificación manualmente
```javascript
const notificationId = notificationService.success('Mensaje');
// Más tarde...
notificationService.hide(notificationId);
```

### Limpiar todas las notificaciones
```javascript
notificationService.clear();
```

## Tipos de Notificación

| Tipo | Color | Icono | Uso |
|------|-------|-------|-----|
| `success` | Verde | check_circle | Operaciones exitosas |
| `error` | Rojo | error | Errores y fallos |
| `warning` | Naranja | warning | Advertencias |
| `info` | Azul | info | Información general |

## Integración con APIs

### Ejemplo con servicios
```javascript
const handleCreateItem = async (data) => {
  try {
    const response = await apiService.create(data);
    
    if (response.success) {
      notificationService.success('Elemento creado exitosamente');
    } else {
      // Mostrar errores de validación
      if (response.errors) {
        const errorMessages = Object.values(response.errors).flat().join(', ');
        notificationService.error(`Error de validación: ${errorMessages}`);
      } else {
        notificationService.error(response.message || 'Error desconocido');
      }
    }
  } catch (error) {
    notificationService.error('Error de conexión');
  }
};
```

## Personalización

### Cambiar colores
Los colores se pueden personalizar en `notification-service.js`:

```javascript
const colors = {
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3'
};
```

### Cambiar posición
Modifica el CSS en el método `init()`:

```javascript
this.container.style.cssText = `
  position: fixed;
  top: 20px;        // Distancia desde arriba
  right: 20px;      // Distancia desde la derecha
  z-index: 9999;
  // ... más estilos
`;
```

## Migración desde alert()

### Antes
```javascript
alert('Operación exitosa');
alert('Error: ' + errorMessage);
```

### Después
```javascript
notificationService.success('Operación exitosa');
notificationService.error('Error: ' + errorMessage);
```

## Demostración

Para ver una demostración completa, importa y usa el componente `NotificationDemo`:

```javascript
import NotificationDemo from 'components/NotificationDemo';

// En tu componente
<NotificationDemo />
```

## Ventajas sobre alert()

- ✅ **No bloquea la interfaz** - El usuario puede seguir trabajando
- ✅ **Diseño consistente** - Se integra con tu tema Material
- ✅ **Múltiples mensajes** - Puede mostrar varios a la vez
- ✅ **Animaciones** - Experiencia de usuario mejorada
- ✅ **Personalizable** - Colores, duración, posición
- ✅ **Responsive** - Se adapta a móviles y tablets 