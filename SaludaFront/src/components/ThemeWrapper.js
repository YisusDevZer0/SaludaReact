import React from 'react';
import { Box } from '@mui/material';
import { useMaterialUIController } from 'context';
import useTheme from 'hooks/useTheme';

/**
 * Componente wrapper que asegura que todos los layouts se adapten al tema
 * Proporciona estilos de fondo y colores adaptativos
 */
const ThemeWrapper = ({ children, sx = {}, ...props }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { colors } = useTheme();

  const themeStyles = {
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    minHeight: '100vh',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    ...sx,
  };

  return (
    <Box
      sx={themeStyles}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ThemeWrapper; 