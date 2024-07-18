import React, { useState } from "react";
import {
  DropDownComponent,
  ItemComponentProps,
} from "../../util/beautiful_dnd/DropDownComponent";
import { Coordinate } from "../../util/maps/geolocation/Coordinate";

const initialItems = [
  { latitude: 1, longitude: 2 },
  { latitude: 2, longitude: 3 },
  { latitude: 3, longitude: 4 },
  { latitude: 4, longitude: 5 },
  { latitude: 5, longitude: 6 },
];

const MarkerList: React.FC = () => {
  const [items, setItems] = useState(initialItems);

  return (
    <DropDownComponent
      onDragEndCallback={setItems}
      items={items}
      ItemComponent={ItemComponent}
    ></DropDownComponent>
  );
};

const ItemComponent = ({ item }: ItemComponentProps<Coordinate>) => {
  return (
    <h3>
      {item.latitude} {item.longitude}
    </h3>
  );
};

export default MarkerList;
