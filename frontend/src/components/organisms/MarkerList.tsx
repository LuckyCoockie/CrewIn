import React, { useEffect, useState } from "react";
import {
  DropDownComponent,
  ItemComponentProps,
} from "../../util/beautiful_dnd/DropDownComponent";
import { MarkerListItem } from "../molecules/MarkerListItem";
import {
  clearPolyline,
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "../../util/maps/naver_map/context";

const MarkerList: React.FC = () => {
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  useEffect(() => {
    if (isDetail) {
      dispatch(clearPolyline());
    } else {
      dispatch(updateMarkerList(markers));
    }
  }, [isDetail]);

  return (
    <>
      <button onClick={() => setIsDetail(!isDetail)}>
        상세보기 {isDetail ? "off" : "on"}
      </button>
      <DropDownComponent
        onDragEndCallback={(markers) => dispatch(updateMarkerList(markers))}
        items={markers}
        ItemComponent={ItemComponent}
      ></DropDownComponent>
    </>
  );
};

const ItemComponent = ({ item }: ItemComponentProps<naver.maps.Marker>) => {
  return (
    <>
      <MarkerListItem title={item.getTitle()} index={0}></MarkerListItem>
    </>
  );
};

export default MarkerList;
