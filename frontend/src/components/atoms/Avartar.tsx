type OwnProps = {
  img: string;
  border?: boolean;
  alt?: string;
  onClick?: () => void;
  className?: string;
};

export const Avatar = ({ border, img, alt, onClick, className }: OwnProps) => {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full ${
        border ?? "border-2 border-blue"
      } ${className}`}
      onClick={onClick}
    >
      <img src={img} alt={alt} className="w-6 h-6 object-contain" />
    </div>
  );
};
