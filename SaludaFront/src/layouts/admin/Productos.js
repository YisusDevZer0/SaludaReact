/**
 * Productos page
 * 
 * Esta página proporciona una interfaz completa para la gestión de productos
 * médicos, incluyendo funcionalidades CRUD, filtros avanzados, y estadísticas.
 */

import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Box,
  Divider,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// Servicios
import productosService from "services/productos-service";
import stockService from "services/stock-service";

// Componentes de tabla
import StandardDataTable from "components/StandardDataTable";
import { TableThemeProvider } from "components/StandardDataTable/TableThemeProvider";

// Context
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`producto-tabpanel-${index}`}
      aria-labelledby={`producto-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Productos() {
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Estados para el modal de agregar stock
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProductoForStock, setSelectedProductoForStock] = useState(null);
  const [stockFormData, setStockFormData] = useState({
    cantidad: 0,
    sucursales: [],
    costo_unitario: 0,
    lote: '',
    fecha_fabricacion: '',
    fecha_vencimiento: '',
    observaciones: ''
  });
  const [sucursales, setSucursales] = useState([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);

  // Estados para los datos de los selectores
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [componentesActivos, setComponentesActivos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [loadingSelectores, setLoadingSelectores] = useState(true);

  // Configuración del servicio para StandardDataTable
  const productosTableService = {
    getAll: async (params = {}) => {
      try {
        const response = await productosService.getProductos(params);
        return {
          success: response.success || true,
          data: response.data || response,
          total: response.total || response.length || 0
        };
      } catch (error) {
        console.error('Error en productosTableService:', error);
        return {
          success: false,
          message: error.message,
          data: [],
          total: 0
        };
      }
    }
  };

  // Configuración de columnas para StandardDataTable
  const productosColumns = [
    {
      name: 'Código',
      selector: row => row.codigo,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Categoría',
      selector: row => row.categoria_nombre,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Marca',
      selector: row => row.marca_nombre,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Stock',
      selector: row => row.stock_actual,
      sortable: true,
      width: '80px',
      cell: (row) => (
        <MDTypography variant="button" fontWeight="medium" 
                      color={row.stock_actual <= (row.stock_minimo || 0) ? "error" : "success"}>
          {row.stock_actual || 0}
        </MDTypography>
      )
    },
    {
      name: 'Precio',
      selector: row => row.precio_venta,
      sortable: true,
      width: '100px',
      cell: (row) => (
        <MDTypography variant="button" fontWeight="medium" color="info">
          ${(row.precio_venta || 0).toFixed(2)}
        </MDTypography>
      )
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      width: '100px',
      cell: (row) => (
        <MDBox
          component="span"
          variant="caption"
          color={row.estado === "activo" ? "success" : "error"}
          fontWeight="medium"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: "5px",
            backgroundColor: row.estado === "activo" ? "success.main" : "error.main",
            color: "white",
            fontSize: "0.75rem",
          }}
        >
          {row.estado?.toUpperCase() || 'N/A'}
        </MDBox>
      )
    }
  ];

  // Configuración completa de campos según la tabla productos
  const productoFields = {
    // Información básica
    basic: [
      {
        name: "codigo",
        label: "Código del Producto",
        type: "text",
        required: true,
        validation: (value) => {
          if (!value || value.trim().length === 0) {
            return "El código es requerido";
          }
          if (value.length > 50) {
            return "El código no puede exceder 50 caracteres";
          }
          return null;
        }
      },
      {
        name: "nombre",
        label: "Nombre del Producto",
        type: "text",
        required: true,
        validation: (value) => {
          if (!value || value.trim().length === 0) {
            return "El nombre es requerido";
          }
          if (value.length > 255) {
            return "El nombre no puede exceder 255 caracteres";
          }
          return null;
        }
      },
    {
      name: "descripcion",
      label: "Descripción",
      type: "text",
      multiline: true,
      rows: 3,
      validation: (value) => {
        if (value && value.length > 500) {
          return "La descripción no puede exceder 500 caracteres";
        }
        return null;
      }
    },
    {
        name: "codigo_barras",
        label: "Código de Barras",
        type: "text",
        validation: (value) => {
          if (value && value.length > 50) {
            return "El código de barras no puede exceder 50 caracteres";
          }
          return null;
        }
      },
      {
        name: "codigo_interno",
        label: "Código Interno",
        type: "text",
        validation: (value) => {
          if (value && value.length > 50) {
            return "El código interno no puede exceder 50 caracteres";
          }
          return null;
        }
      },
      {
        name: "categoria_id",
        label: "Categoría",
        type: "select",
        required: true,
        options: categorias && categorias.length > 0 ? categorias.map(cat => ({ value: cat.id?.toString() || '', label: cat.nombre || '' })) : []
      },
      {
        name: "marca_id",
        label: "Marca",
        type: "select",
        required: true,
        options: marcas && marcas.length > 0 ? marcas.map(marca => ({ value: marca.Marca_ID?.toString() || marca.id?.toString() || '', label: marca.Nom_Marca || marca.nombre || '' })) : []
      },
      {
        name: "presentacion_id",
        label: "Presentación",
        type: "select",
        options: presentaciones.map(pres => ({ value: pres.id.toString(), label: pres.nombre }))
      },
      {
        name: "componente_activo_id",
        label: "Componente Activo",
        type: "select",
        options: componentesActivos.map(comp => ({ value: comp.id.toString(), label: comp.nombre }))
      },
      {
        name: "tipo_producto",
        label: "Tipo de Producto",
        type: "select",
        required: true,
        defaultValue: "producto",
        options: [
          { value: "producto", label: "Producto" },
          { value: "servicio", label: "Servicio" },
          { value: "kit", label: "Kit" }
        ]
      },
      {
        name: "almacen_id",
        label: "Almacén",
        type: "select",
        required: true,
        options: almacenes && almacenes.length > 0 ? almacenes.map(alm => ({ value: alm.Almacen_ID?.toString() || alm.id?.toString() || '', label: alm.Nom_Almacen || alm.nombre || '' })) : []
      }
    ],
    // Precios y stock
    pricing: [
      {
        name: "precio_venta",
        label: "Precio de Venta",
      type: "number",
      required: true,
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        validation: (value) => {
          if (!value || isNaN(parseFloat(value))) {
            return "El precio de venta es requerido y debe ser un número válido";
          }
          if (parseFloat(value) < 0) {
            return "El precio no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "precio_compra",
        label: "Precio de Compra",
        type: "number",
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      validation: (value) => {
        if (value && isNaN(parseFloat(value))) {
          return "El precio debe ser un número válido";
        }
        if (value && parseFloat(value) < 0) {
          return "El precio no puede ser negativo";
        }
        return null;
      }
    },
    {
        name: "precio_por_mayor",
        label: "Precio por Mayor",
      type: "number",
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El precio debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "El precio no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "costo_unitario",
        label: "Costo Unitario",
        type: "number",
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El costo debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "El costo no puede ser negativo";
        }
        return null;
      }
    },
    {
        name: "margen_ganancia",
        label: "Margen de Ganancia (%)",
        type: "number",
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El margen debe ser un número válido";
          }
          if (value && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
            return "El margen debe estar entre 0 y 100%";
          }
          return null;
        }
      },
      {
        name: "iva",
        label: "IVA (%)",
        type: "number",
        defaultValue: "21.00",
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El IVA debe ser un número válido";
          }
          if (value && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
            return "El IVA debe estar entre 0 y 100%";
          }
          return null;
        }
      },
      {
        name: "impuestos_adicionales",
        label: "Impuestos Adicionales (%)",
        type: "number",
        defaultValue: "0.00",
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "Los impuestos deben ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "Los impuestos no pueden ser negativos";
          }
          return null;
        }
      },
      {
        name: "stock_actual",
        label: "Stock Actual",
        type: "number",
        required: true,
        defaultValue: "0",
        validation: (value) => {
          if (!value || isNaN(parseInt(value))) {
            return "El stock actual es requerido y debe ser un número válido";
          }
          if (parseInt(value) < 0) {
            return "El stock no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "stock_minimo",
        label: "Stock Mínimo",
        type: "number",
        defaultValue: "0",
        validation: (value) => {
          if (value && isNaN(parseInt(value))) {
            return "El stock mínimo debe ser un número válido";
          }
          if (value && parseInt(value) < 0) {
            return "El stock mínimo no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "unidad_medida",
        label: "Unidad de Medida",
        type: "text",
        required: true,
        defaultValue: "unidad",
        validation: (value) => {
          if (!value || value.trim().length === 0) {
            return "La unidad de medida es requerida";
          }
          if (value && value.length > 20) {
            return "La unidad de medida no puede exceder 20 caracteres";
          }
          return null;
        }
      }
    ],
    // Datos físicos
    physical: [
      {
        name: "peso",
        label: "Peso (kg)",
        type: "number",
        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El peso debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "El peso no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "volumen",
        label: "Volumen (cm³)",
        type: "number",
        endAdornment: <InputAdornment position="end">cm³</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El volumen debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "El volumen no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "alto",
        label: "Alto (cm)",
        type: "number",
        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "La altura debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "La altura no puede ser negativa";
          }
          return null;
        }
      },
      {
        name: "ancho",
        label: "Ancho (cm)",
        type: "number",
        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El ancho debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "El ancho no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "largo",
        label: "Largo (cm)",
        type: "number",
        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El largo debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "El largo no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "color",
        label: "Color",
        type: "text",
        validation: (value) => {
          if (value && value.length > 30) {
            return "El color no puede exceder 30 caracteres";
          }
          return null;
        }
      },
      {
        name: "material",
        label: "Material",
        type: "text",
        validation: (value) => {
          if (value && value.length > 50) {
            return "El material no puede exceder 50 caracteres";
          }
          return null;
        }
      },
      {
        name: "ubicacion_almacen",
        label: "Ubicación en Almacén",
        type: "text",
        validation: (value) => {
          if (value && value.length > 100) {
            return "La ubicación no puede exceder 100 caracteres";
          }
          return null;
        }
      }
    ],
    // Logística y proveedor
    logistics: [
      {
        name: "almacen_id",
        label: "Almacén",
      type: "select",
      required: true,
        options: almacenes && almacenes.length > 0 ? almacenes.map(alm => ({ value: alm.Almacen_ID?.toString() || alm.id?.toString() || '', label: alm.Nom_Almacen || alm.nombre || '' })) : []
      },
      {
        name: "proveedor_id",
        label: "Proveedor",
      type: "select",
        options: proveedores && proveedores.length > 0 ? proveedores.map(prov => ({ value: prov.id?.toString() || '', label: prov.razon_social || '' })) : []
      },
      {
        name: "codigo_proveedor",
        label: "Código del Proveedor",
        type: "text",
        validation: (value) => {
          if (value && value.length > 50) {
            return "El código del proveedor no puede exceder 50 caracteres";
          }
          return null;
        }
      },
      {
        name: "tiempo_entrega_dias",
        label: "Tiempo de Entrega (días)",
        type: "number",
        endAdornment: <InputAdornment position="end">días</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseInt(value))) {
            return "El tiempo de entrega debe ser un número válido";
          }
          if (value && parseInt(value) < 0) {
            return "El tiempo de entrega no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "precio_proveedor",
        label: "Precio del Proveedor",
        type: "number",
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseFloat(value))) {
            return "El precio debe ser un número válido";
          }
          if (value && parseFloat(value) < 0) {
            return "El precio no puede ser negativo";
          }
          return null;
        }
      },
      {
        name: "fecha_fabricacion",
        label: "Fecha de Fabricación",
        type: "date",
        validation: (value) => {
          if (value) {
            const fecha = new Date(value);
            const hoy = new Date();
            if (fecha > hoy) {
              return "La fecha de fabricación no puede ser futura";
            }
          }
          return null;
        }
      },
      {
        name: "fecha_vencimiento",
        label: "Fecha de Vencimiento",
        type: "date",
        validation: (value) => {
          if (value) {
            const fecha = new Date(value);
            const hoy = new Date();
            if (fecha <= hoy) {
              return "La fecha de vencimiento debe ser futura";
            }
          }
          return null;
        }
      },
      {
        name: "vida_util_dias",
        label: "Vida Útil (días)",
        type: "number",
        endAdornment: <InputAdornment position="end">días</InputAdornment>,
        validation: (value) => {
          if (value && isNaN(parseInt(value))) {
            return "La vida útil debe ser un número válido";
          }
          if (value && parseInt(value) < 0) {
            return "La vida útil no puede ser negativa";
          }
          return null;
        }
      }
    ],
    // Configuraciones especiales
    settings: [
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: "activo",
      options: [
        { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" },
          { value: "descontinuado", label: "Descontinuado" },
          { value: "agotado", label: "Agotado" }
        ]
      },
      {
        name: "exento_iva",
        label: "Exento de IVA",
        type: "switch",
        defaultValue: false
      },
      {
        name: "inventariable",
        label: "Inventariable",
        type: "switch",
        defaultValue: true
      },
      {
        name: "visible_en_pos",
        label: "Visible en POS",
        type: "switch",
        defaultValue: true
      },
      {
        name: "permitir_venta_sin_stock",
        label: "Permitir Venta sin Stock",
        type: "switch",
        defaultValue: false
      },
      {
        name: "requiere_receta",
        label: "Requiere Receta",
        type: "switch",
        defaultValue: false
      },
      {
        name: "controlado_por_lote",
        label: "Controlado por Lote",
        type: "switch",
        defaultValue: false
      },
      {
        name: "controlado_por_fecha_vencimiento",
        label: "Controlado por Fecha de Vencimiento",
        type: "switch",
        defaultValue: false
      }
    ],
    // Notas y etiquetas
    notes: [
      {
        name: "caracteristicas",
        label: "Características",
        type: "text",
        multiline: true,
        rows: 4,
        validation: (value) => {
          if (value && value.length > 1000) {
            return "Las características no pueden exceder 1000 caracteres";
          }
          return null;
        }
      },
      {
        name: "etiquetas",
        label: "Etiquetas",
        type: "text",
        multiline: true,
        rows: 2,
        placeholder: "Separar etiquetas con comas",
        validation: (value) => {
          if (value && value.length > 200) {
            return "Las etiquetas no pueden exceder 200 caracteres";
          }
          return null;
        }
      },
      {
        name: "notas",
        label: "Notas",
        type: "text",
        multiline: true,
        rows: 4,
        validation: (value) => {
          if (value && value.length > 1000) {
            return "Las notas no pueden exceder 1000 caracteres";
          }
          return null;
        }
      },
      {
        name: "imagen_url",
        label: "URL de Imagen",
        type: "text",
        validation: (value) => {
          if (value && !/^https?:\/\/.+/.test(value)) {
            return "La URL debe ser válida (http:// o https://)";
          }
          return null;
        }
      },
      {
        name: "documentacion_url",
        label: "URL de Documentación",
        type: "text",
        validation: (value) => {
          if (value && !/^https?:\/\/.+/.test(value)) {
            return "La URL debe ser válida (http:// o https://)";
          }
          return null;
        }
      }
    ]
  };

  // Cargar datos de productos
  const loadProductos = async () => {
    try {
      setLoading(true);
      const response = await productosService.getProductos();
      const formattedData = productosService.formatProductosForTable(response.data || response || []);
      setProductos(formattedData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
    loadDatosSelectores();
  }, []);

  // Cargar datos para los selectores
  const loadDatosSelectores = async () => {
    try {
      setLoadingSelectores(true);
      console.log('🔄 Cargando datos de selectores...');
      
      const [categoriasData, marcasData, almacenesData, proveedoresData] = await Promise.all([
        productosService.getCategorias(),
        productosService.getMarcas(),
        productosService.getAlmacenes(),
        productosService.getProveedores()
      ]);

      console.log('📦 Categorías cargadas:', categoriasData.length);
      console.log('🏷️ Marcas cargadas:', marcasData.length);
      console.log('🏪 Almacenes cargados:', almacenesData.length);
      console.log('👥 Proveedores cargados:', proveedoresData.length);

      setCategorias(categoriasData);
      setMarcas(marcasData);
      setAlmacenes(almacenesData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('❌ Error al cargar datos de selectores:', error);
    } finally {
      setLoadingSelectores(false);
    }
  };

  // Funciones para manejar modales
  const handleOpenModal = (mode, productoData = null) => {
    setModalMode(mode);
    setSelectedProducto(productoData);
    setModalOpen(true);
    setTabValue(0);
    
    // Inicializar datos del formulario
    if (productoData && (mode === "edit" || mode === "view")) {
      setFormData(productoData);
    } else {
      setFormData({
        tipo_producto: "producto",
        unidad_medida: "unidad",
        estado: "activo",
        visible_en_pos: true,
        inventariable: true,
        exento_iva: false,
        permitir_venta_sin_stock: false,
        requiere_receta: false,
        controlado_por_lote: false,
        controlado_por_fecha_vencimiento: false,
        stock_actual: 0,
        stock_minimo: 0,
        iva: 21.00,
        impuestos_adicionales: 0.00
      });
    }
    setErrors({});
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProducto(null);
    setFormData({});
    setErrors({});
    setTabValue(0);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validar todos los campos de todas las secciones
    Object.values(productoFields).flat().forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} es requerido`;
        isValid = false;
      }

      if (field.validation && formData[field.name]) {
        const validationError = field.validation(formData[field.name]);
        if (validationError) {
          newErrors[field.name] = validationError;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      let productoId;
      
      if (modalMode === "create") {
        const response = await productosService.createProducto(formData);
        productoId = response.data?.id || response.id;
        
        // Crear stock automáticamente en todas las sucursales
        if (productoId) {
          try {
            // Obtener todas las sucursales
            const sucursalesResponse = await fetch('/api/sucursales');
            const sucursalesData = await sucursalesResponse.json();
            const todasLasSucursales = sucursalesData.data || [
              { id: 1, nombre: 'Sucursal Centro' },
              { id: 2, nombre: 'Sucursal Norte' },
              { id: 3, nombre: 'Sucursal Sur' },
              { id: 4, nombre: 'Sucursal Este' },
              { id: 5, nombre: 'Sucursal Oeste' }
            ];

            // Crear stock inicial en todas las sucursales
            const stockInicial = {
              producto_id: productoId,
              sucursales: todasLasSucursales.map(s => s.id),
              cantidad: formData.stock_actual || 0,
              costo_unitario: formData.precio_compra || 0,
              lote: 'LOTE_INICIAL',
              fecha_fabricacion: new Date().toISOString().split('T')[0],
              fecha_vencimiento: '',
              observaciones: 'Stock inicial creado automáticamente'
            };

            console.log('Creando stock inicial:', stockInicial);
            
            // Usar el servicio de stock para crear el stock inicial
            await stockService.createStockInicial(stockInicial);
            
            console.log(`Stock inicial creado en ${todasLasSucursales.length} sucursales`);
          } catch (stockError) {
            console.error('Error al crear stock inicial:', stockError);
            // No fallar la creación del producto si falla el stock
          }
        }
      } else if (modalMode === "edit") {
        await productosService.updateProducto(selectedProducto.id, formData);
      }
      
      handleCloseModal();
      loadProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setErrors({ general: productosService.getMensajeError(error) });
    } finally {
      setSubmitting(false);
    }
  };

  // Funciones para los botones de acción
  const handleAddStock = (producto) => {
    console.log('Agregar stock al producto:', producto);
    setSelectedProductoForStock(producto);
    setStockFormData({
      cantidad: 0,
      sucursales: [],
      costo_unitario: producto.precio_compra || 0,
      lote: '',
      fecha_fabricacion: '',
      fecha_vencimiento: '',
      observaciones: ''
    });
    setStockModalOpen(true);
    loadSucursales();
  };

  const handleViewStock = async (producto) => {
    try {
      console.log('Ver stock del producto:', producto);
      const stockData = await stockService.getStockProducto(producto.id);
      console.log('Stock del producto:', stockData);
      
      // Aquí puedes abrir un modal para mostrar el stock
      alert(`Stock del producto ${producto.nombre}:\n${JSON.stringify(stockData, null, 2)}`);
    } catch (error) {
      console.error('Error al obtener stock:', error);
      alert(`Error al obtener stock: ${error}`);
    }
  };

  const handleViewHistory = async (producto) => {
    try {
      console.log('Ver historial del producto:', producto);
      const historialData = await stockService.getHistorialStock(producto.id);
      console.log('Historial del producto:', historialData);
      
      // Aquí puedes abrir un modal para mostrar el historial
      alert(`Historial del producto ${producto.nombre}:\n${JSON.stringify(historialData, null, 2)}`);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      alert(`Error al obtener historial: ${error}`);
    }
  };

  const handleDelete = (producto) => {
    console.log('Eliminar producto:', producto);
    // Aquí puedes mostrar una confirmación antes de eliminar
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto: ${producto.nombre}?`)) {
      alert(`Eliminar producto: ${producto.nombre}`);
    }
  };

  // Funciones para el modal de stock
  const loadSucursales = async () => {
    try {
      setLoadingSucursales(true);
      // Aquí deberías llamar a tu servicio de sucursales
      const response = await fetch('/api/sucursales');
      const data = await response.json();
      setSucursales(data.data || []);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      // Datos de ejemplo para desarrollo
      setSucursales([
        { id: 1, nombre: 'Sucursal Centro', codigo: 'CENTRO' },
        { id: 2, nombre: 'Sucursal Norte', codigo: 'NORTE' },
        { id: 3, nombre: 'Sucursal Sur', codigo: 'SUR' },
        { id: 4, nombre: 'Sucursal Este', codigo: 'ESTE' },
        { id: 5, nombre: 'Sucursal Oeste', codigo: 'OESTE' }
      ]);
    } finally {
      setLoadingSucursales(false);
    }
  };

  const handleStockInputChange = (field, value) => {
    setStockFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSucursalToggle = (sucursalId) => {
    setStockFormData(prev => ({
      ...prev,
      sucursales: prev.sucursales.includes(sucursalId)
        ? prev.sucursales.filter(id => id !== sucursalId)
        : [...prev.sucursales, sucursalId]
    }));
  };

  const handleSubmitStock = async () => {
    try {
      setSubmitting(true);
      
      // Validar que se haya seleccionado al menos una sucursal
      if (stockFormData.sucursales.length === 0) {
        alert('Debe seleccionar al menos una sucursal');
        return;
      }

      // Validar que la cantidad sea mayor a 0
      if (stockFormData.cantidad <= 0) {
        alert('La cantidad debe ser mayor a 0');
        return;
      }

      // Preparar datos para el servicio de stock
      const stockData = {
        producto_id: selectedProductoForStock.id,
        sucursales: stockFormData.sucursales,
        cantidad: stockFormData.cantidad,
        costo_unitario: stockFormData.costo_unitario,
        lote: stockFormData.lote,
        fecha_fabricacion: stockFormData.fecha_fabricacion,
        fecha_vencimiento: stockFormData.fecha_vencimiento,
        observaciones: stockFormData.observaciones
      };

      console.log('Enviando datos de stock:', stockData);
      
      // Usar el servicio de stock para agregar stock
      await stockService.agregarStock(stockData);
      
      alert(`Stock agregado exitosamente a ${stockFormData.sucursales.length} sucursal(es)`);
      handleCloseStockModal();
      loadProductos(); // Recargar productos para actualizar stock
      
    } catch (error) {
      console.error('Error al agregar stock:', error);
      alert(`Error al agregar stock: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseStockModal = () => {
    setStockModalOpen(false);
    setSelectedProductoForStock(null);
    setStockFormData({
      cantidad: 0,
      sucursales: [],
      costo_unitario: 0,
      lote: '',
      fecha_fabricacion: '',
      fecha_vencimiento: '',
      observaciones: ''
    });
  };

  const renderField = (field) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];

         if (field.type === "select") {
       return (
         <FormControl fullWidth error={!!error} required={field.required}>
                      <InputLabel>{field.label}</InputLabel>
           <Select
             value={value}
             onChange={(e) => handleInputChange(field.name, e.target.value)}
             label={field.label}
             disabled={modalMode === "view"}
             sx={{
               backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
               '& .MuiOutlinedInput-notchedOutline': {
                 borderColor: darkMode ? '#666666' : '#e0e0e0'
               },
               '&:hover .MuiOutlinedInput-notchedOutline': {
                 borderColor: darkMode ? '#888888' : '#bdbdbd'
               },
               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                 borderColor: '#1976d2'
               },
               '& .MuiSelect-icon': {
                 color: darkMode ? '#ffffff' : '#000000'
               }
             }}
             MenuProps={{
               PaperProps: {
                 sx: {
                   backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                   '& .MuiMenuItem-root': {
                     color: darkMode ? '#ffffff' : '#000000',
                     '&:hover': {
                       backgroundColor: darkMode ? '#333333' : '#f5f5f5'
                     }
                   }
                 }
               }
             }}
           >
             {field.options.map((option) => (
               <MenuItem key={option.value} value={option.value}>
                 {option.label}
               </MenuItem>
             ))}
           </Select>
           {error && (
             <Typography variant="caption" color="error">
               {error}
             </Typography>
           )}
         </FormControl>
       );
     }

         if (field.type === "switch") {
       return (
         <FormControlLabel
           control={
             <Switch
               checked={value || field.defaultValue || false}
               onChange={(e) => handleInputChange(field.name, e.target.checked)}
               disabled={modalMode === "view"}
             />
           }
           label={field.label}
         />
       );
     }

         return (
       <TextField
         fullWidth
         label={field.label}
         value={value}
         onChange={(e) => handleInputChange(field.name, e.target.value)}
         error={!!error}
         helperText={error}
         required={field.required}
         disabled={modalMode === "view"}
         multiline={field.multiline}
         rows={field.rows}
         type={field.type}
         InputProps={{
           startAdornment: field.startAdornment,
           endAdornment: field.endAdornment
         }}
         placeholder={field.placeholder}
         sx={{
           '& .MuiOutlinedInput-root': {
             backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
             '& fieldset': {
               borderColor: darkMode ? '#666666' : '#e0e0e0'
             },
             '&:hover fieldset': {
               borderColor: darkMode ? '#888888' : '#bdbdbd'
             },
             '&.Mui-focused fieldset': {
               borderColor: '#1976d2'
             }
           },
           '& .MuiInputLabel-root': {
             color: darkMode ? '#ffffff' : '#000000'
           },
           '& .MuiInputBase-input': {
             color: darkMode ? '#ffffff' : '#000000'
           }
         }}
       />
     );
  };

     const renderSection = (sectionKey, sectionName) => {
     const fields = productoFields[sectionKey];
     
     return (
       <TabPanel value={tabValue} index={Object.keys(productoFields).indexOf(sectionKey)}>
         <Grid container spacing={3}>
           {fields.map((field) => (
             <Grid item xs={12} sm={6} md={4} key={field.name}>
               {renderField(field)}
             </Grid>
           ))}
         </Grid>
       </TabPanel>
     );
  };

  // Configuración de la tabla
  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: '70px',
      center: true
    },
    {
      name: "Código",
      selector: row => row.codigo,
      sortable: true,
      width: '150px'
    },
    {
      name: "Nombre",
      selector: row => row.nombre,
      sortable: true,
      width: '300px',
      wrap: true
    },
    {
      name: "Precio",
      selector: row => row.precio,
      sortable: true,
      width: '120px',
      center: true
    },
    {
      name: "Stock",
      selector: row => row.stock,
      sortable: true,
      width: '100px',
      center: true
    },
    {
      name: "Categoría",
      selector: row => row.categoria,
      sortable: true,
      width: '150px'
    },
    {
      name: "Marca",
      selector: row => row.marca,
      sortable: true,
      width: '150px'
    },
    {
      name: "Estado",
      selector: row => row.estado,
      sortable: true,
      width: '120px',
      center: true,
      cell: row => (
        <MDBox
          component="span"
          variant="caption"
          color={row.estado === "activo" ? "success" : "error"}
          fontWeight="medium"
        >
          {row.estado === "activo" ? "ACTIVO" : "INACTIVO"}
        </MDBox>
      )
    },
    {
      name: "Creado",
      selector: row => row.created_at,
      sortable: true,
      width: '120px',
      center: true
    },
    {
      name: "Actualizado",
      selector: row => row.updated_at,
      sortable: true,
      width: '120px',
      center: true
    },
    {
      name: "Acciones",
      selector: row => row.id,
      sortable: false,
      width: '280px',
      center: true,
      cell: row => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <IconButton 
            size="small"
            sx={{ color: "info.main" }} 
            onClick={() => handleOpenModal("view", row)}
            title="Ver detalles"
          >
            <Icon fontSize="small">visibility</Icon>
          </IconButton>
          <IconButton 
            size="small"
            sx={{ color: "warning.main" }} 
            onClick={() => handleOpenModal("edit", row)}
            title="Editar producto"
          >
            <Icon fontSize="small">edit</Icon>
          </IconButton>
          <IconButton 
            size="small"
            sx={{ color: "success.main" }} 
            onClick={() => handleAddStock(row)}
            title="Agregar stock"
          >
            <Icon fontSize="small">add_shopping_cart</Icon>
          </IconButton>
          <IconButton 
            size="small"
            sx={{ color: "info.main" }} 
            onClick={() => handleViewStock(row)}
            title="Ver stock"
          >
            <Icon fontSize="small">inventory</Icon>
          </IconButton>
          <IconButton 
            size="small"
            sx={{ color: "secondary.main" }} 
            onClick={() => handleViewHistory(row)}
            title="Historial"
          >
            <Icon fontSize="small">history</Icon>
          </IconButton>
          <IconButton 
            size="small"
            sx={{ color: "error.main" }} 
            onClick={() => handleDelete(row)}
            title="Eliminar"
          >
            <Icon fontSize="small">delete</Icon>
          </IconButton>
        </MDBox>
      )
    }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Gestión de Productos
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra los productos del sistema
        </MDTypography>
        
        {/* Botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={6} display="flex" justifyContent="flex-start">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOpenModal("create")}
            >
              Nuevo Producto
            </MDButton>
            <MDBox ml={1}>
              <MDButton 
                variant="gradient" 
                color="info" 
                startIcon={<Icon>upload_file</Icon>}
                onClick={() => navigate('/admin/productos/bulk-upload')}
              >
                Carga Masiva
              </MDButton>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
              Exportar
            </MDButton>
          </Grid>
        </Grid>

        {/* Tabla de productos */}
        <Box sx={{ 
          height: 'calc(100vh - 300px)', // Altura específica dejando espacio para header y botones
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: 'background.paper'
        }}>
          <Box sx={{ 
            minWidth: '1200px', // Ancho mínimo para asegurar que todas las columnas sean visibles
            overflow: 'auto'
          }}>
            <TableThemeProvider>
              <StandardDataTable
              service={productosTableService}
              columns={productosColumns}
              title="Productos"
              subtitle="Gestión completa de productos e inventario"
              enableCreate={false}
              enableEdit={false}
              enableDelete={false}
              enableSearch={true}
              enableFilters={true}
              enableStats={false}
              enableExport={true}
              serverSide={true}
              defaultPageSize={10}
              defaultSortField="nombre"
              defaultSortDirection="asc"
              onRowClick={(row) => handleOpenModal("view", row)}
              permissions={{
                create: true,
                edit: true,
                delete: true,
                view: true
              }}
              />
            </TableThemeProvider>
          </Box>
        </Box>

                {/* Modal personalizado sin transparencia */}
        {modalOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleCloseModal}
          >
            <Box
              sx={{
                backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                borderRadius: '8px',
                width: '95%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <Box
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
                }}
              >
                <MDTypography variant="h5" fontWeight="bold">
                  {modalMode === "create" ? "Nuevo Producto" : 
                   modalMode === "edit" ? "Editar Producto" : "Ver Producto"}
                </MDTypography>
                <IconButton 
                  onClick={handleCloseModal}
                  sx={{ color: '#ffffff' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                {errors.general && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.general}
                  </Alert>
                )}

                {/* Tabs */}
                <Box sx={{ 
                  borderBottom: 1, 
                  borderColor: darkMode ? '#555555' : '#e0e0e0', 
                  mb: 3
                }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={(e, newValue) => setTabValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        color: darkMode ? '#ffffff' : '#000000',
                        '&.Mui-selected': {
                          color: '#1976d2'
                        }
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#1976d2'
                      }
                    }}
                  >
                    <Tab label="Información Básica" />
                    <Tab label="Precios y Stock" />
                    <Tab label="Datos Físicos" />
                    <Tab label="Logística" />
                    <Tab label="Configuraciones" />
                    <Tab label="Notas" />
                  </Tabs>
                </Box>

                               {/* Tab Content */}
               {loadingSelectores ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                   <CircularProgress />
                   <MDTypography variant="body2" sx={{ ml: 2 }}>
                     Cargando datos de selectores...
                   </MDTypography>
                 </Box>
               ) : (
                 <>
                   {renderSection("basic", "Información Básica")}
                   {renderSection("pricing", "Precios y Stock")}
                   {renderSection("physical", "Datos Físicos")}
                   {renderSection("logistics", "Logística y Proveedor")}
                   {renderSection("settings", "Configuraciones Especiales")}
                   {renderSection("notes", "Notas y Etiquetas")}
                 </>
               )}
              </Box>

              {/* Footer */}
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
                <MDButton onClick={handleCloseModal} color="secondary">
                  Cancelar
                </MDButton>
                {modalMode !== "view" && (
                  <MDButton 
                    onClick={handleSubmit} 
                    variant="gradient" 
                    color="success"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} /> : null}
                  >
                    {submitting ? "Guardando..." : "Guardar Producto"}
                  </MDButton>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Modal de Stock */}
        {stockModalOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleCloseStockModal}
          >
            <Box
              sx={{
                backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                borderRadius: '8px',
                width: '95%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
                }}
              >
                <MDTypography variant="h5" fontWeight="bold">
                  Agregar Stock a {selectedProductoForStock?.nombre}
                </MDTypography>
                <IconButton 
                  onClick={handleCloseStockModal}
                  sx={{ color: '#ffffff' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ padding: '24px' }}>
                {errors.general && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.general}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Producto: {selectedProductoForStock?.nombre}
                    </MDTypography>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Código: {selectedProductoForStock?.codigo}
                    </MDTypography>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Precio de Compra: ${selectedProductoForStock?.precio_compra || 0}
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Cantidad a Agregar:
                    </MDTypography>
                    <TextField
                      fullWidth
                      type="number"
                      value={stockFormData.cantidad}
                      onChange={(e) => handleStockInputChange('cantidad', parseFloat(e.target.value) || 0)}
                      error={!!errors.cantidad}
                      helperText={errors.cantidad}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                          '& fieldset': {
                            borderColor: darkMode ? '#666666' : '#e0e0e0'
                          },
                          '&:hover fieldset': {
                            borderColor: darkMode ? '#888888' : '#bdbdbd'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: darkMode ? '#ffffff' : '#000000'
                        },
                        '& .MuiInputBase-input': {
                          color: darkMode ? '#ffffff' : '#000000'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Costo Unitario:
                    </MDTypography>
                    <TextField
                      fullWidth
                      type="number"
                      value={stockFormData.costo_unitario}
                      onChange={(e) => handleStockInputChange('costo_unitario', parseFloat(e.target.value) || 0)}
                      error={!!errors.costo_unitario}
                      helperText={errors.costo_unitario}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                          '& fieldset': {
                            borderColor: darkMode ? '#666666' : '#e0e0e0'
                          },
                          '&:hover fieldset': {
                            borderColor: darkMode ? '#888888' : '#bdbdbd'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: darkMode ? '#ffffff' : '#000000'
                        },
                        '& .MuiInputBase-input': {
                          color: darkMode ? '#ffffff' : '#000000'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Lote:
                    </MDTypography>
                    <TextField
                      fullWidth
                      value={stockFormData.lote}
                      onChange={(e) => handleStockInputChange('lote', e.target.value)}
                      error={!!errors.lote}
                      helperText={errors.lote}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                          '& fieldset': {
                            borderColor: darkMode ? '#666666' : '#e0e0e0'
                          },
                          '&:hover fieldset': {
                            borderColor: darkMode ? '#888888' : '#bdbdbd'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: darkMode ? '#ffffff' : '#000000'
                        },
                        '& .MuiInputBase-input': {
                          color: darkMode ? '#ffffff' : '#000000'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Fecha de Fabricación:
                    </MDTypography>
                    <TextField
                      fullWidth
                      type="date"
                      value={stockFormData.fecha_fabricacion}
                      onChange={(e) => handleStockInputChange('fecha_fabricacion', e.target.value)}
                      error={!!errors.fecha_fabricacion}
                      helperText={errors.fecha_fabricacion}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                          '& fieldset': {
                            borderColor: darkMode ? '#666666' : '#e0e0e0'
                          },
                          '&:hover fieldset': {
                            borderColor: darkMode ? '#888888' : '#bdbdbd'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: darkMode ? '#ffffff' : '#000000'
                        },
                        '& .MuiInputBase-input': {
                          color: darkMode ? '#ffffff' : '#000000'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Fecha de Vencimiento:
                    </MDTypography>
                    <TextField
                      fullWidth
                      type="date"
                      value={stockFormData.fecha_vencimiento}
                      onChange={(e) => handleStockInputChange('fecha_vencimiento', e.target.value)}
                      error={!!errors.fecha_vencimiento}
                      helperText={errors.fecha_vencimiento}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                          '& fieldset': {
                            borderColor: darkMode ? '#666666' : '#e0e0e0'
                          },
                          '&:hover fieldset': {
                            borderColor: darkMode ? '#888888' : '#bdbdbd'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: darkMode ? '#ffffff' : '#000000'
                        },
                        '& .MuiInputBase-input': {
                          color: darkMode ? '#ffffff' : '#000000'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Observaciones:
                    </MDTypography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={stockFormData.observaciones}
                      onChange={(e) => handleStockInputChange('observaciones', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                          '& fieldset': {
                            borderColor: darkMode ? '#666666' : '#e0e0e0'
                          },
                          '&:hover fieldset': {
                            borderColor: darkMode ? '#888888' : '#bdbdbd'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: darkMode ? '#ffffff' : '#000000'
                        },
                        '& .MuiInputBase-input': {
                          color: darkMode ? '#ffffff' : '#000000'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Sucursales:
                    </MDTypography>
                    {loadingSucursales ? (
                      <CircularProgress size={20} />
                    ) : (
                      <MDBox display="flex" flexWrap="wrap" gap={1}>
                        {sucursales.map((sucursal) => (
                          <MDButton
                            key={sucursal.id}
                            variant={stockFormData.sucursales.includes(sucursal.id) ? "contained" : "outlined"}
                            onClick={() => handleSucursalToggle(sucursal.id)}
                            size="small"
                            sx={{
                              backgroundColor: stockFormData.sucursales.includes(sucursal.id) ? '#1976d2' : 'transparent',
                              color: stockFormData.sucursales.includes(sucursal.id) ? '#ffffff' : darkMode ? '#ffffff' : '#000000',
                              borderColor: stockFormData.sucursales.includes(sucursal.id) ? '#1976d2' : darkMode ? '#666666' : '#e0e0e0',
                              '&:hover': {
                                backgroundColor: stockFormData.sucursales.includes(sucursal.id) ? '#1565c0' : '#f5f5f5',
                                borderColor: stockFormData.sucursales.includes(sucursal.id) ? '#1565c0' : '#bdbdbd'
                              }
                            }}
                          >
                            {sucursal.nombre}
                          </MDButton>
                        ))}
                      </MDBox>
                    )}
                  </Grid>
                </Grid>
              </Box>

              {/* Footer */}
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
                <MDButton onClick={handleCloseStockModal} color="secondary">
                  Cancelar
                </MDButton>
                <MDButton 
                  onClick={handleSubmitStock} 
                  variant="gradient" 
                  color="success"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? "Agregando Stock..." : "Agregar Stock"}
                </MDButton>
              </Box>
            </Box>
          </Box>
        )}
      </MDBox>
    </DashboardLayout>
  );
} 