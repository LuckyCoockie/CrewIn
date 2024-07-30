import { useEffect, useState } from "react";
import {
  addPolyline,
  clearPolyline,
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "../../util/maps/naver_map/context";

import { ToggleSwitch } from "flowbite-react";
import { directionApiWithWayPoints } from "../../util/maps/tmap/apis/api/directionApi";

type OwnProps = { style?: React.CSSProperties };

const MapToggleButton: React.FC<OwnProps> = ({ style }: OwnProps) => {
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  const markerToPoint = (marker: naver.maps.Marker) => {
    const position = marker.getPosition();
    return { latitude: position.y, longitude: position.x };
  };

  useEffect(() => {
    if (isDetail) {
      dispatch(clearPolyline());
      const waypoints = markers.map(markerToPoint);
      directionApiWithWayPoints(waypoints, (direction) =>
        dispatch(addPolyline(direction.polyline))
      );
    } else {
      dispatch(updateMarkerList());
    }
  }, [dispatch, isDetail]);

  useEffect(() => {
    setIsDetail(false);
  }, [markers]);

  return (
    <div style={style}>
      <ToggleSwitch
        checked={isDetail}
        label="상세보기"
        onChange={setIsDetail}
        color="primary"
        className="p-2 rounded-full"
      />
    </div>
  );
};

export default MapToggleButton;
