import { useCallback, useRef, useState, useEffect } from "react";
import { notification } from "antd";

export enum MessageType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

interface NotificationConfig {
  message: string;
  type: MessageType;
  description?: string;
}

export function useMessageAlert() {
  const [api, contextHolder] = notification.useNotification();
  const notificationConfigRef = useRef<NotificationConfig | null>(null);
  const lastCallTimeRef = useRef(0);
  const [notificationTrigger, setNotificationTrigger] = useState(0);

  const showNotification = useCallback(() => {
    if (notificationConfigRef.current) {
      const now = Date.now();
      if (now - lastCallTimeRef.current < 500) return;
      lastCallTimeRef.current = now;

      api.open({
        type: notificationConfigRef.current.type,
        message: notificationConfigRef.current.message,
        description: notificationConfigRef.current.description,
        placement: 'topRight',
        duration: 3
      });
      notificationConfigRef.current = null;
    }
  }, [api]);

  useEffect(() => {
    if (notificationTrigger > 0 && notificationConfigRef.current) {
      showNotification();
    }
  }, [notificationTrigger, showNotification]);

  const openNotification = useCallback((message: string, type: MessageType = MessageType.INFO, description?: string) => {
    notificationConfigRef.current = { message, type, description };
    setNotificationTrigger(prev => prev + 1);
  }, [])

  return { openNotification, contextHolder };
}
