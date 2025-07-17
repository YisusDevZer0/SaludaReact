import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import BaseModal from "./BaseModal";

const FormModal = ({
  open,
  onClose,
  title,
  titleIcon,
  fields = [],
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  success = null,
  maxWidth = "md",
  validationSchema = null,
  submitButtonText = "Guardar",
  cancelButtonText = "Cancelar",
  showCancelButton = true,
  showSuccessMessage = true,
  showErrorMessage = true,
  autoFocus = true,
  ...modalProps
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData, open]);

  const validateField = (name, value) => {
    if (!validationSchema) return "";
    
    try {
      validationSchema.validateSyncAt(name, { [name]: value });
      return "";
    } catch (error) {
      return error.message;
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validación en tiempo real
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    if (!validationSchema) return true;

    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  };

  const renderField = (field) => {
    const {
      name,
      label,
      type = "text",
      required = false,
      disabled = false,
      options = [],
      multiline = false,
      rows = 1,
      placeholder,
      helperText,
      startAdornment,
      endAdornment,
      gridProps = { xs: 12, sm: 6 },
      ...fieldProps
    } = field;

    const hasError = errors[name];
    const isTouched = touched[name];

    if (type === "select") {
      return (
        <Grid item {...gridProps} key={name}>
          <FormControl fullWidth error={!!hasError} disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select
              name={name}
              value={formData[name] || ""}
              onChange={(e) => handleChange(name, e.target.value)}
              onBlur={() => handleBlur(name)}
              label={label}
              startAdornment={startAdornment}
              endAdornment={endAdornment}
              {...fieldProps}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(hasError || helperText) && (
              <FormHelperText>
                {hasError || helperText}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      );
    }

    return (
      <Grid item {...gridProps} key={name}>
        <TextField
          fullWidth
          name={name}
          label={label}
          type={type}
          value={formData[name] || ""}
          onChange={(e) => handleChange(name, e.target.value)}
          onBlur={() => handleBlur(name)}
          required={required}
          disabled={disabled}
          multiline={multiline}
          rows={rows}
          placeholder={placeholder}
          error={!!hasError}
          helperText={hasError || helperText}
          InputProps={{
            startAdornment,
            endAdornment: hasError ? (
              <InputAdornment position="end">
                <ErrorIcon color="error" fontSize="small" />
              </InputAdornment>
            ) : isTouched && !hasError ? (
              <InputAdornment position="end">
                <CheckIcon color="success" fontSize="small" />
              </InputAdornment>
            ) : endAdornment,
          }}
          autoFocus={autoFocus && Object.keys(touched).length === 0}
          {...fieldProps}
        />
      </Grid>
    );
  };

  const actions = (
    <>
      {showCancelButton && (
        <MDButton
          onClick={onCancel || onClose}
          color="secondary"
          variant="outlined"
          disabled={loading}
        >
          {cancelButtonText}
        </MDButton>
      )}
      <MDButton
        onClick={handleSubmit}
        color="info"
        variant="gradient"
        disabled={loading || Object.keys(errors).some(key => errors[key])}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        {loading ? "Guardando..." : submitButtonText}
      </MDButton>
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      titleIcon={titleIcon}
      actions={actions}
      maxWidth={maxWidth}
      {...modalProps}
    >
      <MDBox>
        {/* Mensajes de estado */}
        {showErrorMessage && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {showSuccessMessage && success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Formulario */}
        <Grid container spacing={2}>
          {fields.map(renderField)}
        </Grid>

        {/* Resumen de errores */}
        {Object.keys(errors).length > 0 && (
          <Box mt={2}>
            <MDTypography variant="caption" color="error" display="flex" alignItems="center" gap={0.5}>
              <ErrorIcon fontSize="small" />
              Hay errores en el formulario
            </MDTypography>
          </Box>
        )}
      </MDBox>
    </BaseModal>
  );
};

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  titleIcon: PropTypes.node,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    options: PropTypes.array,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    startAdornment: PropTypes.node,
    endAdornment: PropTypes.node,
    gridProps: PropTypes.object,
  })).isRequired,
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  validationSchema: PropTypes.object,
  submitButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  showCancelButton: PropTypes.bool,
  showSuccessMessage: PropTypes.bool,
  showErrorMessage: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default FormModal; 