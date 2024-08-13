import api from "../utils/instance";

export type Point = { latitude: number; longitude: number };

export type DirectionDto = { polyline: Point[]; distance: number };

export const directionApi = async (
  start: Point,
  end: Point,
  token?: string | null
): Promise<DirectionDto> => {
  const result: DirectionDto = { polyline: [], distance: 0 };

  const response = await api.post(
    "/tmap-pedestrian/",
    {
      startX: start.longitude,
      startY: start.latitude,
      startName: "출발지",
      endX: end.longitude,
      endY: end.latitude,
      endName: "도착지",
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  response["data"]["features"].forEach((feature: any) => {
    if (feature["geometry"]["type"] == "LineString") {
      feature["geometry"]["coordinates"].forEach((coord: number[]) =>
        result.polyline.push({
          latitude: coord[1],
          longitude: coord[0],
        })
      );
      result.distance += feature["properties"]["distance"];
    }
  });

  return result;
};

export async function directionApiWithWayPoints(
  waypoints: Point[],
  callback: (result: DirectionDto) => void,
  token?: string | null
) {
  const result: DirectionDto[] = [];
  const promises: Promise<DirectionDto>[] = [];

  for (let i = 1; i < waypoints.length; i++) {
    const promise = directionApi(waypoints[i - 1], waypoints[i], token);
    promises.push(promise);
    promise.then((direction) => {
      callback(direction);
      result.push(direction);
    });
  }

  await Promise.all(promises);
  return result;
}
