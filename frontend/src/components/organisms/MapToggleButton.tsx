import { useEffect, useState } from "react";
import {
  addPolyline,
  clearPolyline,
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "../../util/maps/naver_map/context";

import { ToggleSwitch } from "flowbite-react";
import {
  directionApiWithWayPoints,
  DirectionDto,
} from "../../apis/api/tmap/directionApi";

type OwnProps = {
  style?: React.CSSProperties;
  initValue?: boolean;
  onToggle?: (directions?: DirectionDto[]) => void;
};

const MapToggleButton: React.FC<OwnProps> = ({
  style,
  onToggle,
  initValue = false,
}: OwnProps) => {
  const [isDetail, setIsDetail] = useState<boolean>(initValue);

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
      ).then(onToggle);
    } else {
      dispatch(updateMarkerList());
      if (onToggle) onToggle();
    }
  }, [dispatch, isDetail, onToggle]);

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
