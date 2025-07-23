import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import './SucursalesTable.css';
import './ServiciosTable.css';
import PillLoader from './PillLoader';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Typography,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Switch,
  FormControlLabel,
  Slider,
  Rating,
  LinearProgress,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  Breadcrumbs,
  Link,
  Pagination,
  TablePagination,
  Autocomplete,
  Checkbox,
  Radio,
  RadioGroup,
  FormGroup,
  FormLabel,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  FilledInput,
  Input,
  InputBase,
  NativeSelect,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocalOffer as LocalOfferIcon,
  Category as CategoryIcon,
  Branding as BrandingIcon,
  Business as BusinessIcon,
  Language as LanguageIcon,
  Web as WebIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Hdd as HddIcon,
  Dns as DnsIcon,
  Router as RouterIcon,
  Hub as HubIcon,
  AccountTree as AccountTreeIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  CreateNewFolder as CreateFolderIcon,
  DriveFileRenameOutline as RenameIcon,
  ContentCopy as CopyIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Public as PublicIcon,
  Private as PrivateIcon,
  Verified as VerifiedIcon,
  GppBad as GppBadIcon,
  GppMaybe as GppMaybeIcon,
  GppGood as GppGoodIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  HelpOutline as HelpOutlineIcon,
  InfoOutline as InfoOutlineIcon,
  WarningAmber as WarningAmberIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsNone as NotificationsNoneIcon,
  NotificationsOff as NotificationsOffIcon,
  NotificationsPaused as NotificationsPausedIcon,
  NotificationsImportant as NotificationsImportantIcon,
  NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
  NotificationsActiveOutlined as NotificationsActiveOutlinedIcon,
  NotificationsOffOutlined as NotificationsOffOutlinedIcon,
  NotificationsPausedOutlined as NotificationsPausedOutlinedIcon,
  NotificationsImportantOutlined as NotificationsImportantOutlinedIcon,
  NotificationsNoneRounded as NotificationsNoneRoundedIcon,
  NotificationsActiveRounded as NotificationsActiveRoundedIcon,
  NotificationsOffRounded as NotificationsOffRoundedIcon,
  NotificationsPausedRounded as NotificationsPausedRoundedIcon,
  NotificationsImportantRounded as NotificationsImportantRoundedIcon,
  NotificationsNoneSharp as NotificationsNoneSharpIcon,
  NotificationsActiveSharp as NotificationsActiveSharpIcon,
  NotificationsOffSharp as NotificationsOffSharpIcon,
  NotificationsPausedSharp as NotificationsPausedSharpIcon,
  NotificationsImportantSharp as NotificationsImportantSharpIcon,
  NotificationsNoneTwoTone as NotificationsNoneTwoToneIcon,
  NotificationsActiveTwoTone as NotificationsActiveTwoToneIcon,
  NotificationsOffTwoTone as NotificationsOffTwoToneIcon,
  NotificationsPausedTwoTone as NotificationsPausedTwoToneIcon,
  NotificationsImportantTwoTone as NotificationsImportantTwoToneIcon,
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';
import MDLoader from 'components/MDLoader';
import ThemedModal from 'components/ThemedModal';
import servicioService from 'services/servicio-service';
import marcaService from 'services/marca-service';
import { useNotifications } from 'hooks/useNotifications';
import Swal from 'sweetalert2';

const ServiciosTable = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);
  const { showNotification } = useNotifications();
  
  const [form, setForm] = useState({
    Nom_Serv: '',
    Estado: 'Activo',
    Descripcion: '',
    Precio_Base: '',
    Requiere_Cita: false,
    Sistema: 'POS',
    ID_H_O_D: 'Saluda',
    marcas: []
  });

  // Obtener tipo de usuario de localStorage
  const userType = localStorage.getItem('userRole') || 'Usuario';
  const canEdit = ['Administrador', 'Admin'].includes(userType);
  const canDelete = userType === 'Administrador';

  // Inyectar CSS dinámico para header y texto de celdas
  useEffect(() => {
    const styleId = "datatable-servicios-style";
    let styleTag = document.getElementById(styleId);
    if (styleTag) styleTag.remove();
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.innerHTML = `
      .servicios-table .dataTables_wrapper .dataTable thead th {
        background-color: ${tableHeaderColor} !important;
        color: ${darkMode ? '#fff' : '#344767'} !important;
        border-bottom: 1px solid ${darkMode ? '#344767' : '#dee2e6'} !important;
      }
      .servicios-table .dataTables_wrapper .dataTable tbody td {
        color: ${darkMode ? '#fff' : '#344767'} !important;
        border-bottom: 1px solid ${darkMode ? '#344767' : '#dee2e6'} !important;
      }
      .servicios-table .dataTables_info,
      .servicios-table .dataTables_length label,
      .servicios-table .dataTables_filter label {
        color: ${darkMode ? '#fff' : '#344767'} !important;
      }
      .servicios-table .dataTables_paginate .paginate_button {
        color: ${darkMode ? '#fff' : '#344767'} !important;
      }
      .servicios-table .dataTables_paginate .paginate_button.current {
        background: ${tableHeaderColor} !important;
        color: white !important;
        border-color: ${tableHeaderColor} !important;
      }
      .precio-formateado {
        font-weight: 600;
        color: #1976d2;
      }
      .precio-no-definido {
        color: #757575;
        font-style: italic;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      if (document.getElementById(styleId)) {
        document.getElementById(styleId).remove();
      }
    };
  }, [tableHeaderColor, darkMode]);

  // Cargar marcas disponibles
  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const response = await marcaService.getMarcasActivas();
        setMarcasDisponibles(response.data || []);
      } catch (error) {
        console.error('Error cargando marcas:', error);
        showNotification('Error al cargar marcas disponibles', 'error');
      }
    };
    cargarMarcas();
  }, []);

  // Configurar DataTable
  useEffect(() => {
    if (!tableRef.current) return;

    const table = $(tableRef.current).DataTable({
      ...getDataTablesConfig(),
      processing: true,
      serverSide: true,
      ajax: {
        url: 'http://localhost:8000/api/servicios',
        type: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: function(d) {
          return {
            draw: d.draw,
            start: d.start,
            length: d.length,
            search: d.search,
            order: d.order
          };
        },
        dataSrc: function(json) {
          setLoading(false);
          return json.data || [];
        },
        error: function(xhr, error, thrown) {
          console.error('Error en DataTable:', error);
          setLoading(false);
          showNotification('Error al cargar servicios', 'error');
        }
      },
      columns: [
        {
          data: 'id',
          title: 'ID',
          width: '60px',
          className: 'text-center'
        },
        {
          data: 'nombre',
          title: 'Nombre del Servicio',
          width: '25%',
          render: function(data, type, row) {
            if (type === 'display') {
              return `<strong>${data}</strong>`;
            }
            return data;
          }
        },
        {
          data: 'estado',
          title: 'Estado',
          width: '10%',
          className: 'text-center',
          render: function(data, type, row) {
            if (type === 'display') {
              const color = data === 'Activo' ? 'success' : 'error';
              const bgColor = data === 'Activo' ? '#4caf50' : '#f44336';
              return `<span class="badge" style="background-color: ${bgColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem;">${data}</span>`;
            }
            return data;
          }
        },
        {
          data: 'precio_formateado',
          title: 'Precio',
          width: '12%',
          className: 'text-right',
          render: function(data, type, row) {
            if (type === 'display') {
              if (row.precio_base) {
                return `<span class="precio-formateado">${data}</span>`;
              } else {
                return `<span class="precio-no-definido">No definido</span>`;
              }
            }
            return data;
          }
        },
        {
          data: 'requiere_cita_texto',
          title: 'Requiere Cita',
          width: '10%',
          className: 'text-center',
          render: function(data, type, row) {
            if (type === 'display') {
              const color = data === 'Sí' ? '#2196f3' : '#757575';
              return `<span style="color: ${color}; font-weight: 500;">${data}</span>`;
            }
            return data;
          }
        },
        {
          data: 'sistema',
          title: 'Sistema',
          width: '12%',
          className: 'text-center'
        },
        {
          data: 'creado_en',
          title: 'Fecha Creación',
          width: '12%',
          className: 'text-center',
          render: function(data, type, row) {
            if (type === 'display' && data) {
              return new Date(data).toLocaleDateString('es-ES');
            }
            return data;
          }
        },
        {
          data: null,
          title: 'Acciones',
          width: '15%',
          className: 'text-center',
          orderable: false,
          render: function(data, type, row) {
            if (type === 'display') {
              let actions = '';
              
              // Ver detalles
              actions += `<button class="btn-action btn-view" data-id="${row.id}" title="Ver detalles">
                <i class="material-icons">visibility</i>
              </button>`;
              
              if (canEdit) {
                // Editar
                actions += `<button class="btn-action btn-edit" data-id="${row.id}" title="Editar">
                  <i class="material-icons">edit</i>
                </button>`;
                
                // Toggle estado
                const toggleIcon = row.estado === 'Activo' ? 'toggle_on' : 'toggle_off';
                const toggleColor = row.estado === 'Activo' ? '#4caf50' : '#757575';
                actions += `<button class="btn-action btn-toggle" data-id="${row.id}" title="Cambiar estado" style="color: ${toggleColor}">
                  <i class="material-icons">${toggleIcon}</i>
                </button>`;
              }
              
              if (canDelete) {
                // Eliminar
                actions += `<button class="btn-action btn-delete" data-id="${row.id}" title="Eliminar">
                  <i class="material-icons">delete</i>
                </button>`;
              }
              
              return `<div class="action-buttons">${actions}</div>`;
            }
            return '';
          }
        }
      ],
      order: [[0, 'desc']],
      responsive: true,
      language: getDataTablesConfig().language
    });

    // Event handlers para acciones
    $(tableRef.current).on('click', '.btn-view', function() {
      const id = $(this).data('id');
      verServicio(id);
    });

    $(tableRef.current).on('click', '.btn-edit', function() {
      const id = $(this).data('id');
      editarServicio(id);
    });

    $(tableRef.current).on('click', '.btn-toggle', function() {
      const id = $(this).data('id');
      toggleEstadoServicio(id);
    });

    $(tableRef.current).on('click', '.btn-delete', function() {
      const id = $(this).data('id');
      eliminarServicio(id);
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [canEdit, canDelete]);

  // Funciones de manejo
  const verServicio = async (id) => {
    try {
      const servicio = await servicioService.getServicio(id, true);
      
      Swal.fire({
        title: servicio.nombre,
        html: `
          <div style="text-align: left;">
            <p><strong>Estado:</strong> ${servicio.estado}</p>
            <p><strong>Descripción:</strong> ${servicio.descripcion || 'No especificada'}</p>
            <p><strong>Precio Base:</strong> ${servicio.precio_formateado}</p>
            <p><strong>Requiere Cita:</strong> ${servicio.requiere_cita_texto}</p>
            <p><strong>Sistema:</strong> ${servicio.sistema}</p>
            <p><strong>Organización:</strong> ${servicio.organizacion}</p>
            <p><strong>Agregado por:</strong> ${servicio.agregado_por}</p>
            ${servicio.marcas_count > 0 ? `<p><strong>Marcas asociadas:</strong> ${servicio.marcas_count}</p>` : ''}
          </div>
        `,
        icon: 'info',
        width: 600,
        confirmButtonText: 'Cerrar'
      });
    } catch (error) {
      showNotification('Error al cargar detalles del servicio', 'error');
    }
  };

  const editarServicio = async (id) => {
    try {
      const servicio = await servicioService.getServicio(id, true);
      setEditingServicio(servicio);
      setForm({
        Nom_Serv: servicio.nombre,
        Estado: servicio.estado,
        Descripcion: servicio.descripcion || '',
        Precio_Base: servicio.precio_base || '',
        Requiere_Cita: servicio.requiere_cita,
        Sistema: servicio.sistema,
        ID_H_O_D: servicio.organizacion,
        marcas: servicio.marcas || []
      });
      setOpen(true);
    } catch (error) {
      showNotification('Error al cargar servicio para editar', 'error');
    }
  };

  const toggleEstadoServicio = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Cambiar estado del servicio?',
        text: 'Esto cambiará entre Activo e Inactivo',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await servicioService.toggleStatus(id);
        showNotification('Estado del servicio actualizado', 'success');
        $(tableRef.current).DataTable().ajax.reload();
      }
    } catch (error) {
      showNotification('Error al cambiar estado del servicio', 'error');
    }
  };

  const eliminarServicio = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar servicio?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        await servicioService.deleteServicio(id);
        showNotification('Servicio eliminado correctamente', 'success');
        $(tableRef.current).DataTable().ajax.reload();
      }
    } catch (error) {
      showNotification('Error al eliminar servicio', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const errors = servicioService.validateServicioData(form);
      if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return;
      }

      const servicioData = {
        ...form,
        Precio_Base: form.Precio_Base ? parseFloat(form.Precio_Base) : null
      };

      if (editingServicio) {
        await servicioService.updateServicio(editingServicio.id, servicioData);
        showNotification('Servicio actualizado correctamente', 'success');
      } else {
        await servicioService.createServicio(servicioData);
        showNotification('Servicio creado correctamente', 'success');
      }

      handleClose();
      $(tableRef.current).DataTable().ajax.reload();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingServicio(null);
    setForm({
      Nom_Serv: '',
      Estado: 'Activo',
      Descripcion: '',
      Precio_Base: '',
      Requiere_Cita: false,
      Sistema: 'POS',
      ID_H_O_D: 'Saluda',
      marcas: []
    });
  };

  const handleNuevoServicio = () => {
    setEditingServicio(null);
    setForm({
      Nom_Serv: '',
      Estado: 'Activo',
      Descripcion: '',
      Precio_Base: '',
      Requiere_Cita: false,
      Sistema: 'POS',
      ID_H_O_D: 'Saluda',
      marcas: []
    });
    setOpen(true);
  };

  return (
    <div className="servicios-table">
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            <Typography color="inherit">Inicio</Typography>
          </Box>
          <Typography color="text.primary">Gestión de Servicios</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header con botón nuevo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Servicios Médicos
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNuevoServicio}
            startIcon={<Icon>add</Icon>}
          >
            Nuevo Servicio
          </Button>
        )}
      </Box>

      {/* Loader */}
      {loading && <PillLoader />}

      {/* Tabla */}
      <div className="table-responsive">
        <table ref={tableRef} className="display table table-striped table-hover" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Servicio</th>
              <th>Estado</th>
              <th>Precio</th>
              <th>Requiere Cita</th>
              <th>Sistema</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Modal para crear/editar */}
      <ThemedModal
        open={open}
        onClose={handleClose}
        title={editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre del Servicio"
              name="Nom_Serv"
              value={form.Nom_Serv}
              onChange={(e) => setForm({ ...form, Nom_Serv: e.target.value })}
              required
              fullWidth
            />
            
            <TextField
              label="Descripción"
              name="Descripcion"
              value={form.Descripcion}
              onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={form.Estado}
                  label="Estado"
                  onChange={(e) => setForm({ ...form, Estado: e.target.value })}
                >
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Sistema</InputLabel>
                <Select
                  value={form.Sistema}
                  label="Sistema"
                  onChange={(e) => setForm({ ...form, Sistema: e.target.value })}
                >
                  <MenuItem value="POS">POS</MenuItem>
                  <MenuItem value="HOSPITALARIO">Hospitalario</MenuItem>
                  <MenuItem value="AMBULATORIO">Ambulatorio</MenuItem>
                  <MenuItem value="URGENCIAS">Urgencias</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Precio Base"
              name="Precio_Base"
              type="number"
              value={form.Precio_Base}
              onChange={(e) => setForm({ ...form, Precio_Base: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.Requiere_Cita}
                  onChange={(e) => setForm({ ...form, Requiere_Cita: e.target.checked })}
                />
              }
              label="Requiere Cita Previa"
            />

            <TextField
              label="Organización"
              name="ID_H_O_D"
              value={form.ID_H_O_D}
              onChange={(e) => setForm({ ...form, ID_H_O_D: e.target.value })}
              required
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingServicio ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </ThemedModal>
    </div>
  );
};

export default ServiciosTable; 