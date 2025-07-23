import React from 'react';
import { Button } from '@mui/material';
import useTheme from 'hooks/useTheme';

/**
 * Componente Button que se adapta automáticamente al tema
 * Proporciona estilos consistentes para modo oscuro y claro
 */
const ThemedButton = ({ 
  children, 
  variant = "contained",
  color = "primary",
  sx = {},
  ...props 
}) => {
  const { colors, componentStyles } = useTheme();

  const getButtonStyles = () => {
    const baseStyles = {
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: colors.shadow.medium,
      },
      '&:focus': {
        outline: `2px solid ${colors.status.info.icon}`,
        outlineOffset: '2px',
      },
      ...sx,
    };

    if (variant === "contained") {
      return {
        ...componentStyles.button.primary,
        ...baseStyles,
      };
    } else if (variant === "outlined") {
      return {
        ...componentStyles.button.secondary,
        ...baseStyles,
      };
    }

    return baseStyles;
  };

  return (
    <Button
      variant={variant}
      color={color}
      sx={getButtonStyles()}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ThemedButton; 