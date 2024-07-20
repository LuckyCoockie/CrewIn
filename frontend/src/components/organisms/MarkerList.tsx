import React from "react";
import { DndComponent } from "../../util/beautiful_dnd/DndComponent";
import { MarkerListItem } from "../molecules/MarkerListItem";
import {
  focusMarker,
  removeMarker,
  updateMarker,
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "../../util/maps/naver_map/context";

const MarkerList: React.FC = () => {
  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  const onListItemClick = (index: number) => {
    dispatch(focusMarker(index));
  };

  const onListItemDelete = (index: number) => {
    dispatch(removeMarker(index));
  };

  return markers.length == 0 ? (
    <p className="mt-4">지도를 사용해서 나만의 러닝 경로를 만들어보세요</p>
  ) : (
    <DndComponent
      onDragEndCallback={(markers) => dispatch(updateMarkerList(markers))}
      items={markers}
    >
      {({ index, item }) => (
        <MarkerListItem
          title={item.getTitle()}
          marker={"./src/assets/icons/marker-default.png"}
          first={index === 0}
          last={index === markers.length - 1}
          onClick={() => onListItemClick(index)}
          onChange={(title) => dispatch(updateMarker(index, { title }))}
          onDelete={() => onListItemDelete(index)}
        />
      )}
    </DndComponent>
  );
};

export default MarkerList;
