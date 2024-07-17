export type OwnProps = {
  title: string;
  index: number;
  onClick: () => void;
};

export const MarkerListItem = ({ title, index, onClick }: OwnProps) => {
  return (
    <div onClick={onClick}>
      {index} {title}
    </div>
  );
};
