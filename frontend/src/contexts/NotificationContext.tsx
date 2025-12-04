import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
  confirm: (message: string, options?: {
    title?: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
  }) => Promise<boolean>;
  confirmDialog: ConfirmDialogState | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType = "info", duration: number = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const notification: Notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const confirm = useCallback(
    (
      message: string,
      options?: {
        title?: string;
        confirmText?: string;
        cancelText?: string;
        type?: "danger" | "warning" | "info";
      }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmDialog({
          isOpen: true,
          message,
          title: options?.title,
          confirmText: options?.confirmText,
          cancelText: options?.cancelText,
          type: options?.type || "info",
          onConfirm: () => {
            setConfirmDialog(null);
            resolve(true);
          },
          onCancel: () => {
            setConfirmDialog(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        notifications,
        removeNotification,
        confirm,
        confirmDialog,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

