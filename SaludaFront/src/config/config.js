// Configuración del entorno
const config = {
    // URL base de la API
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    
    // Configuración de la aplicación
    APP_NAME: 'SaludaReact',
    APP_VERSION: '1.0.0',
    
    // Configuración de paginación
    DEFAULT_PAGE_SIZE: 15,
    MAX_PAGE_SIZE: 100,
    
    // Configuración de fechas
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    
    // Configuración de intervalos de citas (en minutos)
    INTERVALOS_CITAS: [15, 30, 45, 60, 90, 120],
    
    // Estados de citas
    ESTADOS_CITA: [
        'Pendiente',
        'Confirmada', 
        'En Proceso',
        'Completada',
        'Cancelada',
        'No Asistió'
    ],
    
    // Tipos de cita
    TIPOS_CITA: [
        'Consulta',
        'Control',
        'Urgencia',
        'Procedimiento',
        'Cirugía',
        'Rehabilitación',
        'Psicología',
        'Nutrición',
        'Pediatría'
    ],
    
    // Tipos de programación
    TIPOS_PROGRAMACION: [
        'Regular',
        'Temporal',
        'Especial'
    ],
    
    // Estados de programación
    ESTADOS_PROGRAMACION: [
        'Programada',
        'Activa',
        'Pausada',
        'Finalizada',
        'Cancelada'
    ],
    
    // Estados de horarios
    ESTADOS_HORARIO: [
        'Disponible',
        'Reservado',
        'Ocupado',
        'Bloqueado'
    ],
    
    // Colores para el calendario
    COLORES_CALENDARIO: [
        '#1976d2', // Azul
        '#388e3c', // Verde
        '#f57c00', // Naranja
        '#d32f2f', // Rojo
        '#7b1fa2', // Púrpura
        '#0097a7', // Cian
        '#ff8f00', // Ámbar
        '#5d4037', // Marrón
        '#424242', // Gris
        '#c2185b'  // Rosa
    ],
    
    // Configuración de notificaciones
    NOTIFICACIONES: {
        DURACION: 5000, // 5 segundos
        POSICION: 'top-right'
    },
    
    // Configuración de validación
    VALIDACION: {
        MIN_LENGTH_NOMBRE: 2,
        MAX_LENGTH_NOMBRE: 50,
        MIN_LENGTH_DESCRIPCION: 10,
        MAX_LENGTH_DESCRIPCION: 1000,
        MIN_INTERVALO_CITAS: 15,
        MAX_INTERVALO_CITAS: 120
    },
    
    // Configuración de archivos
    ARCHIVOS: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        TIPOS_PERMITIDOS: ['image/jpeg', 'image/png', 'image/gif'],
        MAX_FILES: 5
    }
};

export default config;

// Exportar constantes individuales para uso directo
export const {
    API_BASE_URL,
    APP_NAME,
    APP_VERSION,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    DATE_FORMAT,
    TIME_FORMAT,
    DATETIME_FORMAT,
    INTERVALOS_CITAS,
    ESTADOS_CITA,
    TIPOS_CITA,
    TIPOS_PROGRAMACION,
    ESTADOS_PROGRAMACION,
    ESTADOS_HORARIO,
    COLORES_CALENDARIO,
    NOTIFICACIONES,
    VALIDACION,
    ARCHIVOS
} = config;
