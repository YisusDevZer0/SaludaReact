-- Script para crear las tablas de programación de especialistas
-- Ejecutar este script directamente en la base de datos

-- 1. Crear tabla principal de programaciones
CREATE TABLE `Programacion_MedicosExt` (
  `ID_Programacion` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `FK_Medico` bigint(20) unsigned NOT NULL,
  `Fk_Sucursal` int(11) NOT NULL,
  `Tipo_Programacion` varchar(100) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  `Hora_inicio` time NOT NULL,
  `Hora_Fin` time NOT NULL,
  `Intervalo` int(11) NOT NULL,
  `Estatus` varchar(200) NOT NULL,
  `ProgramadoPor` varchar(300) NOT NULL,
  `ProgramadoEn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Sistema` varchar(300) NOT NULL,
  `ID_H_O_D` varchar(300) NOT NULL,
  PRIMARY KEY (`ID_Programacion`),
  KEY `FK_Medico` (`FK_Medico`),
  KEY `Fk_Sucursal` (`Fk_Sucursal`),
  KEY `Estatus` (`Estatus`),
  KEY `Fecha_Inicio` (`Fecha_Inicio`),
  KEY `Fecha_Fin` (`Fecha_Fin`),
  CONSTRAINT `programacion_medicosext_fk_medico_foreign` FOREIGN KEY (`FK_Medico`) REFERENCES `especialistas` (`Especialista_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- 2. Crear tabla de fechas
CREATE TABLE `Fechas_EspecialistasExt` (
  `ID_Fecha_Esp` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Fecha_Disponibilidad` date NOT NULL,
  `ID_H_O_D` varchar(200) NOT NULL,
  `FK_Especialista` bigint(20) unsigned NOT NULL,
  `Fk_Programacion` bigint(20) unsigned NOT NULL,
  `Estado` varchar(50) NOT NULL,
  `Agrego` varchar(200) NOT NULL,
  `Agregadoen` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ID_Fecha_Esp`),
  KEY `ID_H_O_D` (`ID_H_O_D`),
  KEY `Fecha_Disponibilidad` (`Fecha_Disponibilidad`),
  KEY `FK_Especialista` (`FK_Especialista`),
  KEY `Fk_Programacion` (`Fk_Programacion`),
  KEY `Estado` (`Estado`),
  CONSTRAINT `fechas_especialistasext_fk_especialista_foreign` FOREIGN KEY (`FK_Especialista`) REFERENCES `especialistas` (`Especialista_ID`) ON DELETE CASCADE,
  CONSTRAINT `fechas_especialistasext_fk_programacion_foreign` FOREIGN KEY (`Fk_Programacion`) REFERENCES `Programacion_MedicosExt` (`ID_Programacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- 3. Crear tabla de horarios
CREATE TABLE `Horarios_Citas_Ext` (
  `ID_Horario` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Horario_Disponibilidad` time NOT NULL,
  `ID_H_O_D` varchar(200) NOT NULL,
  `FK_Especialista` bigint(20) unsigned NOT NULL,
  `FK_Fecha` bigint(20) unsigned NOT NULL,
  `Fk_Programacion` bigint(20) unsigned NOT NULL,
  `Estado` varchar(50) NOT NULL,
  `AgregadoPor` varchar(150) NOT NULL,
  `AgregadoEl` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID_Horario`),
  KEY `ID_H_O_D` (`ID_H_O_D`),
  KEY `Horario_Disponibilidad` (`Horario_Disponibilidad`),
  KEY `FK_Especialista` (`FK_Especialista`),
  KEY `FK_Fecha` (`FK_Fecha`),
  KEY `Fk_Programacion` (`Fk_Programacion`),
  KEY `Estado` (`Estado`),
  CONSTRAINT `horarios_citas_ext_fk_especialista_foreign` FOREIGN KEY (`FK_Especialista`) REFERENCES `especialistas` (`Especialista_ID`) ON DELETE CASCADE,
  CONSTRAINT `horarios_citas_ext_fk_fecha_foreign` FOREIGN KEY (`FK_Fecha`) REFERENCES `Fechas_EspecialistasExt` (`ID_Fecha_Esp`) ON DELETE CASCADE,
  CONSTRAINT `horarios_citas_ext_fk_programacion_foreign` FOREIGN KEY (`Fk_Programacion`) REFERENCES `Programacion_MedicosExt` (`ID_Programacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- 4. Crear tabla de auditoría
CREATE TABLE `Programacion_MedicosExt_Completos` (
  `ID_Programacion_Completo` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ID_Programacion` bigint(20) unsigned NOT NULL,
  `FK_Medico` bigint(20) unsigned NOT NULL,
  `Fk_Sucursal` int(11) NOT NULL,
  `Tipo_Programacion` varchar(100) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  `Hora_inicio` time NOT NULL,
  `Hora_Fin` time NOT NULL,
  `Intervalo` int(11) NOT NULL,
  `Estatus` varchar(200) NOT NULL,
  `ProgramadoPor` varchar(300) NOT NULL,
  `ProgramadoEn` timestamp NOT NULL,
  `Sistema` varchar(300) NOT NULL,
  `ID_H_O_D` varchar(300) NOT NULL,
  `Fecha_Eliminacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID_Programacion_Completo`),
  KEY `ID_Programacion` (`ID_Programacion`),
  KEY `FK_Medico` (`FK_Medico`),
  KEY `Fecha_Eliminacion` (`Fecha_Eliminacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- 5. Crear triggers
DELIMITER $$

-- Trigger para actualizar estado de programación cuando se inserta una fecha
CREATE TRIGGER `ActualizaFechas` AFTER INSERT ON `Fechas_EspecialistasExt` FOR EACH ROW 
BEGIN
    UPDATE Programacion_MedicosExt
    SET Programacion_MedicosExt.Estatus = "Autorizar Horas"
    WHERE Programacion_MedicosExt.ID_Programacion = NEW.Fk_Programacion;
END$$

-- Trigger para registrar programaciones eliminadas
CREATE TRIGGER `Horarios_completos` AFTER DELETE ON `Programacion_MedicosExt` FOR EACH ROW 
BEGIN
    INSERT INTO Programacion_MedicosExt_Completos
    (ID_Programacion, FK_Medico, Fk_Sucursal, Tipo_Programacion, Fecha_Inicio, Fecha_Fin, Hora_inicio, Hora_Fin, Intervalo, Estatus, ProgramadoPor, ProgramadoEn, Sistema, ID_H_O_D)
    VALUES (OLD.ID_Programacion, OLD.FK_Medico, OLD.Fk_Sucursal, OLD.Tipo_Programacion, OLD.Fecha_Inicio, OLD.Fecha_Fin, OLD.Hora_inicio, OLD.Hora_Fin, OLD.Intervalo, OLD.Estatus, OLD.ProgramadoPor, NOW(), OLD.Sistema, OLD.ID_H_O_D);
END$$

DELIMITER ;

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas:' as Status;
SHOW TABLES LIKE '%Programacion%';
SHOW TABLES LIKE '%Fechas%';
SHOW TABLES LIKE '%Horarios%';

SELECT 'Triggers creados:' as Status;
SHOW TRIGGERS;
