import { useEffect, useState } from "react";
import {
  addPolyline,
  clearPolyline,
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "../../util/maps/naver_map/context";

import { ToggleSwitch } from "flowbite-react";
import { directionApi } from "../../util/maps/tmap/api";

const MapToggleButton: React.FC = () => {
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  useEffect(() => {
    if (isDetail) {
      dispatch(clearPolyline());
      for (let i = 1; i < markers.length; i++) {
        directionApi(
          {
            latitude: markers[i - 1].getPosition().y,
            longitude: markers[i - 1].getPosition().x,
          },
          {
            latitude: markers[i].getPosition().y,
            longitude: markers[i].getPosition().x,
          }
        ).then((polyline) => dispatch(addPolyline(polyline)));
      }
    } else {
      dispatch(updateMarkerList());
    }
  }, [dispatch, isDetail]);

  useEffect(() => {
    setIsDetail(false);
  }, [markers]);

  return (
    <ToggleSwitch checked={isDetail} label="상세보기" onChange={setIsDetail} />
  );
};

export default MapToggleButton;
