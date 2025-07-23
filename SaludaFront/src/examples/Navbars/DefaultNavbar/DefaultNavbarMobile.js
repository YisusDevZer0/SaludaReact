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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Menu from "@mui/material/Menu";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
import { useContext } from "react";
import { AuthContext } from "context";

function DefaultNavbarMobile({ open, close, light = false }) {
  const authContext = useContext(AuthContext);
  const { width } = open && open.getBoundingClientRect();

  return (
    <Menu
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={close}
      MenuListProps={{ style: { width: `calc(${width}px - 4rem)` } }}
    >
      {!authContext.isAuthenticated && (
        <MDBox px={0.5}>
          <DefaultNavbarLink icon="account_circle" name="register" route="/auth/register" light={light} />
          <DefaultNavbarLink icon="key" name="login" route="/auth/login" light={light} />
        </MDBox>
      )}
      {authContext.isAuthenticated && (
        <MDBox px={0.5}>
          <DefaultNavbarLink icon="donut_large" name="dashboard" route="/dashboard" light={light} />
          <DefaultNavbarLink icon="person" name="profile" route="/profile" light={light} />
          <DefaultNavbarLink icon="account_circle" name="sign up" route="/authentication/sign-up" light={light} />
          <DefaultNavbarLink icon="key" name="sign in" route="/authentication/sign-in" light={light} />
        </MDBox>
      )}
    </Menu>
  );
}

// Typechecking props for the DefaultNavbarMenu
DefaultNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
  light: PropTypes.bool,
};

export default DefaultNavbarMobile;
