import React from "react";
import { DropDownComponent } from "../../util/beautiful_dnd/DropDownComponent";
import { MarkerListItem } from "../molecules/MarkerListItem";
import {
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "../../util/maps/naver_map/context";

const MarkerList: React.FC = () => {
  const { markers, map } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  const onListItemClick = (index: number) => {
    map?.panTo(markers[index].getPosition());
  };

  return (
    <DropDownComponent
      onDragEndCallback={(markers) => dispatch(updateMarkerList(markers))}
      items={markers}
    >
      {({ index, item }) => (
        <MarkerListItem
          title={item.getTitle()}
          index={index}
          onClick={() => onListItemClick(index)}
        />
      )}
    </DropDownComponent>
  );
};

export default MarkerList;
