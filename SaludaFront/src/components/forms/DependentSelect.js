import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography } from '@mui/material';

/**
 * DependentSelect - Reusable select component for dependent dropdowns with loading and error states.
 *
 * Props:
 * - label: string (Label for the select)
 * - value: selected value
 * - onChange: function (event) => void
 * - options: array of { value, label } for menu items
 * - loading: boolean (show spinner)
 * - error: string (error message)
 * - disabled: boolean
 * - required: boolean
 * - helperText: string
 * - name: string (optional, for form)
 */
const DependentSelect = ({
  label,
  value,
  onChange,
  options = [],
  loading = false,
  error = '',
  disabled = false,
  required = false,
  helperText = '',
  name = '',
}) => (
  <FormControl fullWidth error={!!error} disabled={disabled || loading} required={required} sx={{ mb: 2 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value || ''}
      onChange={onChange}
      label={label}
      name={name}
      MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
    >
      {loading ? (
        <MenuItem disabled>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          Cargando opciones...
        </MenuItem>
      ) : options.length > 0 ? (
        options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))
      ) : (
        <MenuItem disabled>No hay opciones disponibles</MenuItem>
      )}
    </Select>
    {error ? (
      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{error}</Typography>
    ) : helperText ? (
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>{helperText}</Typography>
    ) : null}
  </FormControl>
);

export default DependentSelect;
