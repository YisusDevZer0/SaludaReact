import { useContext } from 'react';
import { useMaterialUIController } from 'context';

/**
 * Hook personalizado para manejar temas de manera consistente
 * Proporciona colores y estilos adaptativos según el modo oscuro/claro
 */
export const useTheme = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Colores base adaptativos
  const colors = {
    // Fondos
    background: {
      primary: darkMode ? '#0a0a0a' : '#ffffff',
      secondary: darkMode ? '#2c2c2c' : '#f0f2f5',
      card: darkMode ? '#202940' : '#ffffff',
      sidenav: darkMode ? '#1f283e' : '#ffffff',
      navbar: darkMode ? '#202940' : '#ffffff',
      table: darkMode ? '#202940' : '#ffffff',
      tableRow: darkMode ? '#202940' : '#ffffff',
      tableRowHover: darkMode ? '#2c2c2c' : '#f5f5f5',
      tableRowAlternate: darkMode ? '#2a2a2a' : '#fafafa',
      input: darkMode ? '#202940' : '#ffffff',
      buttonHover: darkMode ? '#1662C4' : '#1662C4',
      modal: darkMode ? '#202940' : '#ffffff',
      modalHeader: darkMode ? '#1A73E8' : '#1A73E8',
      modalIcon: darkMode ? '#ffffff' : '#344767',
      modalContent: darkMode ? '#202940' : '#ffffff',
      modalActions: darkMode ? '#202940' : '#ffffff',
      modalClose: darkMode ? '#ffffff' : '#344767',
      modalCloseHover: darkMode ? '#ffffff' : '#344767',
      modalBackdrop: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    },
    
    // Textos
    text: {
      primary: darkMode ? '#ffffff' : '#344767',
      secondary: darkMode ? '#ffffff80' : '#67748e',
      disabled: darkMode ? '#ffffff66' : '#adb5bd',
      inverse: darkMode ? '#344767' : '#ffffff',
      modalHeader: darkMode ? '#ffffff' : '#344767',
      modalClose: darkMode ? '#ffffff' : '#344767',
    },
    
    // Bordes
    border: {
      primary: darkMode ? '#2c2c2c' : '#e0e0e0',
      secondary: darkMode ? '#2c2c2c' : '#f0f2f5',
      table: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      modal: darkMode ? '#2c2c2c' : '#e0e0e0',
      modalHeader: darkMode ? '#2c2c2c' : '#e0e0e0',
      modalActions: darkMode ? '#2c2c2c' : '#e0e0e0',
    },
    
    // Estados
    status: {
      success: {
        background: darkMode ? 'rgba(46, 125, 50, 0.2)' : '#e8f5e8',
        color: darkMode ? '#81c784' : '#2e7d32',
        icon: darkMode ? '#4caf50' : '#2e7d32'
      },
      error: {
        background: darkMode ? 'rgba(211, 47, 47, 0.2)' : '#ffebee',
        color: darkMode ? '#e57373' : '#d32f2f',
        icon: darkMode ? '#f44336' : '#d32f2f'
      },
      warning: {
        background: darkMode ? 'rgba(245, 124, 0, 0.2)' : '#fff3e0',
        color: darkMode ? '#ffb74d' : '#f57c00',
        icon: darkMode ? '#ff9800' : '#f57c00'
      },
      info: {
        background: darkMode ? 'rgba(25, 118, 210, 0.2)' : '#e3f2fd',
        color: darkMode ? '#64b5f6' : '#1976d2',
        icon: darkMode ? '#2196f3' : '#1976d2'
      },
      infoHoverBackground: darkMode ? '#1662C4' : '#1662C4',
    },
    
    // Sombras
    shadow: {
      light: darkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
      medium: darkMode ? '0 4px 8px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.15)',
      heavy: darkMode ? '0 8px 16px rgba(0,0,0,0.5)' : '0 8px 16px rgba(0,0,0,0.2)',
      dark: darkMode ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.2)',
    }
  };

  // Estilos para componentes específicos
  const componentStyles = {
    // Estilos para tablas
    table: {
      container: {
        backgroundColor: colors.background.table,
        color: colors.text.primary,
      },
      header: {
        backgroundColor: darkMode ? '#1A73E8' : '#1A73E8',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      headerRow: {
        backgroundColor: darkMode ? '#1A73E8' : '#1A73E8',
        borderBottomColor: colors.border.table,
        borderBottomWidth: '2px',
      },
      headerCells: {
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      cells: {
        color: colors.text.primary,
        fontSize: '14px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderBottomColor: colors.border.primary,
        borderBottomWidth: '1px',
      },
      rows: {
        backgroundColor: colors.background.tableRow,
        color: colors.text.primary,
        '&:hover': {
          backgroundColor: colors.background.tableRowHover,
          transition: 'background-color 0.2s ease',
        },
        '&:nth-child(even)': {
          backgroundColor: colors.background.tableRowAlternate,
        },
      },
      pagination: {
        backgroundColor: colors.background.table,
        borderTopColor: colors.border.primary,
        borderTopWidth: '1px',
        color: colors.text.primary,
      },
    },
    
    // Estilos para cards
    card: {
      backgroundColor: darkMode ? colors.background.card : colors.background.card,
      color: colors.text.primary,
      border: darkMode ? `1px solid ${colors.border.secondary}` : `1px solid ${colors.border.primary}`,
      boxShadow: darkMode ? colors.shadow.dark : colors.shadow.light,
    },
    
    // Estilos para inputs
    input: {
      backgroundColor: darkMode ? colors.background.input : colors.background.input,
      color: colors.text.primary,
      borderColor: colors.border.primary,
    },
    
    // Estilos para botones
    button: {
      primary: {
        backgroundColor: colors.status.info.background,
        color: colors.status.info.color,
        '&:hover': {
          backgroundColor: colors.status.info.hoverBackground,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        border: `1px solid ${colors.border.primary}`,
        '&:hover': {
          backgroundColor: colors.background.buttonHover,
        },
      },
    },
    modal: {
      backgroundColor: darkMode ? colors.background.modal : colors.background.modal,
      color: colors.text.primary,
      border: darkMode ? `1px solid ${colors.border.modal}` : `1px solid ${colors.border.modal}`,
      boxShadow: darkMode ? colors.shadow.modal : colors.shadow.modal,
      header: {
        background: darkMode ? colors.background.modalHeader : colors.background.modalHeader,
        color: colors.text.modalHeader,
        borderBottom: darkMode ? `1px solid ${colors.border.modalHeader}` : `1px solid ${colors.border.modalHeader}`,
        iconBackground: darkMode ? colors.background.modalIcon : colors.background.modalIcon,
      },
      content: {
        backgroundColor: darkMode ? colors.background.modalContent : colors.background.modalContent,
        color: colors.text.primary,
      },
      actions: {
        backgroundColor: darkMode ? colors.background.modalActions : colors.background.modalActions,
        borderTop: darkMode ? `1px solid ${colors.border.modalActions}` : `1px solid ${colors.border.modalActions}`,
      },
      closeButton: {
        color: colors.text.modalClose,
        hoverBackground: darkMode ? colors.background.modalCloseHover : colors.background.modalCloseHover,
      },
    },
  };

  // Funciones utilitarias
  const utils = {
    // Crear chip de estado
    createStatusChip: (status, text) => {
      const statusStyle = colors.status[status] || colors.status.info;
      return {
        backgroundColor: statusStyle.background,
        color: statusStyle.color,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      };
    },
    
    // Crear estilo de hover
    createHoverStyle: (baseColor) => ({
      backgroundColor: darkMode 
        ? `${baseColor}20` 
        : `${baseColor}10`,
      transition: 'background-color 0.2s ease',
    }),
    
    // Crear estilo de focus
    createFocusStyle: (baseColor) => ({
      outline: `2px solid ${baseColor}`,
      outlineOffset: '2px',
    }),
  };

  return {
    darkMode,
    colors,
    componentStyles,
    utils,
  };
};

export default useTheme; 