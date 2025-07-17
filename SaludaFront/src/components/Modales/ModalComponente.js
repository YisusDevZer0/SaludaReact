import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Add as AddIcon } from "@mui/icons-material";
import FormModal from "./FormModal";
import { createComponente, updateComponente } from "services/componente-service";

function ModalComponente({ show, onHide, componente, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fields = [
    {
      name: "Nom_Com",
      label: "Nombre del Componente",
      type: "text",
      required: true,
      gridProps: { xs: 12 },
      placeholder: "Ingrese el nombre del componente",
      helperText: "El nombre debe ser único y descriptivo"
    },
    {
      name: "Estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "Vigente", label: "Vigente" },
        { value: "Descontinuado", label: "Descontinuado" }
      ],
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: "Cod_Estado",
      label: "Código Estado",
      type: "select",
      required: true,
      options: [
        { value: "V", label: "V - Vigente" },
        { value: "D", label: "D - Descontinuado" }
      ],
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: "Sistema",
      label: "Sistema",
      type: "text",
      disabled: true,
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: "Organizacion",
      label: "Organización",
      type: "text",
      disabled: true,
      gridProps: { xs: 12, sm: 6 }
    }
  ];

  const initialData = {
    Nom_Com: "",
    Estado: "Vigente",
    Cod_Estado: "V",
    Sistema: "POS",
    Organizacion: "Saluda",
  };

  useEffect(() => {
    if (componente) {
      // Actualizar datos iniciales si hay un componente para editar
      const editData = {
        Nom_Com: componente.Nom_Com || "",
        Estado: componente.Estado || "Vigente",
        Cod_Estado: componente.Cod_Estado || "V",
        Sistema: componente.Sistema || "POS",
        Organizacion: componente.Organizacion || "Saluda",
      };
      return editData;
    }
    return initialData;
  }, [componente]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (componente) {
        await updateComponente(componente.ID_Comp, formData);
        setSuccess("Componente actualizado exitosamente");
      } else {
        await createComponente(formData);
        setSuccess("Componente creado exitosamente");
      }
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onSave();
        onHide();
      }, 1500);
      
    } catch (error) {
      console.error("Error al guardar el componente:", error);
      setError("Error al guardar el componente. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onHide();
  };

  return (
    <FormModal
      open={show}
      onClose={handleClose}
      title={componente ? "Editar Componente" : "Nuevo Componente"}
      titleIcon={<AddIcon />}
      fields={fields}
      initialData={componente ? {
        Nom_Com: componente.Nom_Com || "",
        Estado: componente.Estado || "Vigente",
        Cod_Estado: componente.Cod_Estado || "V",
        Sistema: componente.Sistema || "POS",
        Organizacion: componente.Organizacion || "Saluda",
      } : initialData}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      submitButtonText={componente ? "Actualizar" : "Crear"}
      maxWidth="md"
      className="form-modal"
    />
  );
}

ModalComponente.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  componente: PropTypes.object,
  onSave: PropTypes.func.isRequired
};

export default ModalComponente; 