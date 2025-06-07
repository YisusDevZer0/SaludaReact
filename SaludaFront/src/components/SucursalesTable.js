import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";

const SucursalesTable = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();

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
            return `<span style="color:${sucursalesTable.activeIcon};font-size:1.5em;">&#10003;</span>`;
          } else {
            return `<span style="color:${sucursalesTable.inactiveIcon};font-size:1.5em;">&#10007;</span>`;
          }
        }
      },
      { data: "created_at", title: "Creado" }
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

    return () => {
      table.destroy(true);
    };
  }, [tableHeaderColor, darkMode]); // Recrear tabla cuando cambien los colores o modo

  return (
    <div>
      <table ref={tableRef} className="display" style={{ width: "100%" }}></table>
    </div>
  );
};

export default SucursalesTable; 