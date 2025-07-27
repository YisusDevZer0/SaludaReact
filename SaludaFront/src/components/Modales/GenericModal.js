/**
=========================================================
* SaludaReact - Modal Genérico Reutilizable
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

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
      if (mode === "create") {
        await service.createEntity(formData);
      } else if (mode === "edit") {
        await service.updateEntity(data.id, formData);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error al guardar ${entityName}:`, error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!data) return;

    setLoading(true);
    try {
      await service.deleteEntity(data.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error al eliminar ${entityName}:`, error);
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)'
        }
      }}
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
          color: darkMode ? '#ffffff' : 'inherit',
          '& .MuiDialogTitle-root': {
            backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
            color: darkMode ? '#ffffff' : '#333333',
            borderBottom: darkMode ? '1px solid #404040' : '1px solid #e0e0e0'
          },
          '& .MuiDialogContent-root': {
            backgroundColor: darkMode ? '#1a1a1a' : 'white',
            color: darkMode ? '#ffffff' : 'inherit'
          },
          '& .MuiDialogActions-root': {
            backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
            borderTop: darkMode ? '1px solid #404040' : '1px solid #e0e0e0'
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
        color: darkMode ? '#ffffff' : '#333333',
        borderBottom: darkMode ? '1px solid #404040' : '1px solid #e0e0e0'
      }}>
        <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"}>
          {getModalTitle()}
        </MDTypography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ 
            color: darkMode ? '#ffffff' : '#666666',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        pt: 2,
        backgroundColor: darkMode ? '#1a1a1a' : 'white',
        color: darkMode ? '#ffffff' : 'inherit',
        '& .MuiTextField-root': {
          '& .MuiInputLabel-root': {
            color: darkMode ? '#b0b0b0' : '#666666'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: darkMode ? '#404040' : '#e0e0e0'
            },
            '&:hover fieldset': {
              borderColor: darkMode ? '#606060' : '#bdbdbd'
            },
            '&.Mui-focused fieldset': {
              borderColor: darkMode ? '#1976d2' : '#1976d2'
            },
            '& .MuiInputBase-input': {
              color: darkMode ? '#ffffff' : '#333333'
            }
          },
          '& .MuiFormHelperText-root': {
            color: darkMode ? '#ff6b6b' : '#d32f2f'
          }
        },
        '& .MuiFormControl-root': {
          '& .MuiInputLabel-root': {
            color: darkMode ? '#b0b0b0' : '#666666'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: darkMode ? '#404040' : '#e0e0e0'
            },
            '&:hover fieldset': {
              borderColor: darkMode ? '#606060' : '#bdbdbd'
            },
            '&.Mui-focused fieldset': {
              borderColor: darkMode ? '#1976d2' : '#1976d2'
            },
            '& .MuiSelect-select': {
              color: darkMode ? '#ffffff' : '#333333'
            }
          }
        },
        '& .MuiFormControlLabel-root': {
          '& .MuiFormControlLabel-label': {
            color: darkMode ? '#ffffff' : '#333333'
          }
        },
        '& .MuiDivider-root': {
          borderColor: darkMode ? '#404040' : '#e0e0e0'
        },
        '& .MuiMenuItem-root': {
          color: darkMode ? '#ffffff' : '#333333',
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
          '&:hover': {
            backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5'
          },
          '&.Mui-selected': {
            backgroundColor: darkMode ? '#1976d2' : '#e3f2fd',
            color: darkMode ? '#ffffff' : '#1976d2'
          }
        },
        '& .MuiSwitch-root': {
          '& .MuiSwitch-switchBase': {
            color: darkMode ? '#b0b0b0' : '#ccc'
          },
          '& .MuiSwitch-track': {
            backgroundColor: darkMode ? '#404040' : '#ccc'
          },
          '& .Mui-checked': {
            '& .MuiSwitch-thumb': {
              color: darkMode ? '#1976d2' : '#1976d2'
            },
            '& + .MuiSwitch-track': {
              backgroundColor: darkMode ? '#1976d2' : '#1976d2'
            }
          }
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          maxHeight: '70vh',
          overflowY: 'auto',
          pr: 1
        }}>
          {fields.map((field, index) => (
            <Box key={index} sx={{ width: '100%' }}>
              {renderField(field)}
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
        borderTop: darkMode ? '1px solid #404040' : '1px solid #e0e0e0',
        '& .MuiButton-root': {
          '&.MuiButton-contained': {
            backgroundColor: darkMode ? '#1976d2' : '#1976d2',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: darkMode ? '#1565c0' : '#1565c0'
            }
          },
          '&.MuiButton-outlined': {
            borderColor: darkMode ? '#404040' : '#e0e0e0',
            color: darkMode ? '#ffffff' : '#333333',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }}>
        <MDButton onClick={onClose} color="secondary">
          Cancelar
        </MDButton>
        
        {mode === "view" && data && (
          <>
            <MDButton
              onClick={() => {/* Cambiar a modo edit */}}
              color="info"
            >
              Editar
            </MDButton>
            <MDButton
              onClick={handleSoftDelete}
              color="error"
              disabled={loading}
            >
              Desactivar
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
      </DialogActions>
    </Dialog>
  );
};

export default GenericModal; 