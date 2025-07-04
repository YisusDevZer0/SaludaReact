import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import './SucursalesTable.css'; // Reutilizar estilos base
import './PresentacionesTable.css'; // Estilos específicos de presentaciones
import PillLoader from './PillLoader';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import Chip from '@mui/material/Chip';
import PresentacionService from 'services/presentacion-service';

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
      const response = await PresentacionService.getPresentacion(id);
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
      alert('Error al cargar la presentación para editar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta presentación?')) {
      try {
        const response = await PresentacionService.eliminarPresentacion(id);
        if (response.success) {
          alert('Presentación eliminada exitosamente');
          // Recargar la tabla
          if (tableRef.current) {
            $(tableRef.current).DataTable().ajax.reload();
          }
        } else {
          alert('Error al eliminar la presentación');
        }
      } catch (error) {
        console.error('Error al eliminar presentación:', error);
        alert('Error al eliminar la presentación');
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
        response = await PresentacionService.actualizarPresentacion(editingPresentacion.Pprod_ID, form);
      } else {
        // Crear
        response = await PresentacionService.crearPresentacion(form);
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
        alert(editingPresentacion ? 'Presentación actualizada exitosamente' : 'Presentación creada exitosamente');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al procesar la presentación');
    }
  };

  return (
    <div>
      <Box mb={3} mt={2} className="presentacion-breadcrumb">
        <Breadcrumbs aria-label="breadcrumb">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" color="primary" />
            <Typography color="primary" fontWeight="bold">{userType}</Typography>
          </Box>
          <Typography color="text.primary" fontWeight="medium">Presentaciones POS</Typography>
        </Breadcrumbs>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon>add</Icon>}
            onClick={handleOpen}
            className="nueva-presentacion-btn"
            sx={{ px: 2, py: 0.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', boxShadow: 2, color: '#fff', minWidth: 180, letterSpacing: 1 }}
          >
            NUEVA PRESENTACIÓN
          </Button>
        </Box>
      </Box>

      {/* Modal para crear/editar presentación */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth className="presentacion-modal">
        <DialogTitle>
          {editingPresentacion ? 'Editar Presentación' : 'Nueva Presentación'}
        </DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingPresentacion ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {loading && <PillLoader message="Cargando presentaciones..." />}
      <table ref={tableRef} className="display" style={{ width: "100%" }}></table>
    </div>
  );
};

export default PresentacionesTable; 