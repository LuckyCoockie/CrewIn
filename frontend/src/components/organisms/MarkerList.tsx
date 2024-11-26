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
import { ReactComponent as MarkerIcon } from "../../assets/icons/custom_marker.svg";
import { ReactComponent as StartMarkerIcon } from "../../assets/icons/custom_marker_start.svg";
import { ReactComponent as EndMarkerIcon } from "../../assets/icons/custom_marker_end.svg";

type OwnProps = {
  editable?: boolean;
};

const MarkerList: React.FC<OwnProps> = ({ editable = true }) => {
  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  const onListItemClick = (index: number) => {
    dispatch(focusMarker(index));
  };

  const onListItemDelete = (index: number) => {
    dispatch(removeMarker(index));
  };

  return markers.length == 0 ? (
    <p className="mt-4 text-gray-400">지도를 사용해서 나만의 러닝 경로를 만들어보세요</p>
  ) : (
    <DndComponent
      onDragEndCallback={(markers) => dispatch(updateMarkerList(markers))}
      items={markers}
      editable={editable}
    >
      {({ item, index }) => (
        <MarkerListItem
          title={item.getTitle()}
          marker={
            index === 0 ? (
              <StartMarkerIcon className="object-contain" />
            ) : index === markers.length - 1 ? (
              <EndMarkerIcon className="object-contain" />
            ) : (
              <MarkerIcon className="object-contain" />
            )
          }
          first={index === 0}
          last={index === markers.length - 1}
          onClick={() => onListItemClick(index)}
          onChange={(title) => dispatch(updateMarker(index, { title }))}
          onDelete={() => onListItemDelete(index)}
          editable={editable}
        />
      )}
    </DndComponent>
  );
};

export default MarkerList;
