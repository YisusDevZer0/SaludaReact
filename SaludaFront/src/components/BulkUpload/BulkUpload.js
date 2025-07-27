import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  CloudUpload,
  Preview,
  PlayArrow,
  Download,
  Edit,
  CheckCircle,
  Error
} from '@mui/icons-material';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';

const BulkUpload = ({ onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState({ success: 0, errors: 0, total: 0 });
  const [editingCell, setEditingCell] = useState(null); // {rowIndex, field}
  const fileInputRef = useRef();

  const steps = [
    'Descargar Plantilla',
    'Subir Archivo',
    'Revisar Datos',
    'Procesar Carga'
  ];

  // Descargar plantilla de Excel
  const downloadTemplate = () => {
    const template = [
      {
        codigo: 'PROD001',
        nombre: 'Producto Ejemplo',
        descripcion: 'Descripción del producto',
        categoria_id: '1',
        marca_id: '1',
        almacen_id: '1',
        tipo_producto: 'producto',
        unidad_medida: 'unidad',
        precio_venta: '100.00',
        precio_compra: '80.00',
        precio_por_mayor: '90.00',
        costo_unitario: '80.00',
        stock_actual: '50',
        stock_minimo: '10',
        stock_maximo: '100',
        iva: '21.00',
        estado: 'activo',
        visible_en_pos: 'true',
        inventariable: 'true',
        exento_iva: 'false',
        permitir_venta_sin_stock: 'false',
        requiere_receta: 'false',
        controlado_por_lote: 'false',
        controlado_por_fecha_vencimiento: 'false',
        peso: '1.5',
        volumen: '2.0',
        alto: '10',
        ancho: '5',
        largo: '15',
        color: 'Azul',
        material: 'Plástico',
        ubicacion_almacen: 'Estante A-1',
        proveedor_id: '1',
        codigo_proveedor: 'PROV001',
        tiempo_entrega_dias: '7',
        precio_proveedor: '75.00',
        fecha_vencimiento: '',
        fecha_fabricacion: '',
        vida_util_dias: '365',
        caracteristicas: 'Características del producto',
        etiquetas: 'etiqueta1,etiqueta2',
        notas: 'Notas adicionales',
        imagen_url: '',
        documentacion_url: ''
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    
    // Agregar hoja de instrucciones
    const instructions = [
      { campo: 'codigo', descripcion: 'Código único del producto (requerido)', ejemplo: 'PROD001' },
      { campo: 'nombre', descripcion: 'Nombre del producto (requerido)', ejemplo: 'Producto Ejemplo' },
      { campo: 'descripcion', descripcion: 'Descripción del producto', ejemplo: 'Descripción del producto' },
      { campo: 'categoria_id', descripcion: 'ID de la categoría (requerido)', ejemplo: '1' },
      { campo: 'marca_id', descripcion: 'ID de la marca', ejemplo: '1' },
      { campo: 'almacen_id', descripcion: 'ID del almacén (requerido)', ejemplo: '1' },
      { campo: 'tipo_producto', descripcion: 'Tipo: producto, servicio, kit (requerido)', ejemplo: 'producto' },
      { campo: 'unidad_medida', descripcion: 'Unidad de medida (requerido)', ejemplo: 'unidad' },
      { campo: 'precio_venta', descripcion: 'Precio de venta (requerido)', ejemplo: '100.00' },
      { campo: 'precio_compra', descripcion: 'Precio de compra', ejemplo: '80.00' },
      { campo: 'precio_por_mayor', descripcion: 'Precio por mayor', ejemplo: '90.00' },
      { campo: 'costo_unitario', descripcion: 'Costo unitario', ejemplo: '80.00' },
      { campo: 'stock_actual', descripcion: 'Stock actual (requerido)', ejemplo: '50' },
      { campo: 'stock_minimo', descripcion: 'Stock mínimo (requerido)', ejemplo: '10' },
      { campo: 'stock_maximo', descripcion: 'Stock máximo', ejemplo: '100' },
      { campo: 'iva', descripcion: 'Porcentaje de IVA (requerido)', ejemplo: '21.00' },
      { campo: 'estado', descripcion: 'Estado: activo, inactivo, descontinuado, agotado', ejemplo: 'activo' },
      { campo: 'visible_en_pos', descripcion: 'Visible en POS: true, false', ejemplo: 'true' },
      { campo: 'inventariable', descripcion: 'Inventariable: true, false', ejemplo: 'true' },
      { campo: 'exento_iva', descripcion: 'Exento de IVA: true, false', ejemplo: 'false' },
      { campo: 'permitir_venta_sin_stock', descripcion: 'Permitir venta sin stock: true, false', ejemplo: 'false' },
      { campo: 'requiere_receta', descripcion: 'Requiere receta: true, false', ejemplo: 'false' },
      { campo: 'controlado_por_lote', descripcion: 'Controlado por lote: true, false', ejemplo: 'false' },
      { campo: 'controlado_por_fecha_vencimiento', descripcion: 'Controlado por fecha vencimiento: true, false', ejemplo: 'false' },
      { campo: 'peso', descripcion: 'Peso en kg', ejemplo: '1.5' },
      { campo: 'volumen', descripcion: 'Volumen en cm³', ejemplo: '2.0' },
      { campo: 'alto', descripcion: 'Alto en cm', ejemplo: '10' },
      { campo: 'ancho', descripcion: 'Ancho en cm', ejemplo: '5' },
      { campo: 'largo', descripcion: 'Largo en cm', ejemplo: '15' },
      { campo: 'color', descripcion: 'Color del producto', ejemplo: 'Azul' },
      { campo: 'material', descripcion: 'Material del producto', ejemplo: 'Plástico' },
      { campo: 'ubicacion_almacen', descripcion: 'Ubicación en almacén', ejemplo: 'Estante A-1' },
      { campo: 'proveedor_id', descripcion: 'ID del proveedor', ejemplo: '1' },
      { campo: 'codigo_proveedor', descripcion: 'Código del proveedor', ejemplo: 'PROV001' },
      { campo: 'tiempo_entrega_dias', descripcion: 'Tiempo de entrega en días', ejemplo: '7' },
      { campo: 'precio_proveedor', descripcion: 'Precio del proveedor', ejemplo: '75.00' },
      { campo: 'fecha_vencimiento', descripcion: 'Fecha de vencimiento (YYYY-MM-DD)', ejemplo: '' },
      { campo: 'fecha_fabricacion', descripcion: 'Fecha de fabricación (YYYY-MM-DD)', ejemplo: '' },
      { campo: 'vida_util_dias', descripcion: 'Vida útil en días', ejemplo: '365' },
      { campo: 'caracteristicas', descripcion: 'Características del producto', ejemplo: 'Características del producto' },
      { campo: 'etiquetas', descripcion: 'Etiquetas separadas por comas', ejemplo: 'etiqueta1,etiqueta2' },
      { campo: 'notas', descripcion: 'Notas adicionales', ejemplo: 'Notas adicionales' },
      { campo: 'imagen_url', descripcion: 'URL de la imagen', ejemplo: '' },
      { campo: 'documentacion_url', descripcion: 'URL de la documentación', ejemplo: '' }
    ];

    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instrucciones');

    XLSX.writeFile(wb, 'plantilla_productos.xlsx');
    
    // Avanzar automáticamente al siguiente paso
    setActiveStep(1);
  };

  // Manejar subida de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convertir a formato de objetos
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        const products = rows.map((row, index) => {
          const product = {};
          headers.forEach((header, colIndex) => {
            if (header && row[colIndex] !== undefined) {
              product[header] = row[colIndex];
            }
          });
          return { ...product, rowIndex: index + 2 }; // +2 porque Excel empieza en 1 y tenemos headers
        });

        setPreviewData(products);
        validateData(products);
        setActiveStep(2);
      } catch (error) {
        console.error('Error al leer el archivo:', error);
        alert('Error al leer el archivo. Asegúrate de que sea un archivo Excel válido.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Validar datos del Excel
  const validateData = (data) => {
    const errors = [];
    
    data.forEach((product, index) => {
      const rowIndex = index + 2;
      const productErrors = [];
      
      // Validar código
      if (!product.codigo || product.codigo.toString().length < 3) {
        productErrors.push('Código debe tener al menos 3 caracteres');
      }
      
      // Validar nombre
      if (!product.nombre || product.nombre.toString().length < 5) {
        productErrors.push('Nombre debe tener al menos 5 caracteres');
      }
      
      // Validar tipo de producto
      if (product.tipo_producto) {
        const tipo = product.tipo_producto.toString().toLowerCase();
        if (!['producto', 'servicio', 'kit'].includes(tipo)) {
          productErrors.push('Tipo de producto debe ser: producto, servicio o kit');
        }
      }
      
      // Validar unidad de medida
      if (product.unidad_medida && product.unidad_medida.toString().length > 10) {
        productErrors.push('Unidad de medida debe tener máximo 10 caracteres');
      }
      
      // Validar precio de venta
      if (product.precio_venta) {
        const precio = parseFloat(product.precio_venta);
        if (isNaN(precio) || precio < 0 || precio > 999999) {
          productErrors.push('Precio de venta debe ser un número válido entre 0 y 999999');
        }
      }
      
      // Validar precio costo (requerido)
      if (!product.precio_costo || isNaN(parseFloat(product.precio_costo))) {
        productErrors.push('Precio costo es requerido y debe ser un número válido');
      } else {
        const precio = parseFloat(product.precio_costo);
        if (precio < 0 || precio > 999999) {
          productErrors.push('Precio costo debe ser un número válido entre 0 y 999999');
        }
      }
      
      // Validar impuesto IVA (requerido)
      if (!product.impuesto_iva || isNaN(parseFloat(product.impuesto_iva))) {
        productErrors.push('Impuesto IVA es requerido y debe ser un número válido');
      } else {
        const iva = parseFloat(product.impuesto_iva);
        if (iva < 0 || iva > 100) {
          productErrors.push('Impuesto IVA debe ser un número válido entre 0 y 100');
        }
      }
      
      // Validar stock actual
      if (product.stock_actual) {
        const stock = parseFloat(product.stock_actual);
        if (isNaN(stock) || stock < 0 || stock > 999999) {
          productErrors.push('Stock actual debe ser un número válido entre 0 y 999999');
        }
      }
      
      // Validar stock mínimo
      if (product.stock_minimo) {
        const stock = parseFloat(product.stock_minimo);
        if (isNaN(stock) || stock < 0 || stock > 999999) {
          productErrors.push('Stock mínimo debe ser un número válido entre 0 y 999999');
        }
      }
      
      // Validar stock máximo
      if (product.stock_maximo) {
        const stock = parseFloat(product.stock_maximo);
        if (isNaN(stock) || stock < 0 || stock > 999999) {
          productErrors.push('Stock máximo debe ser un número válido entre 0 y 999999');
        }
      }
      
      // Validar peso
      if (product.peso) {
        const peso = parseFloat(product.peso);
        if (isNaN(peso) || peso < 0 || peso > 999999) {
          productErrors.push('Peso debe ser un número válido entre 0 y 999999');
        }
      }
      
      // Validar volumen
      if (product.volumen) {
        const volumen = parseFloat(product.volumen);
        if (isNaN(volumen) || volumen < 0 || volumen > 999999) {
          productErrors.push('Volumen debe ser un número válido entre 0 y 999999');
        }
      }
      
      if (productErrors.length > 0) {
        errors.push({
          row: rowIndex,
          errors: productErrors
        });
      }
    });
    
    setValidationErrors(errors);
  };

  // Procesar carga masiva
  const processBulkUpload = async () => {
    setProcessing(true);
    setUploadProgress(0);
    
    const results = { success: 0, errors: 0, total: previewData.length };
    const validProducts = previewData.filter((_, index) => 
      !validationErrors.some(error => error.row === index + 2)
    );

    try {
      const response = await productosService.bulkUpload(validProducts);
      results.success = response.data.success;
      results.errors = response.data.errors;
    } catch (error) {
      console.error('Error en carga masiva:', error);
      results.errors = validProducts.length;
    }
    
    setUploadProgress(100);
    
    setUploadResults(results);
    setProcessing(false);
    setActiveStep(3);
  };

  const getStatusIcon = (rowIndex) => {
    const hasErrors = validationErrors.some(error => error.row === rowIndex);
    if (hasErrors) {
      return <Error color="error" />;
    }
    return <CheckCircle color="success" />;
  };

  const getStatusChip = (rowIndex) => {
    const hasErrors = validationErrors.some(error => error.row === rowIndex);
    if (hasErrors) {
      return <Chip label="Con errores" color="error" size="small" />;
    }
    return <Chip label="Válido" color="success" size="small" />;
  };

  const getErrorsForRow = (rowIndex) => {
    const errors = validationErrors.find(error => error.row === rowIndex);
    return errors ? errors.errors : [];
  };

  const getErrorSummary = () => {
    const errorCounts = {};
    validationErrors.forEach(error => {
      error.errors.forEach(err => {
        errorCounts[err] = (errorCounts[err] || 0) + 1;
      });
    });
    return errorCounts;
  };

  const downloadErrorReport = () => {
    const errorData = validationErrors.map(error => {
      const product = previewData.find(p => (p.rowIndex || previewData.indexOf(p) + 2) === error.row);
      return {
        'Fila': error.row,
        'Código': product?.codigo || '',
        'Nombre': product?.nombre || '',
        'Errores': error.errors.join('; '),
        'Estado': 'Con errores'
      };
    });

    const ws = XLSX.utils.json_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Errores');
    XLSX.writeFile(wb, `reporte_errores_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Funciones para edición en línea
  const handleCellEdit = (rowIndex, field, value) => {
    setPreviewData(prevData => {
      const newData = [...prevData];
      const productIndex = newData.findIndex(p => (p.rowIndex || previewData.indexOf(p) + 2) === rowIndex);
      
      if (productIndex !== -1) {
        newData[productIndex] = {
          ...newData[productIndex],
          [field]: value
        };
      }
      
      return newData;
    });

    // Revalidar solo la fila editada
    setTimeout(() => {
      validateData(previewData);
    }, 100);
  };

  const startEditing = (rowIndex, field) => {
    setEditingCell({ rowIndex, field });
  };

  const stopEditing = () => {
    setEditingCell(null);
  };

  const handleCellKeyPress = (event, rowIndex, field, currentValue) => {
    if (event.key === 'Enter') {
      const newValue = event.target.value;
      handleCellEdit(rowIndex, field, newValue);
      stopEditing();
    } else if (event.key === 'Escape') {
      stopEditing();
    }
  };

  const renderEditableCell = (product, rowIndex, field, type = 'text', options = []) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field;
    const value = product[field] || '';

    if (isEditing) {
      if (type === 'select') {
        return (
          <FormControl fullWidth size="small">
            <Select
              value={value}
              onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
              onBlur={stopEditing}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  stopEditing();
                } else if (e.key === 'Escape') {
                  stopEditing();
                }
              }}
              autoFocus
              sx={{
                '& .MuiSelect-select': {
                  py: 0.5,
                  px: 1,
                  minHeight: '32px'
                }
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      } else if (type === 'number') {
        return (
          <TextField
            type="number"
            value={value}
            onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
            onBlur={stopEditing}
            onKeyDown={(e) => handleCellKeyPress(e, rowIndex, field, value)}
            autoFocus
            size="small"
            variant="standard"
            sx={{
              '& .MuiInputBase-input': {
                py: 0.5,
                px: 1,
                minHeight: '32px'
              }
            }}
          />
        );
      } else {
        return (
          <TextField
            value={value}
            onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
            onBlur={stopEditing}
            onKeyDown={(e) => handleCellKeyPress(e, rowIndex, field, value)}
            autoFocus
            size="small"
            variant="standard"
            sx={{
              '& .MuiInputBase-input': {
                py: 0.5,
                px: 1,
                minHeight: '32px'
              }
            }}
          />
        );
      }
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderRadius: 1
            },
            py: 0.5,
            px: 1,
            minHeight: '32px',
            width: '100%'
          }}
          onClick={() => startEditing(rowIndex, field)}
        >
          <Typography variant="body2" sx={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {type === 'currency' ? `$${value}` : value}
          </Typography>
          <Edit sx={{ fontSize: 16, opacity: 0.5, ml: 1, flexShrink: 0 }} />
        </Box>
      );
    }
  };

  // Componente de tabla editable usando DataTable directamente
  const EditableProductsTable = () => {
    // Preparar datos para la tabla
    const tableData = previewData.map((product, index) => {
      const rowIndex = product.rowIndex || index + 2;
      const rowErrors = getErrorsForRow(rowIndex);
      const hasErrors = rowErrors.length > 0;
      
      return {
        ...product,
        id: rowIndex,
        rowIndex: rowIndex,
        hasErrors: hasErrors,
        errors: rowErrors,
        status: hasErrors ? 'error' : 'success'
      };
    });

    console.log('🔍 EditableProductsTable - previewData:', previewData);
    console.log('🔍 EditableProductsTable - tableData:', tableData);
    console.log('🔍 EditableProductsTable - validationErrors:', validationErrors);

    // Si no hay datos, mostrar mensaje
    if (!tableData || tableData.length === 0) {
      console.log('⚠️ No hay datos para mostrar');
      return (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No hay datos para mostrar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sube un archivo para ver los datos aquí
              </Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }

    console.log('✅ Renderizando tabla con datos:', tableData.length, 'filas');

    // Configuración de columnas
    const columns = [
      {
        name: 'Fila',
        selector: row => row.rowIndex,
        sortable: true,
        width: '80px',
        center: true,
        cell: row => (
          <Typography variant="body2" fontWeight="bold">
            {row.rowIndex}
          </Typography>
        )
      },
      {
        name: 'Estado',
        selector: row => row.status,
        sortable: true,
        width: '100px',
        center: true,
        cell: row => (
          <Box display="flex" justifyContent="center">
            {row.hasErrors ? (
              <Error color="error" />
            ) : (
              <CheckCircle color="success" />
            )}
          </Box>
        )
      },
      {
        name: 'Código',
        selector: row => row.codigo,
        sortable: true,
        width: '150px',
        cell: row => renderEditableCell(row, row.rowIndex, 'codigo', 'text')
      },
      {
        name: 'Nombre',
        selector: row => row.nombre,
        sortable: true,
        minWidth: '200px',
        cell: row => renderEditableCell(row, row.rowIndex, 'nombre', 'text')
      },
      {
        name: 'Descripción',
        selector: row => row.descripcion,
        sortable: true,
        minWidth: '200px',
        cell: row => renderEditableCell(row, row.rowIndex, 'descripcion', 'text')
      },
      {
        name: 'Categoría ID',
        selector: row => row.categoria_id,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'categoria_id', 'text')
      },
      {
        name: 'Marca ID',
        selector: row => row.marca_id,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'marca_id', 'text')
      },
      {
        name: 'Almacén ID',
        selector: row => row.almacen_id,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'almacen_id', 'text')
      },
      {
        name: 'Tipo',
        selector: row => row.tipo_producto,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'tipo_producto', 'select', [
          { value: 'producto', label: 'Producto' },
          { value: 'servicio', label: 'Servicio' },
          { value: 'kit', label: 'Kit' }
        ])
      },
      {
        name: 'Unidad Medida',
        selector: row => row.unidad_medida,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'unidad_medida', 'text')
      },
      {
        name: 'Precio Venta',
        selector: row => row.precio_venta,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'precio_venta', 'number')
      },
      {
        name: 'Precio Compra',
        selector: row => row.precio_compra,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'precio_compra', 'number')
      },
      {
        name: 'Precio Costo',
        selector: row => row.precio_costo,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'precio_costo', 'number')
      },
      {
        name: 'Impuesto IVA',
        selector: row => row.impuesto_iva,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'impuesto_iva', 'number')
      },
      {
        name: 'Stock Actual',
        selector: row => row.stock_actual,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'stock_actual', 'number')
      },
      {
        name: 'Stock Mínimo',
        selector: row => row.stock_minimo,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'stock_minimo', 'number')
      },
      {
        name: 'Stock Máximo',
        selector: row => row.stock_maximo,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'stock_maximo', 'number')
      },
      {
        name: 'Estado',
        selector: row => row.estado,
        sortable: true,
        width: '100px',
        cell: row => renderEditableCell(row, row.rowIndex, 'estado', 'select', [
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' }
        ])
      },
      {
        name: 'Visible en POS',
        selector: row => row.visible_en_pos,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'visible_en_pos', 'select', [
          { value: 1, label: 'Sí' },
          { value: 0, label: 'No' }
        ])
      },
      {
        name: 'Inventariable',
        selector: row => row.inventariable,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'inventariable', 'select', [
          { value: 1, label: 'Sí' },
          { value: 0, label: 'No' }
        ])
      },
      {
        name: 'Exento IVA',
        selector: row => row.exento_iva,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'exento_iva', 'select', [
          { value: 1, label: 'Sí' },
          { value: 0, label: 'No' }
        ])
      },
      {
        name: 'Peso',
        selector: row => row.peso,
        sortable: true,
        width: '100px',
        cell: row => renderEditableCell(row, row.rowIndex, 'peso', 'number')
      },
      {
        name: 'Volumen',
        selector: row => row.volumen,
        sortable: true,
        width: '100px',
        cell: row => renderEditableCell(row, row.rowIndex, 'volumen', 'number')
      },
      {
        name: 'Proveedor ID',
        selector: row => row.proveedor_id,
        sortable: true,
        width: '120px',
        cell: row => renderEditableCell(row, row.rowIndex, 'proveedor_id', 'text')
      },
      {
        name: 'Errores',
        selector: row => row.errors,
        sortable: false,
        width: '200px',
        cell: row => (
          <Box>
            {row.hasErrors ? (
              row.errors.map((error, errorIndex) => (
                <Chip
                  key={errorIndex}
                  label={error}
                  color="error"
                  size="small"
                  sx={{ 
                    mb: 0.5, 
                    fontSize: '0.7rem',
                    maxWidth: '180px',
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      textAlign: 'left'
                    }
                  }}
                />
              ))
            ) : (
              <Chip
                label="Sin errores"
                color="success"
                size="small"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        )
      }
    ];

    // Estilos personalizados optimizados para edición estable
    const customStyles = {
      table: {
        style: {
          minHeight: '400px',
          width: '100%'
        }
      },
      rows: {
        style: {
          minHeight: '50px',
          fontSize: '14px',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }
      },
      headRow: {
        style: {
          backgroundColor: 'primary.main',
          color: 'white',
          fontWeight: 'bold',
          minHeight: '50px'
        }
      },
      headCells: {
        style: {
          paddingLeft: '8px',
          paddingRight: '8px',
          minHeight: '50px'
        }
      },
      cells: {
        style: {
          paddingLeft: '8px',
          paddingRight: '8px',
          minHeight: '50px',
          verticalAlign: 'middle'
        }
      },
      pagination: {
        style: {
          borderTop: '1px solid #e0e0e0',
          paddingTop: '10px'
        }
      }
    };

    return (
      <Box sx={{ 
        width: '100%',
        height: '100%',
        '& .rdt_Table': {
          fontSize: '14px'
        }
      }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="medium">
            Revisión de Productos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edita los datos antes de procesar la carga masiva
          </Typography>
        </Box>
        
        <DataTable
          columns={columns}
          data={tableData}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50]}
          highlightOnHover
          responsive
          dense
          customStyles={customStyles}
          conditionalRowStyles={[
            {
              when: row => row.hasErrors,
              style: {
                backgroundColor: 'error.light',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white'
                }
              }
            },
            {
              when: row => !row.hasErrors,
              style: {
                backgroundColor: 'success.light',
                '&:hover': {
                  backgroundColor: 'success.main',
                  color: 'white'
                }
              }
            }
          ]}
        />
      </Box>
    );
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Carga Masiva de Productos
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Descargar Plantilla</StepLabel>
                         <StepContent>
               <Box sx={{ mb: 2 }}>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                   Descarga la plantilla de Excel con el formato correcto para cargar productos.
                 </Typography>
                 <Button
                   variant="contained"
                   startIcon={<Download />}
                   onClick={downloadTemplate}
                 >
                   Descargar Plantilla
                 </Button>
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                   <strong>Instrucciones:</strong>
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                   1. Descarga la plantilla haciendo clic en el botón arriba
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   2. Completa los datos en la plantilla (al menos los campos requeridos)
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   3. Guarda el archivo y continúa al siguiente paso
                 </Typography>
               </Box>
             </StepContent>
          </Step>

          <Step>
            <StepLabel>Subir Archivo</StepLabel>
                         <StepContent>
               <Box sx={{ mb: 2 }}>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                   Sube el archivo Excel con los datos de los productos.
                 </Typography>
                 <input
                   ref={fileInputRef}
                   type="file"
                   accept=".xlsx,.xls"
                   onChange={handleFileUpload}
                   style={{ display: 'none' }}
                 />
                 <Button
                   variant="contained"
                   startIcon={<CloudUpload />}
                   onClick={() => fileInputRef.current.click()}
                 >
                   Seleccionar Archivo
                 </Button>
                 {uploadedFile && (
                   <Typography variant="body2" sx={{ mt: 1 }}>
                     Archivo seleccionado: {uploadedFile.name}
                   </Typography>
                 )}
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                   <strong>Nota:</strong> El archivo debe tener el mismo formato que la plantilla descargada.
                 </Typography>
               </Box>
             </StepContent>
          </Step>

          <Step>
            <StepLabel>Revisar Datos</StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Revisa los datos antes de procesar la carga masiva.
                </Typography>
                
                {validationErrors.length > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Se encontraron {validationErrors.length} filas con errores de validación.
                  </Alert>
                )}

                {/* Resumen detallado de errores */}
                {validationErrors.length > 0 && (
                  <Card sx={{ mb: 2, bgcolor: 'warning.light' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Resumen de Errores
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={downloadErrorReport}
                          startIcon={<Download />}
                        >
                          Descargar Reporte
                        </Button>
                      </Box>
                      <Grid container spacing={2}>
                        {Object.entries(getErrorSummary()).map(([error, count]) => (
                          <Grid item xs={12} sm={6} md={4} key={error}>
                            <Chip
                              label={`${error} (${count})`}
                              color="error"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                <EditableProductsTable />

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={processBulkUpload}
                    disabled={validationErrors.length > 0}
                    startIcon={<Save />}
                  >
                    Procesar Carga ({previewData.length - validationErrors.length} productos válidos)
                  </Button>
                </Box>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Procesar Carga</StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                {processing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="body2">
                      Procesando... {Math.round(uploadProgress)}%
                    </Typography>
                  </Box>
                ) : (
                  <Alert severity="info">
                    <Typography variant="h6">Resultados de la carga:</Typography>
                    <Typography>✅ Productos creados exitosamente: {uploadResults.success}</Typography>
                    <Typography>❌ Errores: {uploadResults.errors}</Typography>
                    <Typography>📊 Total procesados: {uploadResults.total}</Typography>
                  </Alert>
                )}
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

             <DialogActions>
         <Button onClick={onClose}>
           Cerrar
         </Button>
         {activeStep < 3 && (
           <Button
             variant="outlined"
             onClick={() => setActiveStep(activeStep + 1)}
             disabled={activeStep === 1 && !uploadedFile}
           >
             Siguiente
           </Button>
         )}
         {activeStep > 0 && activeStep < 3 && (
           <Button
             variant="outlined"
             onClick={() => setActiveStep(activeStep - 1)}
           >
             Anterior
           </Button>
         )}
         {activeStep === 3 && uploadResults.success > 0 && (
           <Button
             variant="contained"
             onClick={() => {
               onSuccess && onSuccess();
               onClose();
             }}
           >
             Ver Productos
           </Button>
         )}
       </DialogActions>
    </Dialog>
  );
};

export default BulkUpload; 