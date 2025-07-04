import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { createComponente, updateComponente } from "services/componente-service";

function ModalComponente({ show, onHide, componente, onSave }) {
  const [formData, setFormData] = useState({
    Nom_Com: "",
    Estado: "Vigente",
    Cod_Estado: "V",
    Sistema: "POS",
    Organizacion: "Saluda",
  });

  useEffect(() => {
    if (componente) {
      setFormData({
        Nom_Com: componente.Nom_Com || "",
        Estado: componente.Estado || "Vigente",
        Cod_Estado: componente.Cod_Estado || "V",
        Sistema: componente.Sistema || "POS",
        Organizacion: componente.Organizacion || "Saluda",
      });
    }
  }, [componente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (componente) {
        await updateComponente(componente.ID_Comp, formData);
      } else {
        await createComponente(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error al guardar el componente:", error);
    }
  };

  return (
    <Dialog 
      open={show} 
      onClose={onHide}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <MDTypography variant="h6" color="primary">
          {componente ? "Editar Componente" : "Nuevo Componente"}
        </MDTypography>
      </DialogTitle>
      <DialogContent>
        <MDBox p={2}>
          <MDBox mb={2}>
            <TextField
              fullWidth
              label="Nombre del Componente"
              name="Nom_Com"
              value={formData.Nom_Com}
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="Estado"
                value={formData.Estado}
                onChange={handleChange}
                label="Estado"
              >
                <MenuItem value="Vigente">Vigente</MenuItem>
                <MenuItem value="Descontinuado">Descontinuado</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
          <MDBox mb={2}>
            <FormControl fullWidth>
              <InputLabel>Código Estado</InputLabel>
              <Select
                name="Cod_Estado"
                value={formData.Cod_Estado}
                onChange={handleChange}
                label="Código Estado"
              >
                <MenuItem value="V">V - Vigente</MenuItem>
                <MenuItem value="D">D - Descontinuado</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
          <MDBox mb={2}>
            <TextField
              fullWidth
              label="Sistema"
              name="Sistema"
              value={formData.Sistema}
              onChange={handleChange}
              disabled
            />
          </MDBox>
          <MDBox mb={2}>
            <TextField
              fullWidth
              label="Organización"
              name="Organizacion"
              value={formData.Organizacion}
              onChange={handleChange}
              disabled
            />
          </MDBox>
        </MDBox>
      </DialogContent>
      <DialogActions>
        <MDButton onClick={onHide} color="secondary">
          Cancelar
        </MDButton>
        <MDButton onClick={handleSubmit} color="info">
          {componente ? "Actualizar" : "Guardar"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

ModalComponente.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  componente: PropTypes.object,
  onSave: PropTypes.func.isRequired
};

export default ModalComponente; 