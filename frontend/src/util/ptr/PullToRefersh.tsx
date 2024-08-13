import { useEffect, useState } from "react";
import SpinnerComponent from "../../components/atoms/SpinnerComponent";

type OwnProps = {
  el: React.RefObject<HTMLDivElement>;
  onRefresh?: () => Promise<void>;
};

const PullToRefresh: React.FC<OwnProps> = ({ el, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollY, setStartScrollY] = useState(0);

  useEffect(() => {
    const element = el.current;

    function handleTouchStart(event: TouchEvent) {
      setStartScrollY(window.scrollY);
      setStartY(event.touches[0].clientY);
    }

    function handleTouchMove(event: TouchEvent) {
      if (!element || window.scrollY > startScrollY) return;
      const moveY = event.touches[0].clientY;
      const pullDistance = moveY - startY;

      if (element.scrollTop === 0 && pullDistance > 0) {
        if (pullDistance > 80) {
          element.style.position = "relative";
          element.style.top = "40px";
          element.style.transition = "0.3s";
          setRefreshing(true);
        }
      }
    }

    function handleTouchEnd() {
      if (refreshing) {
        if (onRefresh) {
          onRefresh().then(() => {
            if (!element) return;
            setRefreshing(false);
            element.style.position = "";
            element.style.top = "0";
          });
        }
      }
    }

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [refreshing, startY, el, onRefresh, startScrollY]);

  return (
    <div className="w-full text-center">
      {refreshing && <SpinnerComponent />}
    </div>
  );
};

export default PullToRefresh;
