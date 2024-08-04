import React, { useContext, useEffect, useReducer, useState } from "react";
import { Dispatch } from "react";
import { calculateZoomLevel } from "./zoom";

/* ----------------- 액션 타입 ------------------ */
const INIT = "naver/maps/INIT" as const;
const MOVE_TO_CENTER = "naver/maps/MOVE_TO_CENTER" as const;
const ADD_MARKER = "naver/maps/ADD_MARKER" as const;
const REMOVE_MARKER = "naver/maps/REMOVE_MARKER" as const;
const UPDATE_MARKER = "naver/maps/UPDATE_MARKER" as const;
const UPDATE_MARKER_LIST = "naver/maps/UPDATE_MARKER_LIST" as const;
const CLEAR_MARKER = "naver/maps/CLEAR_MARKER" as const;
const FOCUS_MARKER = "naver/maps/FOCUS_MARKER" as const;
const ADD_POLYLINE = "naver/maps/ADD_POLYLINE" as const;
const REMOVE_POLYLINE = "naver/maps/REMOVE_POLYLINE" as const;
const CLEAR_POLYLINE = "naver/maps/CLEAR_POLYLINE" as const;

/* ----------------- 액션 생성 함수 ------------------ */
export const init = (map: naver.maps.Map) => ({ type: INIT, map });

export const moveToCenter = (mapDim: number) => ({
  type: MOVE_TO_CENTER,
  mapDim,
});

export const addMarker = (data: {
  latitude: number;
  longitude: number;
  title?: string;
  ondragend?: (marker: naver.maps.Marker) => void;
}) => ({
  type: ADD_MARKER,
  data: data,
});

export const removeMarker = (index: number) => ({
  type: REMOVE_MARKER,
  index,
});

export const updateMarker = (
  index: number,
  data?: { latitude?: number; longitude?: number; title?: string }
) => ({
  type: UPDATE_MARKER,
  index,
  data,
});

export const updateMarkerList = (list?: naver.maps.Marker[]) => ({
  type: UPDATE_MARKER_LIST,
  list,
});

export const clearMarker = () => ({ type: CLEAR_MARKER });

export const focusMarker = (index: number) => ({
  type: FOCUS_MARKER,
  index: index,
});

export const addPolyline = (
  latlngs: { longitude: number; latitude: number }[]
) => ({
  type: ADD_POLYLINE,
  latlngs: latlngs,
});

export const removePolyline = (index: number) => ({
  type: REMOVE_POLYLINE,
  index,
});

export const clearPolyline = () => ({ type: CLEAR_POLYLINE });

type NaverMapAction =
  | ReturnType<typeof init>
  | ReturnType<typeof moveToCenter>
  | ReturnType<typeof addMarker>
  | ReturnType<typeof removeMarker>
  | ReturnType<typeof updateMarker>
  | ReturnType<typeof clearMarker>
  | ReturnType<typeof focusMarker>
  | ReturnType<typeof updateMarkerList>
  | ReturnType<typeof addPolyline>
  | ReturnType<typeof removePolyline>
  | ReturnType<typeof clearPolyline>;

type NaverMapDispatch = Dispatch<NaverMapAction>;

/* ----------------- 모듈 상태 타입 ------------------ */
type NaverMapStateType = {
  map?: naver.maps.Map;
  markers: naver.maps.Marker[];
  infoWindows: naver.maps.InfoWindow[];
  polylines: naver.maps.Polyline[];
};

const initialState: NaverMapStateType = {
  markers: [],
  infoWindows: [],
  polylines: [],
};

/* ----------------- 리듀서 ------------------ */
export default function NaverMapReducer(
  state = initialState,
  action: NaverMapAction
) {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        map: action.map,
      };
    case MOVE_TO_CENTER: {
      const center = { x: 0, y: 0 };

      state.markers.forEach((marker) => {
        center.x += marker.getPosition().x;
        center.y += marker.getPosition().y;
      });
      center.x /= state.markers.length;
      center.y /= state.markers.length;

      const zoom = calculateZoomLevel(
        state.markers.map((marker) => {
          return {
            x: marker.getPosition().x,
            y: marker.getPosition().y,
          };
        }),
        action.mapDim
      );

      state.map?.setZoom(zoom);
      state.map?.panTo(center, { duration: 0 });
      return state;
    }
    case ADD_MARKER: {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          action.data.latitude,
          action.data.longitude
        ),
        title: action.data.title ?? `경유지 ${state.markers.length + 1}`,
        map: state.map,
        draggable: action.data.ondragend ? true : false,
        icon: {
          url: "/src/assets/icons/custom_marker.svg",
          scaledSize: new naver.maps.Size(44, 66),
        },
      });

      const infowindow = new naver.maps.InfoWindow({
        // TODO : infowindow 꾸미기
        content: `
          <style>
            .balloon {
              position: relative;
              background-color: #ffffff;
              border-radius: 10px;
              padding: 15px;
              max-width: 300px;
              margin: 20px;
              box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            }

            .balloon::after {
              content: "";
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              border-width: 10px 7px 0;
              border-style: solid;
              border-color: #ffffff transparent transparent;
              display: block;
              width: 0;
            }
          </style>
          <div class="balloon">${marker.getTitle()}</div>
          `,
        borderWidth: 0,
        disableAnchor: true,
        backgroundColor: "transparent",
      });

      // TODO : 마커 이벤트 안되는거 해결하기

      naver.maps.Event.addListener(marker, "mouseover", () => {
        infowindow.open(state.map!, marker);
      });

      naver.maps.Event.addListener(marker, "mouseout", () => {
        infowindow.close();
      });

      naver.maps.Event.addListener(marker, "dragend", () => {
        action.data.ondragend!(marker);
      });

      naver.maps.Event.addListener(marker, "click", () => {
        state.map?.panTo(marker.getPosition());
      });

      return {
        ...state,
        markers: state.markers.concat(marker),
        infoWindows: state.infoWindows.concat(infowindow),
      };
    }
    case REMOVE_MARKER: {
      state.markers[action.index].setMap(null);
      return {
        ...state,
        markers: state.markers.filter((_, index) => index != action.index),
        infoWindows: state.infoWindows.filter(
          (_, index) => index != action.index
        ),
      };
    }
    case UPDATE_MARKER: {
      const marker = state.markers[action.index];
      if (action.data?.title) {
        marker.setTitle(action.data.title);
        state.infoWindows[action.index].setContent(action.data.title);
      }
      if (action.data?.latitude && action.data?.longitude) {
        marker.setPosition(
          new naver.maps.LatLng(action.data.latitude, action.data.longitude)
        );
      }
      return {
        ...state,
        markers: [...state.markers],
      };
    }
    case CLEAR_MARKER: {
      state.markers.forEach((marker) => marker.setMap(null));
      return {
        ...state,
        markers: [],
      };
    }
    case FOCUS_MARKER: {
      state.map?.panTo(state.markers[action.index].getPosition());
      return state;
    }
    case UPDATE_MARKER_LIST: {
      return {
        ...state,
        markers: [...(action.list ?? state.markers)],
      };
    }
    case ADD_POLYLINE: {
      const polyline = new naver.maps.Polyline({
        path: action.latlngs.map(
          ({ latitude, longitude }) =>
            new naver.maps.LatLng(latitude, longitude)
        ),
        map: state.map,
        strokeColor: "#2B2F40",
        strokeWeight: 2,
      });
      return {
        ...state,
        polylines: state.polylines.concat(polyline),
      };
    }
    case REMOVE_POLYLINE: {
      state.polylines[action.index].setMap(null);
      return {
        ...state,
        number: state.polylines.filter((_, index) => index != action.index),
      };
    }
    case CLEAR_POLYLINE: {
      state.polylines.forEach((polyline) => polyline.setMap(null));
      return {
        ...state,
        polylines: [],
      };
    }
    default:
      return state;
  }
}

const StateContext = React.createContext<NaverMapStateType | null>(null);

const DispatcherContext = React.createContext<NaverMapDispatch | null>(null);

export const NaverMapProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isScriptLoad, setIsScriptLoad] = useState<boolean>(false);
  const [state, dispatch] = useReducer(NaverMapReducer, initialState);

  // load naver map js script
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${
      import.meta.env.VITE_NAVER_MAPS_API_KEY
    }`;
    script.onload = () => setIsScriptLoad(true);
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {isScriptLoad && (
        <StateContext.Provider value={state}>
          <DispatcherContext.Provider value={dispatch}>
            {children}
          </DispatcherContext.Provider>
        </StateContext.Provider>
      )}
    </>
  );
};

/* ----------------- Hook ------------------ */
export function useNaverMapState() {
  const state = useContext(StateContext);
  if (!state) throw new Error("Naver Map : Cannot find StateContext"); // 유효하지 않을땐 에러를 발생
  return state;
}

export function useNaverMapDispatch() {
  const dispatch = useContext(DispatcherContext);
  if (!dispatch) throw new Error("Naver Map : Cannot find DispatcherContext"); // 유효하지 않을땐 에러를 발생
  return dispatch;
}
