import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";

export default styled(Snackbar, {
  shouldForwardProp: (prop) => prop !== "ownerState",
})(({ theme, ownerState }) => {
  const { color, bgWhite, darkMode } = ownerState;

  const { palette, functions, typography, boxShadows } = theme;
  const { white, gradients, grey, transparent } = palette;
  const { linearGradient } = functions;
  const { size, fontWeightMedium } = typography;

  // backgroundImage value
  let backgroundImageValue;

  if (bgWhite) {
    backgroundImageValue = white.main;
  } else if (color === "light") {
    backgroundImageValue = grey[100];
  } else {
    backgroundImageValue = gradients[color]
      ? linearGradient(gradients[color].main, gradients[color].state)
      : linearGradient(gradients.info.main, gradients.info.state);
  }

  return {
    "& .MuiPaper-root": {
      backgroundImage: backgroundImageValue,
      color: bgWhite || color === "light" ? grey[700] : white.main,
      borderRadius: "8px",
      boxShadow: boxShadows.lg,
      minWidth: "300px",
      maxWidth: "500px",
    },
    "& .MuiSnackbarContent-root": {
      padding: "12px 16px",
    },
    "& .MuiSnackbarContent-message": {
      display: "flex",
      alignItems: "center",
      fontSize: size.sm,
      fontWeight: fontWeightMedium,
    },
  };
}); 