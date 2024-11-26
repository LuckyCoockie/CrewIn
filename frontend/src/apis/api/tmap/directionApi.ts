import api from "./instance";


export type Point = { latitude: number; longitude: number };

export type DirectionDto = { polyline: Point[]; distance: number };

export const directionApi = async (
  routes: { startX: number; startY: number; endX: number; endY: number; startName: string; endName: string; reqCoordType: string; resCoordType: string }[]
): Promise<DirectionDto[]> => {
  const result: DirectionDto[] = [];
  const response = await api.post("/course/pedestrian", {
    routes: routes.map(route => ({
      startX: route.startX,
      startY: route.startY,
      endX: route.endX,
      endY: route.endY,
      reqCoordType: route.reqCoordType,
      resCoordType: route.resCoordType,
      startName: route.startName,
      endName: route.endName,
    })),
  });

  response.data.routes.forEach((route: any) => {
    const directionDto: DirectionDto = { polyline: [], distance: 0 };

    route.features.forEach((feature: any) => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach((coord: number[]) =>
          directionDto.polyline.push({
            latitude: coord[1],
            longitude: coord[0],
          })
        );
        directionDto.distance += feature.properties.distance;
      }
    });

    result.push(directionDto);
  });

  return result;
};

export async function directionApiWithWayPoints(
  waypoints: Point[],
  callback: (result: DirectionDto) => void
) {
  const routes = waypoints.map((point, index) => {
    if (index === 0) return null;
    return {
      startX: waypoints[index - 1].longitude,
      startY: waypoints[index - 1].latitude,
      endX: point.longitude,
      endY: point.latitude,
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      startName: `출발지${index}`,
      endName: `도착지${index}`,
    };
  }).filter(Boolean);

  const results = await directionApi(routes as any);
  
  results.forEach(result => {
    callback(result);
  });

  return results;
}
