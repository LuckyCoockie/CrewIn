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
  lng: number;
  lat: number;
  zoom?: number;
};

const NaverMap: React.FC<props> = ({ lat, lng, zoom }: props) => {
  const { markers } = useNaverMapState();
  const dispatch = useNaverMapDispatch();

  // init map with lat, lng
  const initMap = useCallback(() => {
    const map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(lat, lng),
      zoom: zoom ?? 17,
    });

    dispatch(init(map));

    map.addListener("click", (event) => {
      const { y, x } = event.coord;
      dispatch(
        addMarker({
          longitude: x,
          latitude: y,
          title: `새로운 경유지`,
          ondragend: () => dispatch(updateMarkerList()),
        })
      );
    });
  }, [dispatch, lat, lng, zoom]);

  // update polyline on markers update
  useEffect(() => {
    dispatch(clearPolyline());
    if (markers.length > 1) {
      const polyline = markers.map((marker) => {
        const coord = marker.getPosition();
        return { longitude: coord.x, latitude: coord.y };
      });

      dispatch(addPolyline(polyline));
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
