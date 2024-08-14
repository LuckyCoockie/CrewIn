import { useRef, useState } from "react";
import PullToRefresh from "./PullToRefersh";

type OwnProps = {
  onRefresh?: () => Promise<void>;
  children: React.ReactNode;
};

const PullToRefershComponent = ({ onRefresh, children }: OwnProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [dummy, setDummy] = useState(false);
  const handleRefresh = async () => {
    if (onRefresh) onRefresh().then(() => setDummy(!dummy));
  };

  return (
    <>
      <PullToRefresh el={ref} onRefresh={handleRefresh} />
      {children}
    </>
  );
};

export default PullToRefershComponent;
