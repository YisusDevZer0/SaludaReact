import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import './PresentacionesTable.css';
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
import presentacionService from 'services/presentacion-service';
import notificationService from 'services/notification-service';

const PresentacionesTable = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors(); // Reutilizar colores
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingPresentacion, setEditingPresentacion] = useState(null);
  const [form, setForm] = useState({
    Nom_Presentacion: '',
    Siglas: '',
    Estado: 'Vigente',
    Cod_Estado: 'V',
    Sistema: 'POS',
    ID_H_O_D: 'Saluda'
  });

  // Obtener tipo de usuario de localStorage
  const userType = localStorage.getItem('userRole') || 'Usuario';

  // Inyectar CSS dinámico para header y texto de celdas
  useEffect(() => {
    const styleId = "datatable-presentaciones-style";
    let styleTag = document.getElementById(styleId);
    if (styleTag) styleTag.remove();
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.innerHTML = `
      table.dataTable thead th {
        background-color: ${sucursalesTable.header} !important;
        color: ${sucursalesTable.headerText} !important;
      }
      table.dataTable tbody td {
        color: ${sucursalesTable.cellText} !important;
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      if (styleTag) styleTag.remove();
    };
  }, [sucursalesTable.header, sucursalesTable.headerText, sucursalesTable.cellText]);

  useEffect(() => {
    setLoading(true);
    // Asegurar que Material Icons esté en el documento
    const materialIconsId = 'material-icons-cdn';
    if (!document.getElementById(materialIconsId)) {
      const link = document.createElement('link');
      link.id = materialIconsId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      document.head.appendChild(link);
    }

    // Configuración de columnas
    const columns = [
      { data: "Pprod_ID", title: "ID" },
      { data: "Nom_Presentacion", title: "Nombre de Presentación" },
      { data: "Siglas", title: "Siglas" },
      { 
        data: "Estado", 
        title: "Estado",
        render: function (data) {
          const isActive = data === 'Vigente' || data === 'V';
          return `<span class="material-icons" style="color:${isActive ? sucursalesTable.activeIcon : sucursalesTable.inactiveIcon};font-size:1.5em;vertical-align:middle;">${isActive ? 'check_circle' : 'cancel'}</span> ${data}`;
        }
      },
      { data: "Cod_Estado", title: "Código Estado" },
      { data: "Sistema", title: "Sistema" },
      { data: "ID_H_O_D", title: "Organización" },
      { data: "Agregadoel", title: "Creado" },
      {
        data: null,
        title: "Acciones",
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `
            <button class="presentacion-action-btn editar" title="Editar" data-id="${row.Pprod_ID}"><span class="material-icons">edit</span></button>
            <button class="presentacion-action-btn eliminar" title="Eliminar" data-id="${row.Pprod_ID}"><span class="material-icons">delete</span></button>
          `;
        }
      }
    ];

    // Usar la configuración reutilizable con colores Pantone
    const config = getDataTablesConfig(
      "http://localhost:8000/api/presentaciones",
      columns,
      {}, // opciones adicionales
      tableHeaderColor || "azulSereno", // color del header
      darkMode // modo oscuro
    );

    const table = $(tableRef.current).DataTable(config);

    table.on('xhr', function () {
      setLoading(false);
    });

    // Manejar eventos de botones de acción
    $(tableRef.current).on('click', '.presentacion-action-btn.editar', function() {
      const id = $(this).data('id');
      handleEdit(id);
    });

    $(tableRef.current).on('click', '.presentacion-action-btn.eliminar', function() {
      const id = $(this).data('id');
      handleDelete(id);
    });

    return () => {
      table.destroy(true);
    };
  }, [tableHeaderColor, darkMode]); // Recrear tabla cuando cambien los colores o modo

  const handleOpen = () => {
    setEditingPresentacion(null);
    setForm({
      Nom_Presentacion: '',
      Siglas: '',
      Estado: 'Vigente',
      Cod_Estado: 'V',
      Sistema: 'POS',
      ID_H_O_D: 'Saluda'
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = async (id) => {
    try {
      const response = await presentacionService.getPresentacion(id);
      if (response.success) {
        setEditingPresentacion(response.data);
        setForm({
          Nom_Presentacion: response.data.Nom_Presentacion,
          Siglas: response.data.Siglas,
          Estado: response.data.Estado,
          Cod_Estado: response.data.Cod_Estado,
          Sistema: response.data.Sistema,
          ID_H_O_D: response.data.ID_H_O_D
        });
        setOpen(true);
      }
    } catch (error) {
      console.error('Error al obtener presentación:', error);
      notificationService.error('Error al cargar la presentación para editar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta presentación?')) {
      try {
        const response = await presentacionService.eliminarPresentacion(id);
        if (response.success) {
          notificationService.success('Presentación eliminada exitosamente');
          // Recargar la tabla
          if (tableRef.current) {
            $(tableRef.current).DataTable().ajax.reload();
          }
        } else {
          notificationService.error('Error al eliminar la presentación');
        }
      } catch (error) {
        console.error('Error al eliminar presentación:', error);
        notificationService.error('Error al eliminar la presentación');
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingPresentacion) {
        // Actualizar
        response = await presentacionService.actualizarPresentacion(editingPresentacion.Pprod_ID, form);
      } else {
        // Crear
        response = await presentacionService.crearPresentacion(form);
      }

      if (response.success) {
        setOpen(false);
        setForm({
          Nom_Presentacion: '',
          Siglas: '',
          Estado: 'Vigente',
          Cod_Estado: 'V',
          Sistema: 'POS',
          ID_H_O_D: 'Saluda'
        });
        setEditingPresentacion(null);
        // Recargar la tabla
        if (tableRef.current) {
          $(tableRef.current).DataTable().ajax.reload();
        }
        notificationService.success(editingPresentacion ? 'Presentación actualizada exitosamente' : 'Presentación creada exitosamente');
      } else {
        // Mostrar errores de validación si existen
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(', ');
          notificationService.error(`Error de validación: ${errorMessages}`);
        } else {
          notificationService.error(`Error: ${response.message}`);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      notificationService.error('Error al procesar la presentación');
    }
  };

  return (
    <div>
      <Box mb={3} mt={2} className="categoria-breadcrumb">
        <Breadcrumbs aria-label="breadcrumb">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" color="primary" />
            <Typography color="primary" fontWeight="bold">{userType}</Typography>
          </Box>
          <Typography color="text.primary" fontWeight="medium">Presentaciones POS</Typography>
        </Breadcrumbs>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Button
            className="nueva-categoria-btn"
            startIcon={<Icon>add</Icon>}
            onClick={handleOpen}
            sx={{ px: 2, py: 0.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', minWidth: 180, letterSpacing: 1 }}
          >
            NUEVA PRESENTACIÓN
          </Button>
        </Box>
      </Box>

      {/* Modal para crear/editar presentación */}
      <ThemedModal
        open={open}
        onClose={handleClose}
        title={editingPresentacion ? 'Editar Presentación' : 'Nueva Presentación'}
        maxWidth="sm"
        fullWidth
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} className="presentacion-form">
          <TextField
            name="Nom_Presentacion"
            label="Nombre de Presentación"
            value={form.Nom_Presentacion}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            name="Siglas"
            label="Siglas"
            value={form.Siglas}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="Estado"
            label="Estado"
            value={form.Estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value="Vigente">Vigente</option>
            <option value="Inactivo">Inactivo</option>
          </TextField>
          <TextField
            name="Cod_Estado"
            label="Código de Estado"
            value={form.Cod_Estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value="V">V (Vigente)</option>
            <option value="I">I (Inactivo)</option>
          </TextField>
          <TextField
            name="Sistema"
            label="Sistema"
            value={form.Sistema}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value="POS">POS</option>
            <option value="SALUD">SALUD</option>
          </TextField>
          <TextField
            name="ID_H_O_D"
            label="Organización"
            value={form.ID_H_O_D}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingPresentacion ? 'Actualizar' : 'Crear'}
          </Button>
        </Box>
      </ThemedModal>

      {loading && <PillLoader message="Cargando presentaciones..." />}
      <table ref={tableRef} className="display" style={{ width: "100%" }}></table>
    </div>
  );
};

export default PresentacionesTable; 