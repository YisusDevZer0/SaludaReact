import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import './SucursalesTable.css';
import PillLoader from './PillLoader';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import ModalNuevaSucursal from './Modales/ModalNuevaSucursal';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';

const SucursalesTable = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    creado_por: localStorage.getItem('userId') || '' // Ajusta según cómo guardes el usuario
  });

  // Obtener tipo de usuario de localStorage
  const userType = localStorage.getItem('userRole') || 'Usuario';

  // Inyectar CSS dinámico para header y texto de celdas
  useEffect(() => {
    const styleId = "datatable-sucursales-style";
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
      { data: "ID_SucursalC", title: "ID" },
      { data: "Nombre_Sucursal", title: "Nombre" },
      { data: "Direccion", title: "Dirección" },
      { data: "Telefono", title: "Teléfono" },
      { data: "Correo", title: "Correo" },
      {
        data: "Sucursal_Activa",
        title: "Activa",
        render: function (data) {
          if (data === true || data === 1 || data === "1") {
            return `<span class="material-icons" style="color:${sucursalesTable.activeIcon};font-size:1.5em;vertical-align:middle;">check_circle</span>`;
          } else {
            return `<span class="material-icons" style="color:${sucursalesTable.inactiveIcon};font-size:1.5em;vertical-align:middle;">cancel</span>`;
          }
        }
      },
      { data: "created_at", title: "Creado" },
      {
        data: null,
        title: "Acciones",
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `
            <button class="sucursal-action-btn editar" title="Editar"><span class="material-icons">edit</span></button>
            <button class="sucursal-action-btn eliminar" title="Eliminar"><span class="material-icons">delete</span></button>
          `;
        }
      }
    ];

    // Usar la configuración reutilizable con colores Pantone
    const config = getDataTablesConfig(
      "http://localhost:8000/api/sucursales",
      columns,
      {}, // opciones adicionales
      tableHeaderColor || "azulSereno", // color del header
      darkMode // modo oscuro
    );

    const table = $(tableRef.current).DataTable(config);

    table.on('xhr', function () {
      setLoading(false);
    });

    return () => {
      table.destroy(true);
    };
  }, [tableHeaderColor, darkMode]); // Recrear tabla cuando cambien los colores o modo

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/api/sucursales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nombre_Sucursal: form.nombre,
          Direccion: form.direccion,
          Telefono: form.telefono,
          Correo: form.correo,
          creado_por: form.creado_por
        })
      });
      setOpen(false);
      setForm({ nombre: '', direccion: '', telefono: '', correo: '', creado_por: form.creado_por });
      setLoading(true);
      // Recargar la tabla
      if (tableRef.current) {
        $(tableRef.current).DataTable().ajax.reload();
      }
    } catch (err) {
      alert('Error al crear sucursal');
    }
  };

  return (
    <div>
      <Box mb={3} mt={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" color="primary" />
            <Typography color="primary" fontWeight="bold">{userType}</Typography>
          </Box>
          <Typography color="text.primary" fontWeight="medium">Sucursales</Typography>
        </Breadcrumbs>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon>add</Icon>}
            onClick={handleOpen}
            sx={{ px: 2, py: 0.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', boxShadow: 2, color: '#fff', minWidth: 180, letterSpacing: 1 }}
          >
            NUEVA SUCURSAL
          </Button>
        </Box>
      </Box>
      <ModalNuevaSucursal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
      />
      {loading && <PillLoader message="Cargando sucursales..." />}
      <table ref={tableRef} className="display" style={{ width: "100%" }}></table>
    </div>
  );
};

export default SucursalesTable; 