import axios from "axios";

export const directionApi = async (
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
): Promise<{ latitude: number; longitude: number }[]> => {
  let result: { latitude: number; longitude: number }[] = [];
  const response = await axios.post(
    "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
    {
      header: {
        appKey: import.meta.env.VITE_TMAP_API_KEY,
      },
      body: {
        startX: start.longitude,
        startY: start.latitude,
        endX: end.longitude,
        endY: end.latitude,
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startName: "출발지",
        endName: "도착지",
      },
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
