import React, { createContext, useContext, useMemo } from 'react';
import { useMaterialUIController } from 'context';
import usePantoneColors from 'hooks/usePantoneColors';

const TableThemeContext = createContext();

export const useTableTheme = () => {
  const context = useContext(TableThemeContext);
  if (!context) {
    throw new Error('useTableTheme must be used within a TableThemeProvider');
  }
  return context;
};

export const TableThemeProvider = ({ children }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();

  const tableTheme = useMemo(() => {
    // Colores base del tema
    const baseColors = {
      primary: sucursalesTable.header,
      primaryText: sucursalesTable.headerText,
      secondary: sucursalesTable.cellText,
      background: darkMode ? '#1a1a1a' : '#ffffff',
      surface: darkMode ? '#2c2c2c' : '#f5f5f5',
      border: darkMode ? '#424242' : '#e0e0e0',
      hover: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      selected: darkMode ? 'rgba(25, 118, 210, 0.12)' : 'rgba(25, 118, 210, 0.08)',
    };

    // Colores de estado
    const statusColors = {
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
      }
    };

    // Estilos para react-data-table-component
    const customStyles = {
      table: {
        style: {
          backgroundColor: baseColors.background,
          color: baseColors.secondary,
        },
      },
      header: {
        style: {
          backgroundColor: baseColors.primary,
          color: baseColors.primaryText,
          fontSize: '16px',
          fontWeight: 'bold',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '8px 8px 0 0',
        },
      },
      headRow: {
        style: {
          backgroundColor: baseColors.primary,
          borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          borderBottomWidth: '2px',
        },
      },
      headCells: {
        style: {
          color: baseColors.primaryText,
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '16px',
          paddingBottom: '16px',
        },
      },
      cells: {
        style: {
          color: baseColors.secondary,
          fontSize: '14px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderBottomColor: baseColors.border,
          borderBottomWidth: '1px',
        },
      },
      rows: {
        style: {
          backgroundColor: baseColors.background,
          '&:hover': {
            backgroundColor: baseColors.hover,
            transition: 'background-color 0.2s ease',
          },
        },
        selectedHighlightStyle: {
          backgroundColor: baseColors.selected,
          borderBottomColor: baseColors.primary,
          borderLeftColor: baseColors.primary,
          borderLeftWidth: '3px',
        },
      },
      pagination: {
        style: {
          backgroundColor: baseColors.background,
          borderTopColor: baseColors.border,
          borderTopWidth: '1px',
          color: baseColors.secondary,
          fontSize: '14px',
          paddingTop: '16px',
          paddingBottom: '16px',
        },
        pageButtonsStyle: {
          borderRadius: '4px',
          height: '36px',
          width: '36px',
          padding: '8px',
          margin: '0 2px',
          color: baseColors.primary,
          border: `1px solid ${baseColors.border}`,
          backgroundColor: baseColors.background,
          '&:hover:not(:disabled)': {
            backgroundColor: baseColors.primary,
            color: baseColors.primaryText,
          },
          '&:focus': {
            outline: `2px solid ${baseColors.primary}`,
            outlineOffset: '2px',
          },
        },
      },
      progress: {
        style: {
          color: baseColors.primary,
          backgroundColor: baseColors.surface,
        },
      },
      noData: {
        style: {
          color: baseColors.secondary,
          backgroundColor: baseColors.background,
          padding: '48px 24px',
          textAlign: 'center',
          fontSize: '16px',
        },
      },
    };

    // Configuraciones de tabla estándar
    const defaultConfig = {
      // Configuración de paginación
      pagination: true,
      paginationPerPage: 15,
      paginationRowsPerPageOptions: [10, 15, 25, 50, 100],
      paginationResetDefaultPage: false,
      
      // Configuración de UI
      dense: false,
      responsive: true,
      highlightOnHover: true,
      pointerOnHover: false,
      striped: false,
      
      // Configuración de selección
      selectableRows: false,
      selectableRowsHighlight: true,
      selectableRowsNoSelectAll: false,
      
      // Configuración de ordenamiento
      sortIcon: true,
      sortFunction: null,
      
      // Configuración de progreso
      progressPending: false,
      progressComponent: null,
      
      // Configuración de datos vacíos
      noDataComponent: 'No hay datos disponibles',
      
      // Configuración de expansión
      expandableRows: false,
      expandOnRowClicked: false,
      expandOnRowDoubleClicked: false,
      
      // Configuración de filas
      fixedHeader: false,
      fixedHeaderScrollHeight: '100vh',
      
      // Configuración de contexto
      contextActions: null,
      contextMessage: null,
      
      // Configuración de diseño
      theme: darkMode ? 'dark' : 'light',
      direction: 'ltr',
    };

    return {
      colors: baseColors,
      statusColors,
      customStyles,
      defaultConfig,
      darkMode,
      
      // Utilidades para crear elementos de estado
      createStatusChip: (status, text) => {
        const statusStyle = statusColors[status] || statusColors.info;
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
      
      // Utilidades para botones de acción
      createActionButton: (type) => {
        const actionColors = {
          edit: statusColors.warning.icon,
          delete: statusColors.error.icon,
          view: statusColors.info.icon,
          create: statusColors.success.icon,
        };
        
        return {
          color: actionColors[type] || statusColors.info.icon,
          padding: '4px',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: baseColors.hover,
            transform: 'scale(1.1)',
          },
        };
      },
      
      // Utilidades para configuración de columnas
      createColumn: (accessor, name, options = {}) => ({
        name,
        selector: row => row[accessor],
        sortable: options.sortable !== false,
        width: options.width,
        minWidth: options.minWidth || '120px',
        maxWidth: options.maxWidth,
        center: options.center || false,
        right: options.right || false,
        compact: options.compact || false,
        wrap: options.wrap || false,
        allowOverflow: options.allowOverflow || false,
        ignoreRowClick: options.ignoreRowClick || false,
        button: options.button || false,
        cell: options.cell,
        format: options.format,
        conditionalCellStyles: options.conditionalCellStyles,
        style: options.style,
        ...options,
      }),
      
      // Utilidades para filtros
      createFilterConfig: (type, key, label, options = []) => ({
        type,
        key,
        label,
        options: options.map(opt => 
          typeof opt === 'string' 
            ? { value: opt, label: opt }
            : opt
        ),
      }),
    };
  }, [darkMode, sucursalesTable]);

  return (
    <TableThemeContext.Provider value={tableTheme}>
      {children}
    </TableThemeContext.Provider>
  );
};

export default TableThemeProvider; 