import { EventSourcePolyfill } from "event-source-polyfill";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

interface UseSSEProps {
  url: string;
  events?: { event: string; onEvent: (data: any) => void }[];
  onError?: (error: any) => void;
  onOpen?: () => void;
}

export const useSSE = ({ url, events, onError, onOpen }: UseSSEProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSourcePolyfill(`${BASE_URL}${url}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      heartbeatTimeout: 1000 * 60 * 60,
    });

    eventSource.onopen = () => {
      if (onOpen) onOpen();
    };

    events?.forEach(({ event, onEvent }) => {
      eventSource.addEventListener(event, (event) => {
        if (events) onEvent(JSON.parse((event as MessageEvent).data));
      });
    });

    eventSource.onerror = (event) => {
      if (onError) onError(event);
    };

    eventSourceRef.current = eventSource;
  }, [url, accessToken, events, onOpen, onError]);

  useEffect(() => {
    if (isActive) connect();
    return () => eventSourceRef.current?.close();
  }, [isActive, connect]);

  return { setIsActive };
};

export default useSSE;
