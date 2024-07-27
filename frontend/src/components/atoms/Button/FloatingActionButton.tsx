type OwnProps = {
  icon?: React.FunctionComponent;
  className?: string;
  onClick?: () => void;
};

const FloatingActionButton = ({ icon: Icon, className, onClick }: OwnProps) => {
  return (
    <div className="sticky bottom-16 right-4 max-w-[550px] w-full flex justify-end">
      <button
        className={`w-[56px] h-[56px] bg-white text-white font-bold py-4 px-4 rounded-full shadow-lg focus:outline-none hover:ring-1 hover:ring-primary-500 ${className}`}
        onClick={onClick}
      >
        {Icon ? <Icon /> : ""}
      </button>
    </div>
  );
};

export default FloatingActionButton;
