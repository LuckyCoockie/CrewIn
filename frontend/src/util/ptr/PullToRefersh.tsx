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
    function handleTouchStart(event: any) {
      setStartY(event.touches[0].clientY);
    }

    function handleTouchMove(event: any) {
      if (!el.current) return;
      const moveY = event.touches[0].clientY;
      const pullDistance = moveY - startY;

      if (pullDistance > 0) {
        event.preventDefault();

        if (pullDistance > 80) {
          el.current.style.transform = "translate(0, 40px)";
          el.current.style.transition = "0.3s";
          setRefreshing(true);
        }
      }
    }

    function handleTouchEnd() {
      if (refreshing) {
        if (onRefresh) {
          onRefresh().then(() => {
            if (!el.current) return;
            setRefreshing(false);
            el.current.style.transform = "translate(0,0)";
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
  }, [refreshing, startY, el, onRefresh]);

  return (
    <div className="w-full text-center">
      {refreshing && <SpinnerComponent />}
    </div>
  );
};

export default PullToRefresh;
