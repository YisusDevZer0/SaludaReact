import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import './CategoriasTable.css'; // Reutilizar estilos base
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
import tipoService from 'services/tipo-service';
import MDAlert from "components/MDAlert";
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Zoom';

const TiposTable = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState(null);
  const [form, setForm] = useState({
    Nom_Tipo_Prod: '',
    Estado: 'Activo',
    Cod_Estado: 'A',
    Sistema: 'POS',
    ID_H_O_D: 'Saluda',
    Agregado_Por: localStorage.getItem('userName') || ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Obtener tipo de usuario de localStorage
  const userType = localStorage.getItem('userRole') || 'Usuario';

  // Inyectar CSS dinámico para header y texto de celdas
  useEffect(() => {
    const styleId = "datatable-tipos-style";
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
      { data: "Tip_Prod_ID", title: "ID" },
      { data: "Nom_Tipo_Prod", title: "Nombre de Tipo" },
      {
        data: "Estado",
        title: "Estado",
        render: function (data) {
          const isActive = data === 'Activo' || data === 'A';
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
            <button class="categoria-action-btn editar" title="Editar" data-id="${row.Tip_Prod_ID}"><span class="material-icons">edit</span></button>
            <button class="categoria-action-btn eliminar" title="Eliminar" data-id="${row.Tip_Prod_ID}"><span class="material-icons">delete</span></button>
          `;
        }
      }
    ];

    // Configuración DataTables
    const config = getDataTablesConfig(
      "http://localhost:8000/api/tipos",
      columns,
      {},
      tableHeaderColor || "azulSereno",
      darkMode
    );

    const table = $(tableRef.current).DataTable(config);

    table.on('xhr', function () {
      setLoading(false);
    });

    // Manejar eventos de botones de acción
    $(tableRef.current).on('click', '.categoria-action-btn.editar', function() {
      const id = $(this).data('id');
      handleEdit(id);
    });

    $(tableRef.current).on('click', '.categoria-action-btn.eliminar', function() {
      const id = $(this).data('id');
      handleDelete(id);
    });

    return () => {
      table.destroy(true);
    };
  }, [tableHeaderColor, darkMode]);

  const handleOpen = () => {
    setEditingTipo(null);
    setForm({
      Nom_Tipo_Prod: '',
      Estado: 'Activo',
      Cod_Estado: 'A',
      Sistema: 'POS',
      ID_H_O_D: 'Saluda',
      Agregado_Por: localStorage.getItem('userName') || ''
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = async (id) => {
    try {
      const tipo = await tipoService.getTipos();
      const found = tipo.find(t => t.Tip_Prod_ID === id);
      if (found) {
        setEditingTipo(found);
        setForm({
          Nom_Tipo_Prod: found.Nom_Tipo_Prod,
          Estado: found.Estado,
          Cod_Estado: found.Cod_Estado,
          Sistema: found.Sistema,
          ID_H_O_D: found.ID_H_O_D,
          Agregado_Por: found.Agregado_Por
        });
        setOpen(true);
      }
    } catch (error) {
      showSnackbar('Error al cargar el tipo para editar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo?')) {
      try {
        await tipoService.deleteTipo(id);
        if (tableRef.current) {
          $(tableRef.current).DataTable().ajax.reload();
        }
        showSnackbar('Tipo eliminado exitosamente', 'success');
      } catch (error) {
        showSnackbar('Error al eliminar el tipo', 'error');
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const allowedSeverities = ['success', 'error', 'warning', 'info'];
  const showSnackbar = (message, severity = 'success') => {
    const validSeverity = allowedSeverities.includes(severity) ? severity : 'success';
    setSnackbar({ open: true, message, severity: validSeverity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userName = localStorage.getItem('userName') || 'Desconocido';
      if (editingTipo) {
        const data = { ...form, Agregado_Por: userName };
        await tipoService.updateTipo(editingTipo.Tip_Prod_ID, data);
        showSnackbar('Tipo actualizado exitosamente', 'success');
      } else {
        const data = { ...form, Agregado_Por: userName };
        await tipoService.createTipo(data);
        showSnackbar('Tipo creado exitosamente', 'success');
      }
      setOpen(false);
      setForm({
        Nom_Tipo_Prod: '',
        Estado: 'Activo',
        Cod_Estado: 'A',
        Sistema: 'POS',
        ID_H_O_D: 'Saluda',
        Agregado_Por: userName
      });
      setEditingTipo(null);
      if (tableRef.current) {
        $(tableRef.current).DataTable().ajax.reload();
      }
    } catch (err) {
      showSnackbar('Error al procesar el tipo', 'error');
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
          <Typography color="text.primary" fontWeight="medium">Tipos de Productos</Typography>
        </Breadcrumbs>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon>add</Icon>}
            onClick={handleOpen}
            className="nueva-categoria-btn"
            sx={{ px: 2, py: 0.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', boxShadow: 2, color: '#fff', minWidth: 180, letterSpacing: 1 }}
          >
            NUEVO TIPO
          </Button>
        </Box>
      </Box>

      {/* Modal para crear/editar tipo */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth className="categoria-modal">
        <DialogTitle>
          {editingTipo ? 'Editar Tipo' : 'Nuevo Tipo'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} className="categoria-form">
            <TextField
              name="Nom_Tipo_Prod"
              label="Nombre de Tipo"
              value={form.Nom_Tipo_Prod}
              onChange={handleChange}
              fullWidth
              required
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
              style={{ display: 'none' }}
            >
              <option value="Activo">Activo</option>
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
              style={{ display: 'none' }}
            >
              <option value="A">A (Activo)</option>
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
            <input type="hidden" name="Agregado_Por" value={form.Agregado_Por} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingTipo ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {loading && <PillLoader message="Cargando tipos..." />}
      <table ref={tableRef} className="display" style={{ width: "100%" }}></table>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Zoom}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity || 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TiposTable; 