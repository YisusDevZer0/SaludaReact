import React from 'react';
import { TextField } from '@mui/material';
import useTheme from 'hooks/useTheme';

/**
 * Componente TextField que se adapta automáticamente al tema
 * Proporciona estilos consistentes para modo oscuro y claro
 */
const ThemedInput = ({ 
  children, 
  sx = {}, 
  variant = "outlined",
  ...props 
}) => {
  const { colors, componentStyles } = useTheme();

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: componentStyles.input.backgroundColor,
      color: componentStyles.input.color,
      borderColor: componentStyles.input.borderColor,
      '&:hover': {
        borderColor: colors.status.info.icon,
      },
      '&.Mui-focused': {
        borderColor: colors.status.info.icon,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.status.info.icon,
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: colors.text.secondary,
      '&.Mui-focused': {
        color: colors.status.info.icon,
      },
    },
    '& .MuiInputBase-input': {
      color: colors.text.primary,
    },
    '& .MuiInputBase-input::placeholder': {
      color: colors.text.disabled,
      opacity: 1,
    },
    ...sx,
  };

  return (
    <TextField
      variant={variant}
      sx={inputStyles}
      {...props}
    >
      {children}
    </TextField>
  );
};

export default ThemedInput; 