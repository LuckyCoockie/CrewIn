import { useState, useEffect } from "react";

type SSECallback = (data: any) => void;

const eventSourceMap = new Map<string, EventSource>();

const useSSE = (url: string, onMessage?: SSECallback) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = eventSourceMap.get(url) || null;

    if (isActive) {
      if (!eventSource) {
        eventSource = new EventSource(url);
        eventSourceMap.set(url, eventSource);

        eventSource.onmessage = (event) => {
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
