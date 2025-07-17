import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Fade,
  Backdrop,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

const BaseModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  disableBackdropClick = false,
  className = "",
  titleIcon,
  titleColor = "primary",
  contentPadding = 3,
  actionsPadding = 2,
  elevation = 24,
  transitionDuration = 300,
  backdropProps = {},
  paperProps = {},
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: transitionDuration,
        ...backdropProps,
      }}
      PaperProps={{
        elevation,
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          ...paperProps.sx,
        },
        ...paperProps,
      }}
      TransitionComponent={Fade}
      transitionDuration={transitionDuration}
      className={`base-modal ${className}`}
      onBackdropClick={closeOnBackdropClick && !disableBackdropClick ? onClose : undefined}
      onEscapeKeyDown={closeOnEscape ? onClose : undefined}
    >
      {/* Header con gradiente */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "24px 32px",
          margin: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "72px",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {titleIcon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                marginRight: 1,
              }}
            >
              {titleIcon}
            </Box>
          )}
          <MDTypography
            variant="h5"
            color="white"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </MDTypography>
        </Box>
        
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {/* Contenido */}
      <DialogContent
        sx={{
          padding: contentPadding,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            animation: "fadeInUp 0.3s ease-out",
            "@keyframes fadeInUp": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {children}
        </Box>
      </DialogContent>

      {/* Acciones */}
      {actions && (
        <DialogActions
          sx={{
            padding: actionsPadding,
            background: "rgba(248, 249, 250, 0.8)",
            borderTop: "1px solid rgba(224, 224, 224, 0.5)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

BaseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  fullWidth: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  className: PropTypes.string,
  titleIcon: PropTypes.node,
  titleColor: PropTypes.string,
  contentPadding: PropTypes.number,
  actionsPadding: PropTypes.number,
  elevation: PropTypes.number,
  transitionDuration: PropTypes.number,
  backdropProps: PropTypes.object,
  paperProps: PropTypes.object,
};

export default BaseModal; 