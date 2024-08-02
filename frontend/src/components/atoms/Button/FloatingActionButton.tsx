type OwnProps = {
  icon?: React.FunctionComponent;
  className?: string;
  onClick?: () => void;
};

const FloatingActionButton = ({ icon: Icon, className, onClick }: OwnProps) => {
  return (
    <button
      className={`fixed w-[56px] h-[56px] bg-white text-white font-bold py-4 px-4 rounded-full shadow-lg focus:outline-none hover:ring-1 hover:ring-primary-500 ${className}`}
      onClick={onClick}
      style={{
        bottom: "calc(10% + 16px)", // 5%에서 약간의 여유를 추가
        left: "calc(70% + 16px)", // 5%에서 약간의 여유를 추가
      }}
    >
      {Icon ? <Icon /> : ""}
    </button>
  );
};

export default FloatingActionButton;
