import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";

const SucursalesTable = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;

  useEffect(() => {
    // Configuración de columnas
    const columns = [
      { data: "ID_SucursalC", title: "ID" },
      { data: "Nombre_Sucursal", title: "Nombre" },
      { data: "Direccion", title: "Dirección" },
      { data: "Telefono", title: "Teléfono" },
      { data: "Correo", title: "Correo" },
      { data: "Sucursal_Activa", title: "Activa" },
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