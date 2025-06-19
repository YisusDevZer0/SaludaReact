import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import PillLoader from "components/PillLoader";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Button from '@mui/material/Button';
import ModalNuevoPersonal from './ModalNuevoPersonal';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';

const RHControlPersonal = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  // Inyectar CSS dinámico para header y texto de celdas
  useEffect(() => {
    const styleId = "datatable-personal-style";
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
      {
        data: "avatar_url",
        title: "Foto",
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          const nombre = row.Nombre_Apellidos || '';
          const avatar = data && data.trim() !== ''
            ? `<img src="${data}" alt="avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" />`
            : `<img src='https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=1976d2&color=fff&size=32&rounded=true' alt='avatar' style='width:32px;height:32px;border-radius:50%;object-fit:cover;' />`;
          return avatar;
        }
      },
      { data: "Nombre_Apellidos", title: "Nombre" },
      { data: "Correo_Electronico", title: "Correo" },
      { data: "Telefono", title: "Teléfono" },
      { data: "Nombre_rol", title: "Rol" },
      { data: "Nombre_Sucursal", title: "Sucursal" },
      { data: "Estatus", title: "Estatus" },
      {
        data: null,
        title: "Acciones",
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `
            <button class="personal-action-btn editar" title="Editar" style="background:transparent;border:none;cursor:pointer;padding:2px 6px;margin-right:2px;color:#1976d2;"><span class="material-icons" style="font-size:20px;vertical-align:middle;">edit</span></button>
            <button class="personal-action-btn eliminar" title="Eliminar" style="background:transparent;border:none;cursor:pointer;padding:2px 6px;color:#d32f2f;"><span class="material-icons" style="font-size:20px;vertical-align:middle;">delete</span></button>
          `;
        }
      }
    ];

    // Usar la configuración reutilizable con colores Pantone
    const config = getDataTablesConfig(
      "http://localhost:8000/api/personal/listado",
      columns,
      {},
      tableHeaderColor || "azulSereno",
      darkMode
    );

    const table = $(tableRef.current).DataTable(config);

    table.on('xhr', function () {
      setLoading(false);
    });

    return () => {
      table.destroy(true);
    };
  }, [tableHeaderColor, darkMode]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleSuccess = () => {
    if (tableRef.current) {
      $(tableRef.current).DataTable().ajax.reload();
    }
    setOpenModal(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Card sx={{ p: 3 }}>
          <MDTypography variant="h4" color="info" fontWeight="bold" gutterBottom>
            Control de Personal RH
          </MDTypography>
          <MDTypography variant="body1" color="text" mb={2}>
            Consulta y gestiona el personal registrado en el sistema, junto con su sucursal y rol.
          </MDTypography>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ minWidth: 180, px: 2, py: 0.5, fontWeight: 'bold', fontSize: '1rem', borderRadius: 2, boxShadow: 2, color: '#fff', letterSpacing: 1 }}
              size="small"
              onClick={handleOpenModal}
            >
              NUEVO PERSONAL
            </Button>
          </div>
          {loading && <PillLoader message="Cargando personal..." />}
          <div style={{ width: '100%', minHeight: 500 }}>
            <table ref={tableRef} className="display" style={{ width: "100%" }}></table>
          </div>
          <ModalNuevoPersonal open={openModal} onClose={handleCloseModal} onSuccess={handleSuccess} />
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};

export default RHControlPersonal; 