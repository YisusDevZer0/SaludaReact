import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const PatientAutocomplete = ({
  value,
  onChange,
  onPatientSelect,
  placeholder = "Buscar paciente...",
  disabled = false,
  error = false,
  helperText = ""
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || '');
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Función para buscar pacientes
  const searchPatients = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/citas-mejoradas/buscar-pacientes?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      } else {
        console.error('Error al buscar pacientes:', response.statusText);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchPatients(searchQuery);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Manejar cambio en el input
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    
    // Si se borra el texto, limpiar selección
    if (newValue === '') {
      onPatientSelect(null);
    }
  };

  // Manejar selección de paciente
  const handlePatientSelect = (patient) => {
    setSearchQuery(patient.nombre_completo);
    setShowSuggestions(false);
    onPatientSelect(patient);
  };

  // Manejar clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar teclas
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <Box position="relative" ref={inputRef}>
      <TextField
        fullWidth
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        InputProps={{
          startAdornment: loading ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : (
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          )
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            mt: 0.5
          }}
        >
          <List dense>
            {suggestions.map((patient) => (
              <ListItem key={patient.id} disablePadding>
                <ListItemButton
                  onClick={() => handlePatientSelect(patient)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {patient.nombre_completo}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          📧 {patient.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📞 {patient.telefono}
                        </Typography>
                        {patient.direccion && (
                          <Typography variant="body2" color="text.secondary">
                            📍 {patient.direccion}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && !loading && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 0.5,
            p: 2
          }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No se encontraron pacientes con ese nombre
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PatientAutocomplete;
