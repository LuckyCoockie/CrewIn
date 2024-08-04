import { useCallback, useEffect } from "react";
import {
  addMarker,
  addPolyline,
  clearPolyline,
  init,
  updateMarkerList,
  useNaverMapDispatch,
  useNaverMapState,
} from "./context";

type props = {
  initPosition?: { lat: number; lng: number };
  zoom?: number;
  onChange?: (
    markers: { title: string; point: { latitude: number; longitude: number } }[]
  ) => void;
};

const NaverMap: React.FC<props> = ({
  initPosition: initPoint,
  zoom,
  onChange,
}: props) => {
  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  // init map with lat, lng
  const initMap = useCallback(() => {
    const map = new naver.maps.Map("map", {
      center: initPoint,
      zoom: zoom ?? 14,
    });

    dispatch(init(map));

    map.addListener("click", (event) => {
      const { y, x } = event.coord;
      dispatch(
        addMarker({
          longitude: x,
          latitude: y,
          ondragend: () => dispatch(updateMarkerList()),
        })
      );
    });
  }, [dispatch, initPoint, zoom]);

  // update polyline on markers update
  useEffect(() => {
    dispatch(clearPolyline());
    if (markers.length > 1) {
      const polyline = markers.map((marker) => {
        const coord = marker.getPosition();
        return { longitude: coord.x, latitude: coord.y };
      });

      dispatch(addPolyline(polyline));

      const markerList = markers.map((marker) => {
        const coord = marker.getPosition();
        return {
          title: marker.getTitle(),
          point: { longitude: coord.x, latitude: coord.y },
        };
      });
      if (onChange) onChange(markerList);
    }
  }, [dispatch, markers]);

  useEffect(initMap, [initMap]);

  const mapStyle = {
    width: "500px",
    height: "500px",
  };

  return <div id="map" style={mapStyle} />;
};

export default NaverMap;
