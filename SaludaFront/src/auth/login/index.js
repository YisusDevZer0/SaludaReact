import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";

// @mui icons
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDLoader from "components/MDLoader";
import MDAlert from "components/MDAlert";

// Authentication layout components
import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";

function Login() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
  });

  const [credentialsError, setCredentialsError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  // Estados para notificaciones minimalistas
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // 'error', 'warning', 'info', 'success'
  });
  
  // Estados para manejo de intentos fallidos
  const [intentosFallidos, setIntentosFallidos] = useState(
    parseInt(localStorage.getItem("intentosFallidos")) || 0
  );
  const [bloqueado, setBloqueado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  
  // Constantes para configuración del bloqueo
  const maxIntentos = 3;
  const tiempoBloqueoMinutos = 5;

  // Cargar estado "Recordarme" al iniciar
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("savedEmail");
    
    setRememberMe(savedRememberMe);
    if (savedRememberMe && savedEmail) {
      setInputs(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  // Verificar si ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    const userRole = localStorage.getItem("userRole");
    
    if (token && userData && userRole) {
      console.log('Usuario ya autenticado, redirigiendo...'); // Debug log
      
      // Redirigir según el rol
      if (userRole === 'Administrador') {
        navigate("/dashboard");
      } else if (userRole === 'RH' || userRole === 'Desarrollo Humano') {
        navigate("/rh-dashboard");
      } else if (userRole === 'Administrador Agendas') {
        navigate("/admin-agendas");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar errores al escribir
    if (errors[`${name}Error`]) {
      setErrors(prev => ({
        ...prev,
        [`${name}Error`]: false,
      }));
    }
    
    // Guardar email si "Recordarme" está activado
    if (name === "email" && rememberMe) {
      localStorage.setItem("savedEmail", value);
    }
  };

  const handleRememberMeChange = (event) => {
    const checked = event.target.checked;
    setRememberMe(checked);
    localStorage.setItem("rememberMe", checked.toString());
    
    if (checked) {
      localStorage.setItem("savedEmail", inputs.email);
    } else {
      localStorage.removeItem("savedEmail");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showNotification = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeNotification = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const bloquearAcceso = () => {
    setBloqueado(true);
    const tiempoBloqueo = tiempoBloqueoMinutos * 60;
    setSegundosRestantes(tiempoBloqueo);
    localStorage.setItem("tiempoBloqueoInicio", Date.now().toString());
    
    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setBloqueado(false);
          setIntentosFallidos(0);
          localStorage.removeItem("intentosFallidos");
          localStorage.removeItem("tiempoBloqueoInicio");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateForm = () => {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = true;
    const newErrors = { emailError: false, passwordError: false };

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      newErrors.emailError = true;
      isValid = false;
    }

    if (inputs.password.trim().length < 3) {
      newErrors.passwordError = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (bloqueado) {
      showNotification("Acceso bloqueado temporalmente", "warning");
      return;
    }

    setCredentialsError(null);

    if (!validateForm()) {
      showNotification("Por favor, corrige los errores en el formulario", "error");
      return;
    }

    setIsLoading(true);
    setIsValidating(true);

    const myData = {
      data: {
        type: "token",
        attributes: {
          email: inputs.email,
          password: inputs.password
        },
      },
    };

    try {
      const response = await AuthService.login(myData);
      
      console.log('Login exitoso, respuesta:', response); // Debug log
      
      // En caso de éxito
      showNotification("¡Bienvenido! Redirigiendo...", "success");
      
      // Resetear intentos fallidos al acceder correctamente
      localStorage.removeItem("intentosFallidos");
      localStorage.removeItem("tiempoBloqueoInicio");
      setIntentosFallidos(0);
      
      // Realizar el login en el contexto de autenticación inmediatamente
      try {
        console.log('Llamando a authContext.login...'); // Debug log
        await authContext.login(response.access_token, response.refresh_token, response.user);
        console.log('authContext.login completado exitosamente'); // Debug log
        // La redirección se maneja automáticamente en el contexto
      } catch (error) {
        console.error('Error en login del contexto:', error);
        showNotification("Error al procesar el login", "error");
      }
      
    } catch (res) {
      console.error('Error en login:', res); // Debug log
      
      // Incrementar intentos fallidos
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);
      localStorage.setItem("intentosFallidos", nuevosIntentos);

      if (nuevosIntentos >= maxIntentos) {
        bloquearAcceso();
        showNotification("Demasiados intentos fallidos. Acceso bloqueado temporalmente.", "error");
      } else {
        const errorMessage = res.hasOwnProperty("message") 
          ? res.message 
          : (res.errors && res.errors[0] ? res.errors[0].detail : "Credenciales incorrectas");
        
        setCredentialsError(errorMessage);
        showNotification(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  return (
    <BasicLayoutLanding image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDBox display="flex" justifyContent="center" alignItems="center" mb={1}>
            <LocalHospitalIcon fontSize="large" sx={{ color: "white", mr: 1 }} />
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={0.5}>
              SALUDA
            </MDTypography>
          </MDBox>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Ingresa tus credenciales para iniciar sesión
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Correo electrónico"
                fullWidth
                name="email"
                value={inputs.email}
                onChange={handleChange}
                error={errors.emailError}
                helperText={errors.emailError && "Por favor ingresa un correo válido"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={handleChange}
                error={errors.passwordError}
                helperText={errors.passwordError && "La contraseña debe tener al menos 3 caracteres"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch 
                checked={rememberMe} 
                onChange={handleRememberMeChange}
                color="info"
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleRememberMeChange}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Recordarme
              </MDTypography>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isLoading || bloqueado || isValidating}
                sx={{
                  position: 'relative',
                  minHeight: '44px',
                }}
              >
                {isLoading ? (
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Iniciando sesión...
                  </Box>
                ) : isValidating ? (
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Validando credenciales...
                  </Box>
                ) : (
                  "Iniciar Sesión"
                )}
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿No tienes una cuenta?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/register"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Regístrate
                </MDTypography>
              </MDTypography>
            </MDBox>

            <MDBox mt={2} mb={1} textAlign="center">
              <MDTypography
                component={Link}
                to="/auth/forgot-password"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                ¿Olvidaste tu contraseña?
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* Notificación minimalista */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Zoom}
      >
        <Alert 
          onClose={closeNotification} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogo de bloqueo */}
      <Dialog 
        open={bloqueado} 
        onClose={() => {}} // No permitir cerrar mientras está bloqueado
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <LockIcon color="warning" sx={{ mr: 1 }} />
            Acceso bloqueado
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Has excedido el número máximo de intentos. Por favor, espera{" "}
            <strong>{Math.floor(segundosRestantes / 60)} minutos y {segundosRestantes % 60} segundos</strong>{" "}
            antes de intentar nuevamente.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </BasicLayoutLanding>
  );
}

export default Login;

