-- =========================================================
-- SALUDAREACT - Estructura Mejorada de Base de Datos
-- Sistema de Agendas de Especialistas
-- =========================================================

-- Configuración inicial
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- =========================================================
-- TABLA: Especialidades
-- =========================================================
CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text,
  `color_calendario` varchar(7) DEFAULT '#1976d2',
  `estatus` enum('Activa','Inactiva') DEFAULT 'Activa',
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_estatus` (`estatus`),
  KEY `idx_id_hod` (`id_h_o_d`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Especialistas (Médicos)
-- =========================================================
CREATE TABLE `especialistas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(250) NOT NULL,
  `cedula_profesional` varchar(50) UNIQUE,
  `correo_electronico` varchar(200) UNIQUE,
  `telefono` varchar(20),
  `especialidad_id` int(11) NOT NULL,
  `fecha_nacimiento` date,
  `genero` enum('Masculino','Femenino','Otro'),
  `foto_perfil` varchar(500),
  `estatus` enum('Activo','Inactivo','Vacaciones','Licencia') DEFAULT 'Activo',
  `id_google_calendar` varchar(300),
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_especialidad` (`especialidad_id`),
  KEY `idx_estatus` (`estatus`),
  KEY `idx_id_hod` (`id_h_o_d`),
  FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Sucursales
-- =========================================================
CREATE TABLE `sucursales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `direccion` text,
  `telefono` varchar(20),
  `correo` varchar(200),
  `horario_apertura` time,
  `horario_cierre` time,
  `estatus` enum('Activa','Inactiva') DEFAULT 'Activa',
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_estatus` (`estatus`),
  KEY `idx_id_hod` (`id_h_o_d`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Consultorios
-- =========================================================
CREATE TABLE `consultorios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `numero` varchar(20),
  `sucursal_id` int(11) NOT NULL,
  `capacidad` int(11) DEFAULT 1,
  `equipamiento` text,
  `estatus` enum('Disponible','Ocupado','Mantenimiento','Inactivo') DEFAULT 'Disponible',
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sucursal` (`sucursal_id`),
  KEY `idx_estatus` (`estatus`),
  KEY `idx_id_hod` (`id_hod`),
  FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Pacientes
-- =========================================================
CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date,
  `genero` enum('Masculino','Femenino','Otro'),
  `telefono` varchar(20),
  `correo_electronico` varchar(200),
  `direccion` text,
  `tipo_sangre` varchar(5),
  `alergias` text,
  `antecedentes_medicos` text,
  `estatus` enum('Activo','Inactivo') DEFAULT 'Activo',
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nombre_apellido` (`nombre`, `apellido`),
  KEY `idx_telefono` (`telefono`),
  KEY `idx_correo` (`correo_electronico`),
  KEY `idx_estatus` (`estatus`),
  KEY `idx_id_hod` (`id_h_o_d`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Programación de Especialistas
-- =========================================================
CREATE TABLE `programacion_especialistas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `especialista_id` int(11) NOT NULL,
  `sucursal_id` int(11) NOT NULL,
  `consultorio_id` int(11),
  `tipo_programacion` enum('Regular','Temporal','Especial') DEFAULT 'Regular',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `intervalo_citas` int(11) DEFAULT 30 COMMENT 'Intervalo en minutos',
  `estatus` enum('Programada','Activa','Pausada','Finalizada','Cancelada') DEFAULT 'Programada',
  `notas` text,
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_especialista` (`especialista_id`),
  KEY `idx_sucursal` (`sucursal_id`),
  KEY `idx_consultorio` (`consultorio_id`),
  KEY `idx_fechas` (`fecha_inicio`, `fecha_fin`),
  KEY `idx_estatus` (`estatus`),
  KEY `idx_id_hod` (`id_h_o_d`),
  FOREIGN KEY (`especialista_id`) REFERENCES `especialistas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`consultorio_id`) REFERENCES `consultorios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Horarios Disponibles
-- =========================================================
CREATE TABLE `horarios_disponibles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `programacion_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estatus` enum('Disponible','Reservado','Ocupado','Bloqueado') DEFAULT 'Disponible',
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_programacion_fecha_hora` (`programacion_id`, `fecha`, `hora`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_hora` (`hora`),
  KEY `idx_estatus` (`estatus`),
  KEY `idx_id_hod` (`id_h_o_d`),
  FOREIGN KEY (`programacion_id`) REFERENCES `programacion_especialistas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Citas (Agenda Principal)
-- =========================================================
CREATE TABLE `citas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text,
  `paciente_id` int(11) NOT NULL,
  `especialista_id` int(11) NOT NULL,
  `sucursal_id` int(11) NOT NULL,
  `consultorio_id` int(11),
  `fecha_cita` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `tipo_cita` enum('Consulta','Control','Urgencia','Procedimiento','Cirugía','Rehabilitación','Psicología','Nutrición','Pediatría') DEFAULT 'Consulta',
  `estado_cita` enum('Pendiente','Confirmada','En Proceso','Completada','Cancelada','No Asistió') DEFAULT 'Pendiente',
  `costo` decimal(10,2) DEFAULT 0.00,
  `notas_adicionales` text,
  `color_calendario` varchar(7) DEFAULT '#1976d2',
  `id_google_event` varchar(500),
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_paciente` (`paciente_id`),
  KEY `idx_especialista` (`especialista_id`),
  KEY `idx_sucursal` (`sucursal_id`),
  KEY `idx_consultorio` (`consultorio_id`),
  KEY `idx_fecha_cita` (`fecha_cita`),
  KEY `idx_hora_inicio` (`hora_inicio`),
  KEY `idx_tipo_cita` (`tipo_cita`),
  KEY `idx_estado_cita` (`estado_cita`),
  KEY `idx_id_hod` (`id_h_o_d`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`especialista_id`) REFERENCES `especialistas`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`consultorio_id`) REFERENCES `consultorios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Historial de Cambios de Estado
-- =========================================================
CREATE TABLE `historial_estados_citas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cita_id` int(11) NOT NULL,
  `estado_anterior` enum('Pendiente','Confirmada','En Proceso','Completada','Cancelada','No Asistió'),
  `estado_nuevo` enum('Pendiente','Confirmada','En Proceso','Completada','Cancelada','No Asistió') NOT NULL,
  `motivo_cambio` text,
  `comentarios` text,
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cita` (`cita_id`),
  KEY `idx_estado_anterior` (`estado_anterior`),
  KEY `idx_estado_nuevo` (`estado_nuevo`),
  KEY `idx_fecha` (`agregado_el`),
  KEY `idx_id_hod` (`id_h_o_d`),
  FOREIGN KEY (`cita_id`) REFERENCES `citas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Notificaciones de Citas
-- =========================================================
CREATE TABLE `notificaciones_citas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cita_id` int(11) NOT NULL,
  `tipo_notificacion` enum('Recordatorio','Confirmación','Cambio','Cancelación') NOT NULL,
  `medio_envio` enum('SMS','Email','Push','WhatsApp') NOT NULL,
  `estado_envio` enum('Pendiente','Enviado','Fallido') DEFAULT 'Pendiente',
  `fecha_envio` timestamp NULL,
  `mensaje` text,
  `destinatario` varchar(200) NOT NULL,
  `id_h_o_d` varchar(100) NOT NULL,
  `agregado_por` varchar(200) DEFAULT NULL,
  `agregado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificado_por` varchar(200) DEFAULT NULL,
  `modificado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cita` (`cita_id`),
  KEY `idx_tipo` (`tipo_notificacion`),
  KEY `idx_estado` (`estado_envio`),
  KEY `idx_fecha_envio` (`fecha_envio`),
  KEY `idx_id_hod` (`id_hod`),
  FOREIGN KEY (`cita_id`) REFERENCES `citas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TABLA: Auditoría de Cambios
-- =========================================================
CREATE TABLE `auditoria_cambios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tabla` varchar(100) NOT NULL,
  `registro_id` int(11) NOT NULL,
  `tipo_operacion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `valores_anteriores` json,
  `valores_nuevos` json,
  `campos_modificados` json,
  `id_h_o_d` varchar(100) NOT NULL,
  `usuario` varchar(200) DEFAULT NULL,
  `ip_address` varchar(45),
  `user_agent` text,
  `fecha_operacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tabla` (`tabla`),
  KEY `idx_registro` (`registro_id`),
  KEY `idx_tipo` (`tipo_operacion`),
  KEY `idx_fecha` (`fecha_operacion`),
  KEY `idx_id_hod` (`id_h_o_d`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- TRIGGERS PARA AUDITORÍA
-- =========================================================

-- Trigger para auditoría de citas
DELIMITER $$
CREATE TRIGGER `auditoria_citas_insert` AFTER INSERT ON `citas`
FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_cambios` (
        `tabla`, `registro_id`, `tipo_operacion`, 
        `valores_nuevos`, `id_h_o_d`, `usuario`
    ) VALUES (
        'citas', NEW.id, 'INSERT',
        JSON_OBJECT(
            'titulo', NEW.titulo,
            'paciente_id', NEW.paciente_id,
            'especialista_id', NEW.especialista_id,
            'fecha_cita', NEW.fecha_cita,
            'estado_cita', NEW.estado_cita
        ),
        NEW.id_h_o_d, NEW.agregado_por
    );
END$$

CREATE TRIGGER `auditoria_citas_update` AFTER UPDATE ON `citas`
FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_cambios` (
        `tabla`, `registro_id`, `tipo_operacion`,
        `valores_anteriores`, `valores_nuevos`, `campos_modificados`,
        `id_h_o_d`, `usuario`
    ) VALUES (
        'citas', NEW.id, 'UPDATE',
        JSON_OBJECT(
            'titulo', OLD.titulo,
            'estado_cita', OLD.estado_cita,
            'hora_inicio', OLD.hora_inicio,
            'hora_fin', OLD.hora_fin
        ),
        JSON_OBJECT(
            'titulo', NEW.titulo,
            'estado_cita', NEW.estado_cita,
            'hora_inicio', NEW.hora_inicio,
            'hora_fin', NEW.hora_fin
        ),
        JSON_OBJECT(
            'titulo', IF(OLD.titulo != NEW.titulo, 1, 0),
            'estado_cita', IF(OLD.estado_cita != NEW.estado_cita, 1, 0),
            'hora_inicio', IF(OLD.hora_inicio != NEW.hora_inicio, 1, 0),
            'hora_fin', IF(OLD.hora_fin != NEW.hora_fin, 1, 0)
        ),
        NEW.id_h_o_d, NEW.modificado_por
    );
END$$

CREATE TRIGGER `auditoria_citas_delete` AFTER DELETE ON `citas`
FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_cambios` (
        `tabla`, `registro_id`, `tipo_operacion`,
        `valores_anteriores`, `id_h_o_d`
    ) VALUES (
        'citas', OLD.id, 'DELETE',
        JSON_OBJECT(
            'titulo', OLD.titulo,
            'paciente_id', OLD.paciente_id,
            'especialista_id', OLD.especialista_id,
            'fecha_cita', OLD.fecha_cita
        ),
        OLD.id_h_o_d
    );
END$$
DELIMITER ;

-- =========================================================
-- TRIGGER PARA HISTORIAL DE ESTADOS
-- =========================================================
DELIMITER $$
CREATE TRIGGER `historial_estados_citas_trigger` AFTER UPDATE ON `citas`
FOR EACH ROW
BEGIN
    IF OLD.estado_cita != NEW.estado_cita THEN
        INSERT INTO `historial_estados_citas` (
            `cita_id`, `estado_anterior`, `estado_nuevo`,
            `motivo_cambio`, `id_h_o_d`, `agregado_por`
        ) VALUES (
            NEW.id, OLD.estado_cita, NEW.estado_cita,
            CONCAT('Cambio automático de estado de ', OLD.estado_cita, ' a ', NEW.estado_cita),
            NEW.id_h_o_d, NEW.modificado_por
        );
    END IF;
END$$
DELIMITER ;

-- =========================================================
-- TRIGGER PARA ACTUALIZAR HORARIOS DISPONIBLES
-- =========================================================
DELIMITER $$
CREATE TRIGGER `actualizar_horarios_disponibles` AFTER INSERT ON `citas`
FOR EACH ROW
BEGIN
    -- Marcar el horario como ocupado
    UPDATE `horarios_disponibles` 
    SET `estatus` = 'Ocupado'
    WHERE `programacion_id` IN (
        SELECT `id` FROM `programacion_especialistas` 
        WHERE `especialista_id` = NEW.especialista_id 
        AND `sucursal_id` = NEW.sucursal_id
    )
    AND `fecha` = NEW.fecha_cita
    AND `hora` = NEW.hora_inicio;
END$$
DELIMITER ;

-- =========================================================
-- VISTAS ÚTILES
-- =========================================================

-- Vista para citas del día
CREATE VIEW `v_citas_hoy` AS
SELECT 
    c.id,
    c.titulo,
    c.fecha_cita,
    c.hora_inicio,
    c.hora_fin,
    c.estado_cita,
    c.tipo_cita,
    CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre,
    p.telefono AS paciente_telefono,
    CONCAT(e.nombre_completo) AS especialista_nombre,
    esp.nombre AS especialidad_nombre,
    s.nombre AS sucursal_nombre,
    co.nombre AS consultorio_nombre,
    c.color_calendario
FROM `citas` c
JOIN `pacientes` p ON c.paciente_id = p.id
JOIN `especialistas` e ON c.especialista_id = e.id
JOIN `especialidades` esp ON e.especialidad_id = esp.id
JOIN `sucursales` s ON c.sucursal_id = s.id
LEFT JOIN `consultorios` co ON c.consultorio_id = co.id
WHERE c.fecha_cita = CURDATE()
AND c.estado_cita IN ('Pendiente', 'Confirmada', 'En Proceso')
ORDER BY c.hora_inicio ASC;

-- Vista para estadísticas de citas
CREATE VIEW `v_estadisticas_citas` AS
SELECT 
    COUNT(*) AS total_citas,
    COUNT(CASE WHEN estado_cita = 'Pendiente' THEN 1 END) AS citas_pendientes,
    COUNT(CASE WHEN estado_cita = 'Confirmada' THEN 1 END) AS citas_confirmadas,
    COUNT(CASE WHEN estado_cita = 'En Proceso' THEN 1 END) AS citas_en_proceso,
    COUNT(CASE WHEN estado_cita = 'Completada' THEN 1 END) AS citas_completadas,
    COUNT(CASE WHEN estado_cita = 'Cancelada' THEN 1 END) AS citas_canceladas,
    COUNT(CASE WHEN estado_cita = 'No Asistió' THEN 1 END) AS citas_no_asistio,
    COUNT(CASE WHEN fecha_cita = CURDATE() THEN 1 END) AS citas_hoy,
    COUNT(CASE WHEN fecha_cita = CURDATE() + INTERVAL 1 DAY THEN 1 END) AS citas_manana
FROM `citas`
WHERE fecha_cita >= CURDATE() - INTERVAL 30 DAY;

-- =========================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =========================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX `idx_citas_especialista_fecha` ON `citas` (`especialista_id`, `fecha_cita`);
CREATE INDEX `idx_citas_sucursal_fecha` ON `citas` (`sucursal_id`, `fecha_cita`);
CREATE INDEX `idx_citas_estado_fecha` ON `citas` (`estado_cita`, `fecha_cita`);
CREATE INDEX `idx_horarios_programacion_fecha` ON `horarios_disponibles` (`programacion_id`, `fecha`, `hora`);

-- =========================================================
-- DATOS DE EJEMPLO
-- =========================================================

-- Insertar especialidades de ejemplo
INSERT INTO `especialidades` (`nombre`, `descripcion`, `color_calendario`, `id_h_o_d`) VALUES
('Cardiología', 'Especialidad médica que se encarga del diagnóstico y tratamiento de las enfermedades del corazón', '#e74c3c', 'HOD001'),
('Dermatología', 'Especialidad médica que se encarga del diagnóstico y tratamiento de las enfermedades de la piel', '#f39c12', 'HOD001'),
('Ginecología', 'Especialidad médica que se encarga de la salud reproductiva de la mujer', '#9b59b6', 'HOD001'),
('Pediatría', 'Especialidad médica que se encarga del cuidado de la salud de los niños', '#3498db', 'HOD001'),
('Ortopedia', 'Especialidad médica que se encarga del sistema musculoesquelético', '#2ecc71', 'HOD001');

-- Insertar sucursales de ejemplo
INSERT INTO `sucursales` (`nombre`, `direccion`, `telefono`, `correo`, `id_h_o_d`) VALUES
('Sucursal Centro', 'Av. Principal 123, Centro', '555-0101', 'centro@saludareact.com', 'HOD001'),
('Sucursal Norte', 'Blvd. Norte 456, Zona Norte', '555-0202', 'norte@saludareact.com', 'HOD001'),
('Sucursal Sur', 'Calle Sur 789, Zona Sur', '555-0303', 'sur@saludareact.com', 'HOD001');

-- Insertar consultorios de ejemplo
INSERT INTO `consultorios` (`nombre`, `numero`, `sucursal_id`, `capacidad`, `estatus`, `id_h_o_d`) VALUES
('Consultorio A', 'A-101', 1, 1, 'Disponible', 'HOD001'),
('Consultorio B', 'A-102', 1, 1, 'Disponible', 'HOD001'),
('Consultorio C', 'B-201', 2, 1, 'Disponible', 'HOD001'),
('Consultorio D', 'C-301', 3, 1, 'Disponible', 'HOD001');

COMMIT;

-- =========================================================
-- FIN DE LA ESTRUCTURA DE BASE DE DATOS
-- =========================================================
