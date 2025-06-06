import { useContext, useState } from "react";
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

// @mui icons
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  
  // Estados para diálogos
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  
  // Estados para manejo de intentos fallidos
  const [intentosFallidos, setIntentosFallidos] = useState(
    parseInt(localStorage.getItem("intentosFallidos")) || 0
  );
  const [bloqueado, setBloqueado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  
  // Constantes para configuración del bloqueo
  const maxIntentos = 3;
  const tiempoBloqueoMinutos = 5;

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
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

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (bloqueado) {
      setBlockDialogOpen(true);
      return;
    }

    setCredentialsError(null);

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (inputs.password.trim().length < 3) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    setIsLoading(true);

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
      
      // En caso de éxito
      setSuccessDialogOpen(true);
      
      // Resetear intentos fallidos al acceder correctamente
      localStorage.removeItem("intentosFallidos");
      localStorage.removeItem("tiempoBloqueoInicio");
      setIntentosFallidos(0);
      
      // Realizar el login en el contexto de autenticación
      setTimeout(() => {
        authContext.login(response.access_token, response.refresh_token, response.user);
        setSuccessDialogOpen(false);
      }, 1500);
      
    } catch (res) {
      // Incrementar intentos fallidos
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);
      localStorage.setItem("intentosFallidos", nuevosIntentos);

      if (nuevosIntentos >= maxIntentos) {
        bloquearAcceso();
      } else {
        setErrorDialogOpen(true);
        if (res.hasOwnProperty("message")) {
          setCredentialsError(res.message);
        } else {
          setCredentialsError(
            res.errors && res.errors[0] ? res.errors[0].detail : "Error de autenticación"
          );
        }
      }
    } finally {
      setIsLoading(false);
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
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Contraseña"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={handleChange}
                error={errors.passwordError}
                helperText={errors.passwordError && "La contraseña debe tener al menos 3 caracteres"}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={() => setRememberMe(!rememberMe)}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Recordarme
              </MDTypography>
            </MDBox>

            {credentialsError && (
              <MDBox mt={2} mb={1}>
                <MDAlert color="error" dismissible>
                  {credentialsError}
                </MDAlert>
              </MDBox>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isLoading || bloqueado}
              >
                {isLoading ? <MDLoader size={20} color="white" /> : "Iniciar Sesión"}
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

      {/* Diálogo de éxito */}
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            Acceso exitoso
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bienvenido al sistema. Redirigiendo...
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Diálogo de error */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
            Error de autenticación
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {credentialsError || "Ha ocurrido un error al intentar iniciar sesión."}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Diálogo de bloqueo */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <LockIcon color="warning" sx={{ mr: 1 }} />
            Acceso bloqueado
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Has excedido el número máximo de intentos. Por favor, espera {Math.floor(segundosRestantes / 60)} minutos y {segundosRestantes % 60} segundos antes de intentar nuevamente.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </BasicLayoutLanding>
  );
}

export default Login;

