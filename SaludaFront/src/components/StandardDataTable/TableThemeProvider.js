import React, { createContext, useContext, useMemo } from 'react';
import { useTheme } from 'hooks/useTheme';

const TableThemeContext = createContext();

export const useTableTheme = () => {
  const context = useContext(TableThemeContext);
  if (!context) {
    throw new Error('useTableTheme must be used within a TableThemeProvider');
  }
  return context;
};

export const TableThemeProvider = ({ children }) => {
  const { darkMode, colors, componentStyles, utils } = useTheme();

  const tableTheme = useMemo(() => {
    // Estilos para react-data-table-component
    const customStyles = {
      table: {
        style: {
          backgroundColor: colors.background.table,
          color: colors.text.primary,
        },
      },
      header: {
        style: {
          backgroundColor: componentStyles.table.header.backgroundColor,
          color: componentStyles.table.header.color,
          fontSize: componentStyles.table.header.fontSize,
          fontWeight: componentStyles.table.header.fontWeight,
          paddingLeft: componentStyles.table.header.paddingLeft,
          paddingRight: componentStyles.table.header.paddingRight,
          borderRadius: '8px 8px 0 0',
        },
      },
      headRow: {
        style: {
          backgroundColor: componentStyles.table.headerRow.backgroundColor,
          borderBottomColor: componentStyles.table.headerRow.borderBottomColor,
          borderBottomWidth: componentStyles.table.headerRow.borderBottomWidth,
        },
      },
      headCells: {
        style: {
          color: componentStyles.table.headerCells.color,
          fontSize: componentStyles.table.headerCells.fontSize,
          fontWeight: componentStyles.table.headerCells.fontWeight,
          textTransform: componentStyles.table.headerCells.textTransform,
          paddingLeft: componentStyles.table.headerCells.paddingLeft,
          paddingRight: componentStyles.table.headerCells.paddingRight,
          paddingTop: '16px',
          paddingBottom: '16px',
        },
      },
      cells: {
        style: {
          color: componentStyles.table.cells.color,
          fontSize: componentStyles.table.cells.fontSize,
          paddingLeft: componentStyles.table.cells.paddingLeft,
          paddingRight: componentStyles.table.cells.paddingRight,
          paddingTop: '12px',
          paddingBottom: '12px',
          borderBottomColor: componentStyles.table.cells.borderBottomColor,
          borderBottomWidth: componentStyles.table.cells.borderBottomWidth,
        },
      },
      rows: {
        style: {
          backgroundColor: componentStyles.table.rows.backgroundColor,
          color: componentStyles.table.rows.color,
          '&:hover': componentStyles.table.rows['&:hover'],
          '&:nth-child(even)': {
            backgroundColor: colors.background.tableRowAlternate,
          },
        },
        selectedHighlightStyle: {
          backgroundColor: colors.status.info.background,
          borderBottomColor: componentStyles.table.header.backgroundColor,
          borderLeftColor: componentStyles.table.header.backgroundColor,
          borderLeftWidth: '3px',
        },
      },
      pagination: {
        style: {
          backgroundColor: componentStyles.table.pagination.backgroundColor,
          borderTopColor: componentStyles.table.pagination.borderTopColor,
          borderTopWidth: componentStyles.table.pagination.borderTopWidth,
          color: componentStyles.table.pagination.color,
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
          color: componentStyles.table.header.backgroundColor,
          border: `1px solid ${colors.border.primary}`,
          backgroundColor: colors.background.table,
          '&:hover:not(:disabled)': {
            backgroundColor: componentStyles.table.header.backgroundColor,
            color: componentStyles.table.header.color,
          },
          '&:focus': {
            outline: `2px solid ${componentStyles.table.header.backgroundColor}`,
            outlineOffset: '2px',
          },
        },
      },
      noData: {
        style: {
          backgroundColor: colors.background.table,
          color: colors.text.primary,
        },
      },
      progress: {
        style: {
          backgroundColor: colors.background.table,
          color: componentStyles.table.header.backgroundColor,
        },
      },
    };

    // Configuración por defecto para react-data-table-component
    const defaultConfig = {
      theme: darkMode ? 'dark' : 'light',
      direction: 'ltr',
    };

    return {
      colors,
      statusColors: colors.status,
      customStyles,
      defaultConfig,
      darkMode,
      
      // Utilidades para crear elementos de estado
      createStatusChip: utils.createStatusChip,
      
      // Utilidades para botones de acción
      createActionButton: (type) => {
        const actionColors = {
          edit: colors.status.warning.icon,
          delete: colors.status.error.icon,
          view: colors.status.info.icon,
          create: colors.status.success.icon,
        };
        
        return {
          color: actionColors[type] || colors.status.info.icon,
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
            backgroundColor: colors.background.tableRowHover,
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
  }, [darkMode, colors, componentStyles, utils]);

  return (
    <TableThemeContext.Provider value={tableTheme}>
      {children}
    </TableThemeContext.Provider>
  );
};

export default TableThemeProvider; 