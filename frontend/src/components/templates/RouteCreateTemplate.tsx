import { NaverMapProvider } from "../../util/maps/naver_map/context";
import NaverMap from "../../util/maps/naver_map/NaverMap";
import MarkerList from "../organisms/MarkerList";
import MapToggleButton from "../organisms/MapToggleButton";

type OwnProps = {
  initPosition: { latitude: number; longitude: number };
  onSave: (polyline: { latitude: number; longitude: number }[]) => void;
};

const RouteCreateTemplate: React.FC<OwnProps> = ({
  initPosition,
  onSave,
}: OwnProps) => {
  return (
    <NaverMapProvider>
      <NaverMap lng={initPosition.longitude} lat={initPosition.latitude} />
      <div className="p-4">
        <div className="flex justify-between">
          <h2>경로 정보</h2>
          <MapToggleButton />
        </div>
        <MarkerList />
      </div>
      <div>
        {/* TODO : 제목 input 넣기 */}
        {/* TODO : save button 디자인 */}
        <button onClick={() => onSave([])}>저장</button>
      </div>
    </NaverMapProvider>
  );
};

export default RouteCreateTemplate;
