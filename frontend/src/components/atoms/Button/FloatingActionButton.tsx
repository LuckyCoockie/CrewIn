type OwnProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactElement;
};

const FloatingActionButton: React.FC<OwnProps> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <div className="sticky bottom-16 right-4 max-w-[550px] w-full flex justify-end">
      <button
        className={`w-[56px] h-[56px] bg-white text-white font-bold py-4 px-4 rounded-full shadow-lg focus:outline-none hover:ring-2 hover:ring-primary-500 ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

export default FloatingActionButton;
