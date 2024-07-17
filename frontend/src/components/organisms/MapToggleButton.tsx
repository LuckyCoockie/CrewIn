import { useEffect, useState } from "react";
import {
  clearPolyline,
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "../../util/maps/naver_map/context";

const MapToggleButton = () => {
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  useEffect(() => {
    if (isDetail) {
      // TODO : tmap api 연결
      dispatch(clearPolyline());
    } else {
      dispatch(updateMarkerList());
    }
  }, [dispatch, isDetail]);

  useEffect(() => {
    setIsDetail(false);
  }, [markers]);

  return (
    <button onClick={() => setIsDetail(!isDetail)}>
      상세보기 {isDetail ? "off" : "on"}
    </button>
  );
};

export default MapToggleButton;
