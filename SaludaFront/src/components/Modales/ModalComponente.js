import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Add as AddIcon } from "@mui/icons-material";
import FormModal from "./FormModal";
import { createComponente, updateComponente, validateComponenteData } from "services/componente-service";
import useNotifications from "hooks/useNotifications";

function ModalComponente({ show, onHide, componente, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { showNotification } = useNotifications();

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
      name: "Descripcion",
      label: "Descripción",
      type: "textarea",
      required: false,
      gridProps: { xs: 12 },
      placeholder: "Ingrese una descripción del componente",
      helperText: "Descripción opcional del componente"
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
      type: "select",
      required: true,
      options: [
        { value: "POS", label: "POS" },
        { value: "Farmacia", label: "Farmacia" },
        { value: "Laboratorio", label: "Laboratorio" }
      ],
      gridProps: { xs: 12, sm: 6 }
    }
  ];

  const initialData = {
    Nom_Com: "",
    Descripcion: "",
    Estado: "Vigente",
    Cod_Estado: "V",
    Sistema: "POS"
  };

  useEffect(() => {
    if (componente) {
      // Actualizar datos iniciales si hay un componente para editar
      const editData = {
        Nom_Com: componente.Nom_Com || "",
        Descripcion: componente.Descripcion || "",
        Estado: componente.Estado || "Vigente",
        Cod_Estado: componente.Cod_Estado || "V",
        Sistema: componente.Sistema || "POS"
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
      // Validar datos antes de enviar
      const validation = validateComponenteData(formData);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        setError(errorMessage);
        showNotification('error', errorMessage);
        return;
      }

      if (componente) {
        await updateComponente(componente.ID_Comp || componente.ID, formData);
        setSuccess("Componente actualizado exitosamente");
        showNotification('success', 'Componente actualizado exitosamente');
      } else {
        await createComponente(formData);
        setSuccess("Componente creado exitosamente");
        showNotification('success', 'Componente creado exitosamente');
      }
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onSave();
        onHide();
      }, 1500);
      
    } catch (error) {
      console.error("Error al guardar el componente:", error);
      const errorMessage = error.message || "Error al guardar el componente. Por favor, intente nuevamente.";
      setError(errorMessage);
      showNotification('error', errorMessage);
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
      show={show}
      onHide={handleClose}
      title={componente ? "Editar Componente" : "Nuevo Componente"}
      fields={fields}
      initialData={componente ? {
        Nom_Com: componente.Nom_Com || "",
        Descripcion: componente.Descripcion || "",
        Estado: componente.Estado || "Vigente",
        Cod_Estado: componente.Cod_Estado || "V",
        Sistema: componente.Sistema || "POS"
      } : initialData}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      submitText={componente ? "Actualizar" : "Crear"}
      submitIcon={<AddIcon />}
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