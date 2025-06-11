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

import PillLoader from "../PillLoader";
import "../PillLoader.css";

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
        <PillLoader message={randomMessage} />
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