type OwnProps = {
  img: React.ReactElement;
  border?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Avatar = ({ border, img, onClick, className }: OwnProps) => {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full ${
        border ?? "border-2 border-blue"
      } ${className}`}
      onClick={onClick}
    >
      {img}
    </div>
  );
};
