import { useEffect, useState } from "react";
import SpinnerComponent from "../../components/atoms/SpinnerComponent";

type OwnProps = {
  el: React.RefObject<HTMLDivElement>;
  onRefresh?: () => Promise<void>;
};

const PullToRefresh: React.FC<OwnProps> = ({ el, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const element = el.current; // el.current를 로컬 변수에 저장

    function handleTouchStart(event: TouchEvent) {
      if (!element) return; // element 존재 여부 확인
      setStartY(event.touches[0].clientY);
    }

    function handleTouchMove(event: TouchEvent) {
      if (!element) return;
      const moveY = event.touches[0].clientY;
      const pullDistance = moveY - startY;

      // 스크롤이 맨 위에 있을 때만 트리거
      if (element.scrollTop <= 0 && pullDistance > 0) {
        event.preventDefault(); // iOS 스크롤 이벤트 방지
        if (pullDistance > 80) {
          // pullDistance를 80보다 크게
          element.style.transform = "translate(0, 40px)";
          element.style.transition = "0.3s";
          setRefreshing(true);
        } else {
          // pullDistance가 작을 경우 트랜지션 제거
          element.style.transform = `translate(0, ${pullDistance}px)`;
          element.style.transition = "none";
        }
      }
    }

    function handleTouchEnd() {
      if (refreshing) {
        if (onRefresh) {
          onRefresh().then(() => {
            if (!element) return;
            setRefreshing(false);
            element.style.transform = "translate(0,0)";
            element.style.transition = "0.3s"; // 트랜지션 추가
          });
        }
      } else {
        // 새로고침되지 않으면 원상태로 복귀
        if (element) {
          element.style.transform = "translate(0,0)";
          element.style.transition = "0.3s"; // 트랜지션 추가
        }
      }
    }

    element?.addEventListener("touchstart", handleTouchStart);
    element?.addEventListener("touchmove", handleTouchMove);
    element?.addEventListener("touchend", handleTouchEnd);

    return () => {
      element?.removeEventListener("touchstart", handleTouchStart);
      element?.removeEventListener("touchmove", handleTouchMove);
      element?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [refreshing, startY, el, onRefresh]);

  return (
    <div className="w-full text-center">
      {refreshing && <SpinnerComponent />}
    </div>
  );
};

export default PullToRefresh;
