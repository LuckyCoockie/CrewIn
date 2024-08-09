import { useState, useEffect, useRef, useCallback } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";

// EventSource 인스턴스와 isActive 상태를 URL별로 저장하는 객체
const eventSources = new Map();

type SSECallback = (data: any) => void;

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const useSSE = (url: string, onMessage?: SSECallback) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const eventSourceRef = useRef(null);

  const startConnection = useCallback(() => {
    if (!eventSources.has(url)) {
      const eventSource = new EventSourcePolyfill(`${BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      eventSource.onmessage = (event) => {
        const newEvent = JSON.parse(event.data);
        setEvents((prevEvents) => [...prevEvents, newEvent]);

        console.log(newEvent);

        // 콜백 호출
        if (onMessage) {
          onMessage(newEvent.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE 오류:", error);
        eventSource.close();
        setTimeout(() => startConnection(), 1000);
      };

      // URL에 대한 새로운 연결과 isActive 상태 저장
      eventSources.set(url, { eventSource, isActive: true });
    } else {
      // 기존 연결이 있는 경우 isActive 상태만 업데이트
      const sourceData = eventSources.get(url);
      sourceData.isActive = true;
    }

    eventSourceRef.current = eventSources.get(url).eventSource;
  }, [url, accessToken, onMessage]);

  const stopConnection = useCallback(() => {
    if (eventSources.has(url)) {
      const sourceData = eventSources.get(url);
      sourceData.isActive = false;

      // 연결을 닫지 않고, isActive 상태만 false로 설정
      if (sourceData.eventSource) {
        sourceData.eventSource.close();
      }
    }
  }, [url]);

  useEffect(() => {
    if (isActive) {
      startConnection();
    } else {
      stopConnection();
    }

    return () => {
      if (eventSources.has(url)) {
        const sourceData = eventSources.get(url);
        sourceData.isActive = false;
      }
    };
  }, [isActive, startConnection, stopConnection, url]);

  useEffect(() => {
    if (eventSources.has(url)) {
      setIsActive(eventSources.get(url).isActive);
    }
  }, [url]);

  return { events, isActive, setIsActive };
};

export default useSSE;
