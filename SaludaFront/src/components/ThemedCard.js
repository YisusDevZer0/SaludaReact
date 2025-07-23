import React from 'react';
import { Card } from '@mui/material';
import useTheme from 'hooks/useTheme';

/**
 * Componente Card que se adapta automáticamente al tema
 * Proporciona estilos consistentes para modo oscuro y claro
 */
const ThemedCard = ({ children, sx = {}, elevation = 1, ...props }) => {
  const { colors, componentStyles } = useTheme();

  const cardStyles = {
    backgroundColor: componentStyles.card.backgroundColor,
    color: componentStyles.card.color,
    border: componentStyles.card.border,
    boxShadow: componentStyles.card.boxShadow,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: colors.shadow.medium,
      transform: 'translateY(-2px)',
    },
    ...sx,
  };

  return (
    <Card
      elevation={elevation}
      sx={cardStyles}
      {...props}
    >
      {children}
    </Card>
  );
};

export default ThemedCard; 