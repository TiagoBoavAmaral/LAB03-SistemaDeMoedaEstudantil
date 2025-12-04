import { useEffect, useState, useRef } from "react";

export interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  title = "Confirmar",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "info",
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const onConfirmRef = useRef(onConfirm);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
    onCancelRef.current = onCancel;
  }, [onConfirm, onCancel]);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirmRef.current();
    }, 200);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancelRef.current();
    }, 200);
  };

  useEffect(() => {
    if (!isVisible) return;

    // Handle ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false);
        setTimeout(() => {
          onCancelRef.current();
        }, 200);
      }
    };

    // Handle Enter key
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsVisible(false);
        setTimeout(() => {
          onConfirmRef.current();
        }, 200);
      }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("keydown", handleEnter);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("keydown", handleEnter);
    };
  }, [isVisible]);

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          iconColor: "#ef4444",
          confirmButtonBg: "#ef4444",
          confirmButtonHoverBg: "#dc2626",
        };
      case "warning":
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          iconColor: "#f59e0b",
          confirmButtonBg: "#f59e0b",
          confirmButtonHoverBg: "#d97706",
        };
      default:
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12L11 15L16 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          iconColor: "#6366f1",
          confirmButtonBg: "#6366f1",
          confirmButtonHoverBg: "#4f46e5",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isVisible ? "auto" : "none",
        }}
        onClick={handleCancel}
      >
        {/* Dialog */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(11, 18, 32, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "450px",
            width: "90%",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            transform: isVisible ? "scale(1)" : "scale(0.95)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              color: typeStyles.iconColor,
            }}
          >
            {typeStyles.icon}
          </div>

          {/* Title */}
          <h3
            style={{
              margin: "0 0 12px 0",
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            style={{
              margin: "0 0 28px 0",
              fontSize: "15px",
              lineHeight: "1.6",
              color: "var(--muted)",
              textAlign: "center",
            }}
          >
            {message}
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                padding: "10px 20px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "var(--text)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: "10px 20px",
                background: typeStyles.confirmButtonBg,
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: `0 4px 12px rgba(${typeStyles.confirmButtonBg === "#ef4444" ? "239, 68, 68" : typeStyles.confirmButtonBg === "#f59e0b" ? "245, 158, 11" : "99, 102, 241"}, 0.3)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = typeStyles.confirmButtonHoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = typeStyles.confirmButtonBg;
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

