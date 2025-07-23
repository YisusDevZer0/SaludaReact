import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Fade,
  Backdrop,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import useTheme from 'hooks/useTheme';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

const ThemedModal = ({
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
  const { colors, componentStyles } = useTheme();

  const modalStyles = {
    backdrop: {
      backgroundColor: colors.background.modalBackdrop,
      backdropFilter: 'blur(5px)',
    },
    paper: {
      backgroundColor: componentStyles.modal.backgroundColor,
      color: componentStyles.modal.color,
      borderRadius: '16px',
      overflow: 'hidden',
      border: componentStyles.modal.border,
      boxShadow: componentStyles.modal.boxShadow,
      backdropFilter: 'blur(20px)',
      ...paperProps.sx,
    },
    title: {
      background: componentStyles.modal.header.background,
      color: componentStyles.modal.header.color,
      padding: '24px 32px',
      margin: 0,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '72px',
      borderBottom: componentStyles.modal.header.borderBottom,
    },
    content: {
      padding: contentPadding,
      backgroundColor: componentStyles.modal.content.backgroundColor,
      color: componentStyles.modal.content.color,
    },
    actions: {
      padding: actionsPadding,
      backgroundColor: componentStyles.modal.actions.backgroundColor,
      borderTop: componentStyles.modal.actions.borderTop,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 1,
    },
    closeButton: {
      color: componentStyles.modal.closeButton.color,
      '&:hover': {
        backgroundColor: componentStyles.modal.closeButton.hoverBackground,
        transform: 'scale(1.1)',
      },
      transition: 'all 0.2s ease',
    },
  };

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
        sx: modalStyles.backdrop,
        ...backdropProps,
      }}
      PaperProps={{
        elevation,
        sx: modalStyles.paper,
        ...paperProps,
      }}
      TransitionComponent={Fade}
      transitionDuration={transitionDuration}
      className={`themed-modal ${className}`}
      onBackdropClick={closeOnBackdropClick && !disableBackdropClick ? onClose : undefined}
      onEscapeKeyDown={closeOnEscape ? onClose : undefined}
    >
      {/* Header con tema adaptativo */}
      <DialogTitle sx={modalStyles.title}>
        <Box display="flex" alignItems="center" gap={1}>
          {titleIcon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: componentStyles.modal.header.iconBackground,
                backdropFilter: 'blur(10px)',
                marginRight: 1,
              }}
            >
              {titleIcon}
            </Box>
          )}
          <MDTypography
            variant="h5"
            color="inherit"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </MDTypography>
        </Box>
        
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            sx={modalStyles.closeButton}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {/* Contenido */}
      <DialogContent sx={modalStyles.content}>
        <Box
          sx={{
            animation: 'fadeInUp 0.3s ease-out',
            '@keyframes fadeInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          {children}
        </Box>
      </DialogContent>

      {/* Acciones */}
      {actions && (
        <DialogActions sx={modalStyles.actions}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

ThemedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default ThemedModal; 