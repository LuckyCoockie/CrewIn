import { useState, useEffect } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";

type SSECallback = (data: any) => void;

const eventSourceMap = new Map<string, EventSource>();

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const useSSE = (url: string, onMessage?: SSECallback) => {
  const [isActive, setIsActive] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let eventSource: EventSource | null = eventSourceMap.get(url) || null;

    if (isActive) {
      if (!eventSource) {
        eventSource = new EventSourcePolyfill(`${BASE_URL}${url}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        eventSourceMap.set(url, eventSource);

        eventSource.onmessage = (event) => {
          console.log(event);
          try {
            const data = JSON.parse(event.data);
            if (onMessage) onMessage(data);
          } catch (error) {
            console.error("SSE 데이터 처리 오류:", error);
          }
        };

        eventSource.onerror = (error) => {
          console.error("SSE 오류:", error);
          eventSource?.close();
          eventSourceMap.delete(url);
          setIsActive(false);
        };
      }
    } else {
      eventSource?.close();
      eventSourceMap.delete(url);
    }

    return () => {
      eventSource?.close();
      eventSourceMap.delete(url);
    };
  }, [isActive, url, onMessage]);

  return { isActive, setIsActive };
};

export default useSSE;
