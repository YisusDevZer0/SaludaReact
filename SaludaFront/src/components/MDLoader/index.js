/**
 * SALUDA - Centro Médico Familiar
 * MDLoader Component
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

// SALUDA colors
const SALUDA_COLORS = {
  primary: "#C80096",
  secondary: "#00a8E1",
  accent: "#00C7B1",
  text: "#2c3e50",
  light: "#f8f9fa"
};

function MDLoader({ open, message, fullScreen }) {
  const [progress, setProgress] = useState(0);
  const [randomMessage, setRandomMessage] = useState("");

  const messages = [
    "Cargando información médica...",
    "Preparando todo para usted...",
    "Su salud es nuestra prioridad...",
    "Accediendo a su información...",
    "Iniciando SALUDA...",
    "Verificando datos...",
    "Cargando Centro Médico Familiar...",
  ];

  useEffect(() => {
    // Si está abierto, comenzamos a animar el progreso
    if (open) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
      }, 800);
      
      // Elegir un mensaje aleatorio
      const randomIndex = Math.floor(Math.random() * messages.length);
      setRandomMessage(message || messages[randomIndex]);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [open, message, messages]);

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: fullScreen ? "fixed" : "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: fullScreen ? "100vh" : "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: fullScreen ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
          backdropFilter: "blur(5px)",
          transition: "all 0.3s ease",
        }}
      >
        <Box 
          sx={{
            width: 200, 
            height: 200, 
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={progress}
            size={100}
            thickness={4}
            sx={{
              color: SALUDA_COLORS.primary,
              position: "absolute",
              zIndex: 1,
            }}
          />
          <CircularProgress
            variant="determinate"
            value={progress + 10 > 100 ? 100 : progress + 10}
            size={100}
            thickness={4}
            sx={{
              color: SALUDA_COLORS.secondary,
              position: "absolute",
              zIndex: 0,
              opacity: 0.7,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <Typography variant="h6" component="div" color={fullScreen ? "white" : SALUDA_COLORS.primary} fontWeight="bold">
              SALUDA
            </Typography>
          </Box>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            color: fullScreen ? "white" : SALUDA_COLORS.text,
            maxWidth: "80%",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {randomMessage}
        </Typography>
      </Box>
    </Fade>
  );
}

// Setting default values for the props of MDLoader
MDLoader.defaultProps = {
  open: false,
  message: "",
  fullScreen: true,
};

// Typechecking props for the MDLoader
MDLoader.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default MDLoader; 