export type OwnProps = {
  title: string;
  index: number;
};

export const MarkerListItem = ({ title, index }: OwnProps) => {
  return (
    <>
      {index} {title}
    </>
  );
};
