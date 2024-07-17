import React from "react";
import { DropDownComponent } from "../../util/beautiful_dnd/DropDownComponent";
import { MarkerListItem } from "../molecules/MarkerListItem";
import {
  removeMarker,
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

  const onListItemDelete = (index: number) => {
    dispatch(removeMarker(index));
  };

  return (
    <DropDownComponent
      onDragEndCallback={(markers) => dispatch(updateMarkerList(markers))}
      items={markers}
    >
      {({ index, item }) => (
        <MarkerListItem
          title={item.getTitle()}
          marker={"./images/alarm-clockblack.png"}
          onClick={() => onListItemClick(index)}
          onDelete={() => onListItemDelete(index)}
        />
      )}
    </DropDownComponent>
  );
};

export default MarkerList;
