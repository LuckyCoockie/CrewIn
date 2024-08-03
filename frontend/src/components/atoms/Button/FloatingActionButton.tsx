type OwnProps = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactElement;
};

const FloatingActionButton: React.FC<OwnProps> = ({
  className,
  onClick,
  children,
}) => {
  return (
      <button
        className={`fixed w-[56px] h-[56px] bg-white text-white font-bold py-4 px-4 rounded-full shadow-lg focus:outline-none hover:ring-1 hover:ring-primary-500 ${className}`}
        onClick={onClick}
        style={{
          bottom: "calc(10% + 16px)", // 5%에서 약간의 여유를 추가
          left: "calc(70% + 16px)", // 5%에서 약간의 여유를 추가
        }}
      >
        {children}
      </button>
  );
};

export default FloatingActionButton;
