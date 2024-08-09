import { EventSourcePolyfill } from "event-source-polyfill";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

interface UseSSEProps {
  url: string;
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
  onOpen?: () => void;
}

export const useSSE = ({ url, onMessage, onError, onOpen }: UseSSEProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSourcePolyfill(`${BASE_URL}${url}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    eventSource.onopen = () => {
      if (onOpen) onOpen();
    };

    eventSource.onmessage = (event) => {
      if (onMessage) onMessage(event.data);
    };

    eventSource.onerror = (event) => {
      if (onError) onError(event);
    };

    eventSourceRef.current = eventSource;
  }, [url, accessToken, onMessage, onError, onOpen]);

  useEffect(() => {
    if (isActive) {
      connect();
    }
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isActive, connect]);

  return { setIsActive };
};

export default useSSE;
