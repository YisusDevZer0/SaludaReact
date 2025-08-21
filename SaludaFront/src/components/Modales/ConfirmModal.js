/**
=========================================================
* SaludaReact - Modal de Confirmación
=========================================================
*/

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Check as CheckIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

function ConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Confirmar Acción",
  message = "¿Está seguro de que desea realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning", // "warning", "danger", "info"
  loading = false,
  icon = null
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Obtener color según el tipo
  const getTypeColor = () => {
    switch (type) {
      case 'danger':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      default:
        return '#ff9800';
    }
  };

  // Obtener icono según el tipo
  const getTypeIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'danger':
        return <DeleteIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <CheckIcon />;
      default:
        return <WarningIcon />;
    }
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: darkMode ? '#1a2035' : '#ffffff',
          color: darkMode ? '#ffffff' : '#344767',
          borderRadius: '8px',
          width: '95%',
          maxWidth: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: getTypeColor(),
            color: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
          }}
        >
          <MDBox display="flex" alignItems="center">
            <Box sx={{ mr: 1, color: '#ffffff' }}>
              {getTypeIcon()}
            </Box>
            <MDTypography variant="h6" fontWeight="bold" color="white">
              {title}
            </MDTypography>
          </MDBox>
          <IconButton 
            onClick={onClose}
            sx={{ color: '#ffffff' }}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ padding: '24px' }}>
          <MDTypography variant="body1" color="text" textAlign="center">
            {message}
          </MDTypography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            borderTop: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
          }}
        >
          <MDButton 
            onClick={onClose} 
            color="secondary"
            disabled={loading}
          >
            {cancelText}
          </MDButton>
          <MDButton
            onClick={onConfirm}
            color={type === 'danger' ? 'error' : type === 'warning' ? 'warning' : 'info'}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Procesando..." : confirmText}
          </MDButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ConfirmModal;
