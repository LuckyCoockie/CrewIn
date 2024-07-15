import React, { useContext, useEffect, useReducer, useState } from "react";
import { Dispatch } from "react";

/* ----------------- 액션 타입 ------------------ */
const INIT = "naver/maps/INIT" as const;
const ADD_MARKER = "naver/maps/ADD_MARKER" as const;
const REMOVE_MARKER = "naver/maps/REMOVE_MARKER" as const;
const CLEAR_MARKER = "naver/maps/CLEAR_MARKER" as const;
const ADD_POLYLINE = "naver/maps/ADD_POLYLINE" as const;
const REMOVE_POLYLINE = "naver/maps/REMOVE_POLYLINE" as const;
const CLEAR_POLYLINE = "naver/maps/CLEAR_POLYLINE" as const;

/* ----------------- 액션 생성 함수 ------------------ */
export const init = (map: naver.maps.Map) => ({ type: INIT, map });
export const addMarker = (latlng: naver.maps.LatLng) => ({
  type: ADD_MARKER,
  latlng: latlng,
});
export const removeMarker = (index?: number, marker?: naver.maps.Marker) => ({
  type: REMOVE_MARKER,
  index,
  marker,
});
export const clearMarker = () => ({ type: CLEAR_MARKER });
export const addPolyline = (latlngs: naver.maps.LatLng[]) => ({
  type: ADD_POLYLINE,
  latlngs: latlngs,
});
export const removePolyline = (
  index?: number,
  polyline?: naver.maps.Polyline
) => ({
  type: REMOVE_POLYLINE,
  index,
  polyline,
});
export const clearPolyline = () => ({ type: CLEAR_POLYLINE });

type NaverMapAction =
  | ReturnType<typeof init>
  | ReturnType<typeof addMarker>
  | ReturnType<typeof removeMarker>
  | ReturnType<typeof clearMarker>
  | ReturnType<typeof addPolyline>
  | ReturnType<typeof removePolyline>
  | ReturnType<typeof clearPolyline>;

type NaverMapDispatch = Dispatch<NaverMapAction>;

/* ----------------- 모듈 상태 타입 ------------------ */
type NaverMapStateType = {
  map?: naver.maps.Map;
  markers: naver.maps.Marker[];
  polylines: naver.maps.Polyline[];
};

const initialState: NaverMapStateType = {
  markers: [],
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
    case ADD_MARKER: {
      const marker = new naver.maps.Marker({
        position: action.latlng,
        map: state.map,
      });
      return {
        ...state,
        markers: state.markers.concat(marker),
      };
    }
    case REMOVE_MARKER:
      if (action.index) {
        state.markers[action.index].setMap(null);
        return {
          ...state,
          markers: state.markers.filter((_, index) => index != action.index),
        };
      } else if (action.marker) {
        action.marker.setMap(null);
        return {
          ...state,
          markers: state.markers.filter((marker) => marker === action.marker),
        };
      } else {
        return state;
      }
    case CLEAR_MARKER:
      return {
        ...state,
        markers: [],
      };
    case ADD_POLYLINE: {
      const polyline = new naver.maps.Polyline({
        path: action.latlngs,
        map: state.map,
      });
      return {
        ...state,
        polyline: state.polylines.concat(polyline),
      };
    }
    case REMOVE_POLYLINE:
      if (action.index) {
        state.polylines[action.index].setMap(null);
        return {
          ...state,
          number: state.polylines.filter((_, index) => index != action.index),
        };
      } else if (action.polyline) {
        action.polyline.setMap(null);
        return {
          ...state,
          number: state.polylines.filter(
            (polyline) => polyline === action.polyline
          ),
        };
      } else {
        return state;
      }
    case CLEAR_POLYLINE:
      return {
        ...state,
        polyline: [],
      };
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
    script.src =
      `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAPS_API_KEY}`;
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
