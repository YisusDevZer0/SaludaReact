/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for the MDSnackbar
import MDSnackbarRoot from "components/MDSnackbar/MDSnackbarRoot";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

const MDSnackbar = forwardRef(
  ({ color, icon, title, content, close, bgWhite, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDSnackbarRoot
        {...rest}
        ref={ref}
        color={color}
        bgWhite={bgWhite}
        variant={darkMode ? "contained" : "gradient"}
        ownerState={{ color, bgWhite, darkMode }}
      >
        {icon}
        <div>
          {title}
          {content}
        </div>
        {close}
      </MDSnackbarRoot>
    );
  }
);

// Setting default values for the props of MDSnackbar
MDSnackbar.defaultProps = {
  bgWhite: false,
  color: "info",
};

// Typechecking props for the MDSnackbar
MDSnackbar.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  close: PropTypes.node.isRequired,
  bgWhite: PropTypes.bool,
};

export default MDSnackbar;
