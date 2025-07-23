import React from "react";
import PropTypes from "prop-types";
import ThemedModal from "components/ThemedModal";

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
    <ThemedModal
      open={open}
      onClose={onClose}
      title={title}
      children={children}
      actions={actions}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      showCloseButton={showCloseButton}
      closeOnBackdropClick={closeOnBackdropClick}
      closeOnEscape={closeOnEscape}
      disableBackdropClick={disableBackdropClick}
      className={className}
      titleIcon={titleIcon}
      titleColor={titleColor}
      contentPadding={contentPadding}
      actionsPadding={actionsPadding}
      elevation={elevation}
      transitionDuration={transitionDuration}
      backdropProps={backdropProps}
      paperProps={paperProps}
    />
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