n# Documentación de Módulos - Sistema Saluda POS

## Descripción General

El sistema **Saluda POS** es una plataforma integral de gestión médica y farmacéutica desarrollada en PHP con MySQL, diseñada para centros médicos familiares. El sistema incluye múltiples módulos especializados para diferentes áreas de atención médica y administración.

## Arquitectura del Sistema

- **Backend**: PHP 8.2 con Apache
- **Base de Datos**: MySQL 8.0
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 4
- **Contenedorización**: Docker con docker-compose
- **Base de Datos**: `u155356178_saludapos`

## Módulos del Sistema

### 1. **AdminPOS** - Administración del Punto de Venta
**Ubicación**: `/AdminPOS/`
**Funcionalidad**: Módulo principal de administración del punto de venta
- **Características**:
  - Registro y control de ventas realizadas
  - Filtros por sucursal, mes, producto y forma de pago
  - Gestión de inventario y productos
  - Reportes de ventas diarias
  - Control de caja y fondos
- **Archivos principales**:
  - `index.php` - Dashboard principal de ventas
  - `Consultas/` - Lógica de base de datos
  - `Modales/` - Interfaces de usuario modales
  - `js/` - Scripts de control de ventas

### 2. **AgendaDeCitas** - Sistema de Agendamiento
**Ubicación**: `/AgendaDeCitas/`
**Funcionalidad**: Gestión completa de citas médicas
- **Características**:
  - Calendario interactivo con FullCalendar
  - Agendamiento de citas para especialistas
  - Gestión de pacientes y médicos
  - Control de campañas médicas
  - Reportes de citas y cancelaciones
  - Registro de signos vitales
- **Archivos principales**:
  - `index.php` - Calendario principal de citas
  - `Calendario.php` - Vista de calendario
  - `Nuevacita.php` - Formulario de nueva cita
  - `Reportes.php` - Generación de reportes

### 3. **AgendaDeEspecialistas** - Gestión de Especialistas
**Ubicación**: `/AgendaDeEspecialistas/`
**Funcionalidad**: Módulo especializado para gestión de especialistas médicos
- **Características**:
  - Agendamiento específico para especialistas
  - Gestión de horarios y disponibilidad
  - Control de consultas especializadas
  - Reportes de especialistas

### 4. **AgendaEspecialistas** - Alternativa de Especialistas
**Ubicación**: `/AgendaEspecialistas/`
**Funcionalidad**: Módulo alternativo para gestión de especialistas
- **Características**:
  - Similar a AgendaDeEspecialistas
  - Interfaz optimizada para especialistas
  - Gestión de citas especializadas

### 5. **App** - Aplicación Principal
**Ubicación**: `/App/`
**Funcionalidad**: Aplicación principal con navegación entre módulos
- **Características**:
  - Dashboard principal del sistema
  - Navegación entre módulos
  - Control de acceso y autenticación
  - Interfaz de usuario unificada
- **Componentes**:
  - `index.php` - Página principal
  - `Header.php` - Cabecera del sistema
  - `Footer.php` - Pie de página
  - `Scripts/` - Scripts de navegación

### 6. **CEDIS** - Centro de Distribución
**Ubicación**: `/CEDIS/`
**Funcionalidad**: Gestión del centro de distribución
- **Características**:
  - Control de traspasos entre sucursales
  - Gestión de inventario centralizado
  - Reportes de distribución
  - Control de stock

### 7. **CEDISMOVIL** - CEDIS Móvil
**Ubicación**: `/CEDISMOVIL/`
**Funcionalidad**: Versión móvil del centro de distribución
- **Características**:
  - Interfaz optimizada para dispositivos móviles
  - Gestión de traspasos móvil
  - Acceso remoto al inventario

### 8. **ControlDental** - Control Dental
**Ubicación**: `/ControlDental/`
**Funcionalidad**: Módulo especializado para servicios dentales
- **Características**:
  - Gestión de pacientes dentales
  - Control de créditos dentales
  - Registro de abonos
  - Procedimientos dentales
  - Reportes especializados

### 9. **Medicos** - Módulo Médico
**Ubicación**: `/Medicos/`
**Funcionalidad**: Gestión de servicios médicos generales
- **Características**:
  - Gestión de pacientes médicos
  - Control de expedientes
  - Registro de signos vitales
  - Procedimientos médicos
  - Reportes médicos

### 10. **POS2** - Punto de Venta Principal
**Ubicación**: `/POS2/`
**Funcionalidad**: Sistema principal de punto de venta
- **Características**:
  - Gestión de caja y fondos
  - Control de traspasos
  - Consulta de productos
  - Sistema de notificaciones
  - Reportes de incidencias
  - Gestión de créditos

### 11. **ServiciosEspecializados** - Servicios Especializados
**Ubicación**: `/ServiciosEspecializados/`
**Funcionalidad**: Gestión de servicios médicos especializados
- **Características**:
  - Control de ultrasonidos
  - Gestión de estudios especializados
  - Entrega de resultados
  - Reportes de servicios

### 12. **Tickets** - Sistema de Tickets
**Ubicación**: `/Tickets/`
**Funcionalidad**: Sistema de soporte y tickets
- **Características**:
  - Registro de tickets de soporte
  - Gestión de incidencias
  - Sistema de notificaciones
  - Reportes de soporte
- **Componentes**:
  - `TicketsSoporte.php` - Interfaz principal
  - `Consultas/` - Lógica de base de datos
  - `Modales/` - Formularios de tickets

### 13. **Gestoria** - Gestión Administrativa
**Ubicación**: `/Gestoria/`
**Funcionalidad**: Módulo de gestión administrativa integral
- **Características**:
  - Gestión de abonos y créditos
  - Control de caja administrativa
  - Agendamiento de laboratorios
  - Gestión de pacientes
  - Control de compras
  - Reportes administrativos
  - Gestión de inventario
  - Cotizaciones y presupuestos

### 14. **Enfermeria2** - Módulo de Enfermería
**Ubicación**: `/Enfermeria2/`
**Funcionalidad**: Gestión de servicios de enfermería
- **Características**:
  - Control de pacientes de enfermería
  - Gestión de procedimientos
  - Registro de signos vitales
  - Reportes de enfermería

### 15. **JefaturaEnfermeria** - Jefatura de Enfermería
**Ubicación**: `/JefaturaEnfermeria/`
**Funcionalidad**: Módulo de supervisión de enfermería
- **Características**:
  - Supervisión de personal de enfermería
  - Control de procedimientos
  - Reportes de jefatura
  - Gestión de recursos

## Módulos de Soporte

### **FotografiasCredenciales**
**Ubicación**: `/FotografiasCredenciales/`
**Funcionalidad**: Almacenamiento de fotografías para credenciales

### **FotosMedidores**
**Ubicación**: `/FotosMedidores/`
**Funcionalidad**: Almacenamiento de fotografías de medidores médicos

### **Perfiles**
**Ubicación**: `/Perfiles/`
**Funcionalidad**: Gestión de perfiles de usuario

## Archivos de Configuración

### **Docker Configuration**
- `docker-compose.yml` - Configuración de contenedores
- `Dockerfile` - Imagen de PHP 8.2 con Apache
- Servicios incluidos:
  - Web (PHP/Apache)
  - MySQL 8.0
  - phpMyAdmin

### **Base de Datos**
- `Saludabueno.sql` - Script principal de base de datos
- `u155356178_SaludaHuellas.sql` - Script de huellas dactilares

### **Utilidades**
- `PreciosFestivos.php` - Gestión de precios en días festivos
- `endpoint/guardaregistrosweb.php` - API para registro web

## Características Técnicas

### **Tecnologías Utilizadas**
- **Backend**: PHP 8.2, MySQL 8.0
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 4
- **Librerías**: jQuery, DataTables, FullCalendar, Chart.js
- **Contenedorización**: Docker, Docker Compose

### **Funcionalidades Principales**
- Sistema de autenticación y autorización
- Gestión de múltiples sucursales
- Control de inventario en tiempo real
- Sistema de reportes avanzado
- Interfaz responsive
- Notificaciones en tiempo real
- Gestión de archivos y documentos

### **Base de Datos**
- **Nombre**: `u155356178_saludapos`
- **Características**:
  - Codificación UTF-8
  - Triggers para control de stock
  - Tablas especializadas por módulo
  - Sistema de auditoría

## Estructura de Archivos Común

Cada módulo principal sigue una estructura similar:
```
Modulo/
├── index.php              # Página principal
├── Header.php             # Cabecera común
├── Menu.php               # Menú de navegación
├── footer.php             # Pie de página
├── Consultas/             # Lógica de base de datos
├── Modales/               # Formularios modales
├── js/                    # Scripts JavaScript
├── plugins/               # Librerías externas
├── dist/                  # Archivos compilados
└── pages/                 # Páginas adicionales
```

## Consideraciones de Seguridad

- Sistema de autenticación por cookies
- Validación de sesiones
- Control de acceso por perfiles
- Sanitización de datos de entrada
- Conexiones seguras a base de datos

## Mantenimiento y Soporte

- Sistema de tickets integrado
- Logs de actividad
- Reportes de errores
- Modo de mantenimiento
- Backup automático de base de datos

---

*Documentación generada automáticamente para el Sistema Saluda POS*
*Fecha de generación: $(date)*
