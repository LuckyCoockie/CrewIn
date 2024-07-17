import { useCallback, useEffect } from "react";
import {
  addMarker,
  addPolyline,
  clearPolyline,
  init,
  updateMarker,
  useNaverMapDispatch,
  useNaverMapState,
} from "./context";

type props = {
  lng: number;
  lat: number;
  zoom?: number;
};

const NaverMap = ({ lat, lng, zoom }: props) => {
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
          ondragend: onMarkerDragEnd,
        })
      );
    });
  }, [dispatch, lat, lng, zoom]);

  const onMarkerDragEnd = (marker: naver.maps.Marker) => {
    // TODO : update polyline when marker drag end
  };

  // update polyline on markers update
  useEffect(() => {
    if (markers.length > 1) {
      dispatch(clearPolyline());

      const polyline = markers.map((marker) => {
        const coord = marker.getPosition();
        return { longitude: coord.x, latitude: coord.y };
      });

      dispatch(addPolyline(polyline));
    }
  }, [dispatch, markers]);

  useEffect(initMap, [initMap]);

  const mapStyle = {
    width: "100vh",
    height: "100vh",
  };

  return <div id="map" style={mapStyle} />;
};

export default NaverMap;
