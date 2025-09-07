-- Crear triggers para el sistema de programación

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

-- Verificar triggers creados
SHOW TRIGGERS;
