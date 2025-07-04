import React, { useEffect, useRef, useState, useCallback } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import './SucursalesTable.css';
import './ComponentesTable.css';
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
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import ModalComponente from "./Modales/ModalComponente";
import { getComponentes, deleteComponente } from "services/componente-service";
import { dataTablesLanguage } from "utils/dataTablesLanguage";
import { getDataTablesSpanishLanguage } from "utils/dataTablesLanguage";

const ComponentesTable = () => {
  const tableRef = useRef(null);
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingComponente, setEditingComponente] = useState(null);
  const [form, setForm] = useState({
    Nom_Com: '',
    Descripcion: '',
    Estado: 'Vigente',
    Cod_Estado: 'V',
    Sistema: 'POS',
    ID_H_O_D: 'Saluda'
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedComponente, setSelectedComponente] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [componentes, setComponentes] = useState([]);
  const [dataTable, setDataTable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener tipo de usuario de localStorage
  const userType = localStorage.getItem('userRole') || 'Usuario';

  // Inyectar CSS dinámico para header y texto de celdas
  useEffect(() => {
    const styleId = "datatable-componentes-style";
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
    let dataTable = null;

    const initializeDataTable = async () => {
      try {
        setIsLoading(true);
        const response = await getComponentes();
        
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }

        dataTable = $(tableRef.current).DataTable({
          data: response.data || [],
          columns: [
            { data: "ID_Comp" },
            { data: "Nom_Com" },
            { 
              data: "Estado",
              render: function(data) {
                return data === "Vigente" 
                  ? '<span class="estado-vigente"><i class="fas fa-check-circle"></i></span>'
                  : '<span class="estado-descontinuado"><i class="fas fa-times-circle"></i></span>';
              }
            },
            { data: "Cod_Estado" },
            { data: "Sistema" },
            { data: "Organizacion" },
            { 
              data: "Agregadoel",
              render: function(data) {
                return data ? new Date(data).toLocaleDateString() : '';
              }
            },
            {
              data: null,
              orderable: false,
              render: function(data) {
                return `
                  <button class="edit-button" data-id="${data.ID_Comp}">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="delete-button" data-id="${data.ID_Comp}">
                    <i class="fas fa-trash"></i>
                  </button>
                `;
              }
            }
          ],
          language: getDataTablesSpanishLanguage(),
          order: [[0, "desc"]],
          responsive: true,
          destroy: true
        });

        // Event handlers
        $(tableRef.current).on("click", ".edit-button", function() {
          const rowData = dataTable.row($(this).closest("tr")).data();
          setSelectedComponente(rowData);
          setShowModal(true);
        });

        $(tableRef.current).on("click", ".delete-button", async function() {
          const rowData = dataTable.row($(this).closest("tr")).data();
          if (window.confirm("¿Estás seguro de que deseas eliminar este componente?")) {
            try {
              await deleteComponente(rowData.ID_Comp);
              setRefresh(prev => !prev);
            } catch (error) {
              console.error("Error al eliminar el componente:", error);
              alert("Error al eliminar el componente");
            }
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los componentes:", error);
        setIsLoading(false);
      }
    };

    initializeDataTable();

    return () => {
      if (dataTable) {
        dataTable.destroy();
      }
      if (tableRef.current) {
        $(tableRef.current).off("click", ".edit-button");
        $(tableRef.current).off("click", ".delete-button");
      }
    };
  }, [refresh]);

  const handleOpen = () => {
    setEditingComponente(null);
    setForm({
      Nom_Com: '',
      Descripcion: '',
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
      const response = await getComponentes(id);
      if (response.success) {
        setEditingComponente(response.data);
        setForm({
          Nom_Com: response.data.Nom_Com,
          Descripcion: response.data.Descripcion,
          Estado: response.data.Estado,
          Cod_Estado: response.data.Cod_Estado,
          Sistema: response.data.Sistema,
          ID_H_O_D: response.data.ID_H_O_D
        });
        setOpen(true);
      }
    } catch (error) {
      console.error('Error al obtener componente:', error);
      alert('Error al cargar el componente para editar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este componente?')) {
      try {
        const response = await deleteComponente(id);
        if (response.success) {
          alert('Componente eliminado exitosamente');
          // Recargar la tabla
          if (tableRef.current) {
            $(tableRef.current).DataTable().ajax.reload();
          }
        } else {
          alert('Error al eliminar el componente');
        }
      } catch (error) {
        console.error('Error al eliminar componente:', error);
        alert('Error al eliminar el componente');
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
      if (editingComponente) {
        // Actualizar
        response = await getComponentes(editingComponente.ID, form);
      } else {
        // Crear
        response = await getComponentes(form);
      }

      if (response.success) {
        setOpen(false);
        setForm({
          Nom_Com: '',
          Descripcion: '',
          Estado: 'Vigente',
          Cod_Estado: 'V',
          Sistema: 'POS',
          ID_H_O_D: 'Saluda'
        });
        setEditingComponente(null);
        // Recargar la tabla
        if (tableRef.current) {
          $(tableRef.current).DataTable().ajax.reload();
        }
        alert(editingComponente ? 'Componente actualizado exitosamente' : 'Componente creado exitosamente');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al procesar el componente');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedComponente(null);
  };

  const handleModalSave = () => {
    setShowModal(false);
    setSelectedComponente(null);
    setRefresh(prev => !prev);
  };

  return (
    <div>
      <Box mb={3} mt={2} className="componente-breadcrumb">
        <Breadcrumbs aria-label="breadcrumb">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" color="primary" />
            <Typography color="primary" fontWeight="bold">{userType}</Typography>
          </Box>
          <Typography color="text.primary" fontWeight="medium">Componentes Activos</Typography>
        </Breadcrumbs>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <MDButton 
            variant="gradient" 
            color="info"
            onClick={() => {
              setSelectedComponente(null);
              setShowModal(true);
            }}
          >
            <Icon>add</Icon>&nbsp;
            NUEVO COMPONENTE
          </MDButton>
        </Box>
      </Box>

      {/* Modal para crear/editar componente */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth className="componente-modal">
        <DialogTitle>
          {editingComponente ? 'Editar Componente' : 'Nuevo Componente'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} className="componente-form">
            <TextField
              name="Nom_Com"
              label="Nombre del Componente"
              value={form.Nom_Com}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="Descripcion"
              label="Descripción"
              value={form.Descripcion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
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
              <option value="Farmacia">Farmacia</option>
              <option value="Laboratorio">Laboratorio</option>
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
            {editingComponente ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {isLoading && <PillLoader message="Cargando componentes..." />}
      <div className="table-responsive">
        <table ref={tableRef} className="display" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Componente</th>
              <th>Estado</th>
              <th>Código Estado</th>
              <th>Sistema</th>
              <th>Organización</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
        </table>
      </div>

      {showModal && (
        <ModalComponente
          show={showModal}
          onHide={handleModalClose}
          componente={selectedComponente}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default ComponentesTable; 