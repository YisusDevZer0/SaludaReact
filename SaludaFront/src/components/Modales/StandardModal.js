/**
=========================================================
* SaludaReact - Modal Estándar Base
* Basado en el patrón del PersonalModal para consistencia visual
=========================================================
*/

import React from "react";
import {
  Box,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

const StandardModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  loading = false,
  className = ""
}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  if (!open) return null;

  // Calcular ancho máximo basado en la prop
  const getMaxWidth = () => {
    switch (maxWidth) {
      case "xs": return "400px";
      case "sm": return "600px";
      case "md": return "900px";
      case "lg": return "1200px";
      case "xl": return "1400px";
      default: return maxWidth;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo NO transparente
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
      className={className}
    >
      <Box
        sx={{
          backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderRadius: '8px',
          width: '95%',
          maxWidth: getMaxWidth(),
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', // Shadow profesional
          border: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Estilo PersonalModal */}
        <Box
          sx={{
            backgroundColor: '#1976d2', // Azul estándar
            color: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
          }}
        >
          <MDTypography variant="h5" fontWeight="bold">
            {title}
          </MDTypography>
          <IconButton 
            onClick={onClose}
            sx={{ color: '#ffffff' }}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: '24px',
            position: 'relative'
          }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {children}
        </Box>

        {/* Footer */}
        {actions && (
          <Box
            sx={{
              backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              borderTop: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StandardModal;
