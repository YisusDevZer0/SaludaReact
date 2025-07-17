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
  Chip,
  Button,
  IconButton,
  Divider,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  InputAdornment,
  Collapse,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Search as SearchIcon,
  DateRange as DateIcon,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import BaseModal from "./BaseModal";

const FiltersModal = ({
  open,
  onClose,
  filters = [],
  initialFilters = {},
  onApply,
  onClear,
  title = "Filtros",
  showClearButton = true,
  showApplyButton = true,
  maxWidth = "md",
  enableAdvancedFilters = false,
  ...modalProps
}) => {
  const [filterData, setFilterData] = useState(initialFilters);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    setFilterData(initialFilters);
    updateActiveFiltersCount(initialFilters);
  }, [initialFilters, open]);

  const updateActiveFiltersCount = (filters) => {
    const count = Object.values(filters).filter(value => 
      value !== "" && value !== null && value !== undefined && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    setActiveFilters(count);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filterData,
      [name]: value
    };
    setFilterData(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    filters.forEach(filter => {
      clearedFilters[filter.name] = filter.type === "range" ? [filter.min, filter.max] : "";
    });
    setFilterData(clearedFilters);
    updateActiveFiltersCount(clearedFilters);
  };

  const handleApplyFilters = () => {
    onApply(filterData);
    onClose();
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const renderFilterField = (filter) => {
    const {
      name,
      label,
      type = "text",
      options = [],
      placeholder,
      helperText,
      min,
      max,
      step = 1,
      marks,
      multiple = false,
      gridProps = { xs: 12, sm: 6 },
      section,
      ...fieldProps
    } = filter;

    const value = filterData[name] || (type === "range" ? [min, max] : "");
    const isExpanded = section ? expandedSections[section] : true;

    const renderField = () => {
      switch (type) {
        case "select":
          return (
            <FormControl fullWidth>
              <InputLabel>{label}</InputLabel>
              <Select
                name={name}
                value={value}
                onChange={(e) => handleFilterChange(name, e.target.value)}
                label={label}
                multiple={multiple}
                {...fieldProps}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );

        case "range":
          return (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {label}
              </Typography>
              <Slider
                value={value}
                onChange={(e, newValue) => handleFilterChange(name, newValue)}
                min={min}
                max={max}
                step={step}
                marks={marks}
                valueLabelDisplay="auto"
                sx={{ mt: 2 }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="caption" color="textSecondary">
                  {value[0]}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {value[1]}
                </Typography>
              </Box>
            </Box>
          );

        case "checkbox":
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={(e) => handleFilterChange(name, e.target.checked)}
                />
              }
              label={label}
            />
          );

        case "radio":
          return (
            <FormControl component="fieldset">
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {label}
              </Typography>
              <RadioGroup
                name={name}
                value={value}
                onChange={(e) => handleFilterChange(name, e.target.value)}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          );

        case "switch":
          return (
            <FormControlLabel
              control={
                <Switch
                  checked={value}
                  onChange={(e) => handleFilterChange(name, e.target.checked)}
                />
              }
              label={label}
            />
          );

        default:
          return (
            <TextField
              fullWidth
              name={name}
              label={label}
              type={type}
              value={value}
              onChange={(e) => handleFilterChange(name, e.target.value)}
              placeholder={placeholder}
              helperText={helperText}
              InputProps={{
                startAdornment: type === "search" ? (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ) : type === "date" ? (
                  <InputAdornment position="start">
                    <DateIcon />
                  </InputAdornment>
                ) : undefined,
              }}
              {...fieldProps}
            />
          );
      }
    };

    if (section) {
      return (
        <Collapse in={isExpanded} key={name}>
          <Grid item {...gridProps}>
            {renderField()}
          </Grid>
        </Collapse>
      );
    }

    return (
      <Grid item {...gridProps} key={name}>
        {renderField()}
      </Grid>
    );
  };

  const renderSection = (sectionName, sectionFilters) => {
    const isExpanded = expandedSections[sectionName] || false;
    const sectionActiveFilters = sectionFilters.filter(filter => 
      filterData[filter.name] && 
      filterData[filter.name] !== "" && 
      filterData[filter.name] !== null && 
      filterData[filter.name] !== undefined
    ).length;

    return (
      <Box key={sectionName} mb={2}>
        <Button
          fullWidth
          onClick={() => toggleSection(sectionName)}
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            fontWeight: 600,
            color: "text.primary",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <FilterIcon fontSize="small" />
            <Typography variant="h6">{sectionName}</Typography>
            {sectionActiveFilters > 0 && (
              <Chip
                label={sectionActiveFilters}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
        </Button>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={2}>
          {sectionFilters.map(renderFilterField)}
        </Grid>
      </Box>
    );
  };

  const groupedFilters = filters.reduce((acc, filter) => {
    const section = filter.section || "General";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(filter);
    return acc;
  }, {});

  const actions = (
    <>
      {showClearButton && (
        <MDButton
          onClick={handleClearFilters}
          color="secondary"
          variant="outlined"
          startIcon={<ClearIcon />}
        >
          Limpiar Filtros
        </MDButton>
      )}
      {showApplyButton && (
        <MDButton
          onClick={handleApplyFilters}
          color="info"
          variant="gradient"
          startIcon={<FilterIcon />}
        >
          Aplicar Filtros
          {activeFilters > 0 && (
            <Chip
              label={activeFilters}
              size="small"
              color="white"
              sx={{ ml: 1, color: "primary.main" }}
            />
          )}
        </MDButton>
      )}
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      titleIcon={<FilterIcon />}
      actions={actions}
      maxWidth={maxWidth}
      {...modalProps}
    >
      <MDBox>
        {/* Resumen de filtros activos */}
        {activeFilters > 0 && (
          <Box mb={2}>
            <MDTypography variant="body2" color="textSecondary">
              {activeFilters} filtro{activeFilters !== 1 ? 's' : ''} activo{activeFilters !== 1 ? 's' : ''}
            </MDTypography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {filters.map(filter => {
                const value = filterData[filter.name];
                if (!value || value === "" || (Array.isArray(value) && value.length === 0)) return null;
                
                return (
                  <Chip
                    key={filter.name}
                    label={`${filter.label}: ${Array.isArray(value) ? value.join(', ') : value}`}
                    size="small"
                    onDelete={() => handleFilterChange(filter.name, "")}
                    color="primary"
                    variant="outlined"
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* Filtros agrupados por secciones */}
        <Grid container spacing={2}>
          {Object.entries(groupedFilters).map(([sectionName, sectionFilters]) => 
            sectionName === "General" ? 
              sectionFilters.map(renderFilterField) :
              renderSection(sectionName, sectionFilters)
          )}
        </Grid>
      </MDBox>
    </BaseModal>
  );
};

FiltersModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    marks: PropTypes.array,
    multiple: PropTypes.bool,
    gridProps: PropTypes.object,
    section: PropTypes.string,
  })).isRequired,
  initialFilters: PropTypes.object,
  onApply: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  title: PropTypes.string,
  showClearButton: PropTypes.bool,
  showApplyButton: PropTypes.bool,
  maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  enableAdvancedFilters: PropTypes.bool,
};

export default FiltersModal; 