import axios from "axios";

export type Point = { latitude: number; longitude: number };

export const directionApi = async (
  start: Point,
  end: Point
): Promise<Point[]> => {
  let result: Point[] = [];
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

export async function directionApiWithWayPoints(
  waypoints: Point[],
  callback: (polyline: Point[]) => void
) {
  const result: Point[][] = [];
  const promises: Promise<Point[]>[] = [];

  for (let i = 1; i < waypoints.length; i++) {
    const promise = directionApi(waypoints[i - 1], waypoints[i]);
    promises.push(promise);
    promise.then((polyline) => {
      callback(polyline);
      result.push(polyline);
    });
  }

  await Promise.all(promises);
  return result;
}
