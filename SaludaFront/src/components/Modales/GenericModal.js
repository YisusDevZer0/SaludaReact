/**
=========================================================
* SaludaReact - Modal Genérico Reutilizable
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Box,
  Alert
} from "@mui/material";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Componentes
import StandardModal from "./StandardModal";

const GenericModal = ({ 
  open, 
  onClose, 
  mode = "create", // "create", "view", "edit"
  data = null,
  onSuccess,
  title,
  fields = [],
  service = null,
  entityName = "entidad"
}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Inicializar datos del formulario
  useEffect(() => {
    if (open) {
      const initialData = {};
      fields.forEach(field => {
        if (data && (mode === "edit" || mode === "view")) {
          // Manejar fechas
          if (field.type === "date" && data[field.name]) {
            initialData[field.name] = data[field.name].split('T')[0];
          } else {
            initialData[field.name] = data[field.name] || field.defaultValue || "";
          }
        } else {
          initialData[field.name] = field.defaultValue || "";
        }
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [open, data, mode, fields]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} es requerido`;
      }

      if (field.validation) {
        const validationError = field.validation(formData[field.name]);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      if (mode === "create") {
        // Intentar diferentes métodos de creación que usan los servicios
        if (service.create) {
          result = await service.create(formData);
        } else if (service.createEntity) {
          result = await service.createEntity(formData);
        } else if (service.store) {
          result = await service.store(formData);
        } else {
          throw new Error('Método de creación no encontrado en el servicio');
        }
      } else if (mode === "edit") {
        // Intentar diferentes métodos de actualización
        if (service.update) {
          result = await service.update(data.id, formData);
        } else if (service.updateEntity) {
          result = await service.updateEntity(data.id, formData);
        } else {
          throw new Error('Método de actualización no encontrado en el servicio');
        }
      }

      // Verificar si la operación fue exitosa
      if (result && !result.success && result.success !== undefined) {
        setGeneralError(result.message || 'Error en la operación');
        return;
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error al guardar ${entityName}:`, error);
      setGeneralError(error.message || `Error al guardar ${entityName}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!data) return;

    setLoading(true);
    try {
      let result;
      // Intentar diferentes métodos de eliminación
      if (service.delete) {
        result = await service.delete(data.id);
      } else if (service.deleteEntity) {
        result = await service.deleteEntity(data.id);
      } else if (service.destroy) {
        result = await service.destroy(data.id);
      } else {
        throw new Error('Método de eliminación no encontrado en el servicio');
      }

      // Verificar si la operación fue exitosa
      if (result && !result.success && result.success !== undefined) {
        setGeneralError(result.message || 'Error al eliminar');
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error al eliminar ${entityName}:`, error);
      setGeneralError(error.message || `Error al eliminar ${entityName}`);
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create": return `Nuevo ${title}`;
      case "view": return `Ver ${title}`;
      case "edit": return `Editar ${title}`;
      default: return title;
    }
  };

  const isViewMode = mode === "view";

  const renderField = (field) => {
    const commonProps = {
      fullWidth: true,
      label: field.label,
      value: formData[field.name] || "",
      onChange: (e) => handleInputChange(field.name, e.target.value),
      disabled: isViewMode,
      error: !!errors[field.name],
      helperText: errors[field.name],
      required: field.required,
      InputLabelProps: field.type === "date" ? { shrink: true } : {},
      sx: {
        '& .MuiOutlinedInput-root': {
          height: '56px', // Altura consistente para todos los campos
          '& .MuiSelect-select': {
            height: '56px',
            display: 'flex',
            alignItems: 'center'
          }
        },
        '& .MuiInputBase-input': {
          height: '56px',
          display: 'flex',
          alignItems: 'center'
        }
      }
    };

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <TextField
            {...commonProps}
            type={field.type}
            multiline={field.multiline}
            rows={field.rows || 1}
            sx={{
              ...commonProps.sx,
              '& .MuiOutlinedInput-root': {
                height: field.multiline ? 'auto' : '56px',
                minHeight: field.multiline ? '56px' : '56px'
              }
            }}
          />
        );

      case "date":
        return (
          <TextField
            {...commonProps}
            type="date"
          />
        );

      case "select":
        return (
          <FormControl 
            {...commonProps}
            sx={{
              ...commonProps.sx,
              '& .MuiFormControl-root': {
                width: '100%'
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 16px) scale(1)',
                '&.Mui-focused, &.MuiFormLabel-filled': {
                  transform: 'translate(14px, -9px) scale(0.75)'
                }
              }
            }}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={isViewMode}
              label={field.label}
              sx={{
                height: '56px',
                '& .MuiSelect-select': {
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "switch":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={formData[field.name] || false}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                disabled={isViewMode}
              />
            }
            label={field.label}
          />
        );

      default:
        return (
          <TextField
            {...commonProps}
            type="text"
          />
        );
    }
  };

  // Acciones del modal
  const modalActions = (
    <>
      <MDButton onClick={onClose} color="secondary" disabled={loading}>
        Cancelar
      </MDButton>
      
      {mode === "view" && data && (
        <>
          <MDButton
            onClick={() => {/* Cambiar a modo edit - debe ser manejado por componente padre */}}
            color="info"
          >
            Editar
          </MDButton>
          <MDButton
            onClick={handleSoftDelete}
            color="error"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </MDButton>
        </>
      )}
      
      {mode === "edit" && (
        <MDButton
          onClick={handleSubmit}
          color="success"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </MDButton>
      )}
      
      {mode === "create" && (
        <MDButton
          onClick={handleSubmit}
          color="success"
          disabled={loading}
        >
          {loading ? "Creando..." : `Crear ${title}`}
        </MDButton>
      )}
    </>
  );

  return (
    <StandardModal
      open={open}
      onClose={onClose}
      title={getModalTitle()}
      maxWidth="md"
      loading={loading}
      actions={modalActions}
    >
      {generalError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {generalError}
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3,
        maxHeight: '60vh',
        overflowY: 'auto',
        pr: 1
      }}>
        {fields.map((field, index) => (
          <Box key={index} sx={{ width: '100%' }}>
            {renderField(field)}
          </Box>
        ))}
      </Box>
    </StandardModal>
  );

};

export default GenericModal; 