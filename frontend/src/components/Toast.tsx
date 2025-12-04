import { useEffect, useState } from "react";
import { Notification } from "../contexts/NotificationContext";

interface ToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export function Toast({ notification, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto remove after duration
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 10L9.16667 11.6667L12.5 8.33333"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 7.5V10.8333M10 14.1667H10.0083M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 6.66667V10M10 13.3333H10.0083"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  const getStyles = () => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 20px",
      borderRadius: "12px",
      minWidth: "300px",
      maxWidth: "450px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isVisible && !isLeaving ? "translateX(0)" : "translateX(400px)",
      opacity: isVisible && !isLeaving ? 1 : 0,
    };

    switch (notification.type) {
      case "success":
        return {
          ...baseStyles,
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.15) 100%)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          color: "#4ade80",
        };
      case "error":
        return {
          ...baseStyles,
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#f87171",
        };
      case "warning":
        return {
          ...baseStyles,
          background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          color: "#fbbf24",
        };
      default:
        return {
          ...baseStyles,
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          color: "#a5b4fc",
        };
    }
  };

  return (
    <div style={getStyles()}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1, fontSize: "14px", lineHeight: "1.5", fontWeight: 500 }}>
        {notification.message}
      </div>
      <button
        onClick={handleRemove}
        style={{
          background: "transparent",
          border: "none",
          color: "currentColor",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.7,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
        aria-label="Fechar notificação"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer({ notifications, onRemove }: { notifications: Notification[]; onRemove: (id: string) => void }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      {notifications.map((notification) => (
        <div key={notification.id} style={{ pointerEvents: "auto" }}>
          <Toast notification={notification} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

