import axios from "axios";

export const directionApi = async (
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
): Promise<{ latitude: number; longitude: number }[]> => {
  let result: { latitude: number; longitude: number }[] = [];
  const response = await axios.post(
    "http://limnyn.asuscomm.com:19980/tmap-pedestrian/",
    {
      startX: start.longitude,
      startY: start.latitude,
      startName: "출발지",
      endX: end.longitude,
      endY: end.latitude,
      endName: "도착지",
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response["data"]["features"].forEach((feature: any) => {
    if (feature["geometry"]["type"] == "LineString") {
      feature["geometry"]["coordinates"].forEach(
        (coord: number[]) =>
          (result = result.concat({ latitude: coord[1], longitude: coord[0] }))
      );
    }
  });

  return result;
};
