// Project: Generic Modal Component
import * as React from "react";
import { styled, css, Theme } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  children: React.ReactNode;
  acceptText?: string;
  cancelText?: string;
  header?: string;
  customCss?: React.CSSProperties;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  customWidth?: string;
  customHeight?: string;
}

const GenericModal = ({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  children,
  acceptText = "Accept",
  cancelText = "Cancel",
  header,
  customCss,
  size = "md",
  customWidth,
  customHeight = "auto",
}: GenericModalProps) => {
  const sizeStyles: Record<string, string> = {
    sm: "300px",
    md: "500px",
    lg: "700px",
    xl: "900px",
    full: "95vw",
  };

  return (
    <StyledModal
      open={isOpen}
      onClose={onClose}
      slots={{ backdrop: StyledBackdrop }}
    >
      <ModalContent
        className="dark:bg-gray-800 dark:text-white"
        style={{
          width: size === "full" ? "100vw" : customWidth || sizeStyles[size],
          height: size === "full" ? "100vh" : customHeight || "auto",
          ...customCss,
        }}
      >
        {header && (
          <h2 className="modal-title flex flex-row justify-between">
            {header}{" "}
            <button
              onClick={onClose}
              style={{
                alignSelf: "flex-end",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </h2>
        )}

        <div className="modal-body">{children}</div>

        {(onAccept || onDecline) && (
          <div className="modal-actions">
            {onDecline && (
              <ActionButton variant="outlined" onClick={onDecline}>
                {cancelText}
              </ActionButton>
            )}
            {onAccept && (
              <ActionButton onClick={onAccept}>{acceptText}</ActionButton>
            )}
          </div>
        )}
      </ModalContent>
    </StyledModal>
  );
};

export default GenericModal;

// Styled Components
const StyledModal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const StyledBackdrop = styled("div")`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled("div")(
  ({ theme }: { theme: Theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    background-color: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
    color: ${theme.palette.mode === "dark" ? "#F3F6F9" : "#1C2025"};
    border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#DAE2ED"};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 24px;
    max-height: 90vh;
    overflow-y: auto;

    .modal-title {
      margin-bottom: 16px;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .modal-body {
      flex: 1 1 auto;
      margin-bottom: 24px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `
);

const ActionButton = styled("button")<{ variant?: "outlined" }>(
  ({ variant }: { theme: Theme; variant?: "outlined" }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 150ms ease;
    border: 1px solid ${variant === "outlined" ? "#ccc" : "#007FFF"};
    background-color: ${variant === "outlined" ? "#fff" : "#007FFF"};
    color: ${variant === "outlined" ? "#333" : "#fff"};

    &:hover {
      background-color: ${variant === "outlined" ? "#f0f0f0" : "#0066CC"};
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 4px ${variant === "outlined" ? "#99CCFF" : "#3399FF"};
    }
  `
);
