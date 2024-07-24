import React from "react";

export interface ItemComponentProps<T> {
  index: number;
  item: T;
}

export type OwnProps<T> = {
  items: T[];
  children: (props: ItemComponentProps<T>) => React.ReactElement<HTMLElement>;
};

const GridListComponent = <T,>({
  items,
  children: ItemComponent,
}: OwnProps<T>) => {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      {items.map((item, index) => (
        <ItemComponent key={index} index={index} item={item} />
      ))}
    </div>
  );
};

export default GridListComponent;
