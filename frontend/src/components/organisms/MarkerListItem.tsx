export enum MarkerType {
  Start,
  End,
  WayPoint,
}

export type OwnProps = {
  type: MarkerType;
  title: string;
};

export const MarkerListItem = ({ type, title }: OwnProps) => {
  return (
    <>
      {type} {title}
    </>
  );
};
