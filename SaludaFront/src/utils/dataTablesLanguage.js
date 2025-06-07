import PreferencesService from "services/preferences-service";

/**
 * Configuración del idioma español para DataTables
 * Función reutilizable para evitar repetir la configuración en cada tabla
 */

export const getDataTablesSpanishLanguage = () => {
  return {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
      "sFirst": "Primero",
      "sLast": "Último",
      "sNext": "Siguiente",
      "sPrevious": "Anterior"
    },
    "oAria": {
      "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
      "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },
    "buttons": {
      "copy": "Copiar",
      "colvis": "Visibilidad",
      "print": "Imprimir",
      "excel": "Excel",
      "pdf": "PDF"
    }
  };
};

/**
 * Obtener el color Pantone para usar en headers
 * @param {string} colorKey - Clave del color (azulSereno, verdeAmable, etc.)
 * @param {boolean} isDarkMode - Si está en modo oscuro
 */
const getPantoneHeaderColor = (colorKey = "azulSereno", isDarkMode = false) => {
  const pantoneColors = PreferencesService.getPantoneColors();
  
  if (isDarkMode) {
    // En modo oscuro, usar colores más suaves o blanco
    return pantoneColors.blancoEsteril.hex;
  }
  
  // En modo claro, usar el color seleccionado
  return pantoneColors[colorKey]?.hex || pantoneColors.azulSereno.hex;
};

/**
 * Inyectar estilos CSS para headers de DataTables
 * @param {string} headerColor - Color hex para los headers
 * @param {boolean} isDarkMode - Si está en modo oscuro
 */
const injectDataTableStyles = (headerColor, isDarkMode = false) => {
  const styleId = 'custom-datatable-styles';
  
  // Remover estilos existentes
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const textColor = isDarkMode ? '#333333' : '#ffffff';
  const hoverColor = isDarkMode ? '#f5f5f5' : 'rgba(255, 255, 255, 0.1)';

  const styles = `
    <style id="${styleId}">
      /* Headers de DataTables con colores Pantone */
      .dataTables_wrapper table.dataTable thead th {
        background: ${headerColor} !important;
        color: ${textColor} !important;
        border-bottom: 2px solid rgba(255, 255, 255, 0.3) !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        font-size: 0.75rem !important;
        letter-spacing: 0.5px !important;
        padding: 16px 8px !important;
        position: relative !important;
      }

      .dataTables_wrapper table.dataTable thead th:hover {
        background: ${hoverColor} !important;
      }

      /* Mejorar bordes de celdas */
      .dataTables_wrapper table.dataTable tbody td {
        border-top: 1px solid #e9ecef !important;
        padding: 12px 8px !important;
      }

      /* Estilos para el wrapper de controles */
      .dataTables_wrapper .dataTables_length,
      .dataTables_wrapper .dataTables_filter,
      .dataTables_wrapper .dataTables_info,
      .dataTables_wrapper .dataTables_paginate {
        color: ${isDarkMode ? '#ffffff' : '#333333'} !important;
      }

      /* Inputs y selects */
      .dataTables_wrapper .dataTables_length select,
      .dataTables_wrapper .dataTables_filter input {
        background: ${isDarkMode ? '#2c2c2c' : '#ffffff'} !important;
        color: ${isDarkMode ? '#ffffff' : '#333333'} !important;
        border: 1px solid ${headerColor} !important;
        border-radius: 4px !important;
        padding: 4px 8px !important;
      }

      /* Botones de paginación */
      .dataTables_wrapper .dataTables_paginate .paginate_button {
        background: transparent !important;
        border: 1px solid ${headerColor} !important;
        color: ${headerColor} !important;
        margin: 0 2px !important;
      }

      .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
        background: ${headerColor} !important;
        color: ${textColor} !important;
      }

      .dataTables_wrapper .dataTables_paginate .paginate_button.current {
        background: ${headerColor} !important;
        color: ${textColor} !important;
      }
    </style>
  `;

  document.head.insertAdjacentHTML('beforeend', styles);
};

/**
 * Configuración completa de DataTables con headers AJAX y idioma español
 * @param {string} url - URL del endpoint de la API
 * @param {Array} columns - Array de configuración de columnas
 * @param {Object} additionalOptions - Opciones adicionales para DataTables
 * @param {string} headerColorKey - Clave del color Pantone para headers (opcional)
 * @param {boolean} isDarkMode - Si está en modo oscuro (opcional)
 */
export const getDataTablesConfig = (url, columns, additionalOptions = {}, headerColorKey = "azulSereno", isDarkMode = false) => {
  // Obtener el color para headers
  const headerColor = getPantoneHeaderColor(headerColorKey, isDarkMode);
  
  // Inyectar estilos CSS personalizados
  injectDataTableStyles(headerColor, isDarkMode);

  const defaultConfig = {
    processing: true,
    serverSide: true,
    ajax: {
      url: url,
      dataSrc: "data",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Accept', 'application/json');
      }
    },
    columns: columns,
    language: getDataTablesSpanishLanguage(),
    responsive: true,
    autoWidth: false,
    pageLength: 10,
    lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
    order: [[0, 'asc']],
    // Clases CSS personalizadas
    dom: '<"top"lf>rt<"bottom"ip><"clear">',
    className: 'pantone-datatable'
  };

  // Combinar configuración por defecto con opciones adicionales
  return { ...defaultConfig, ...additionalOptions };
};

export default {
  getDataTablesSpanishLanguage,
  getDataTablesConfig
}; 