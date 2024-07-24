function latLonToPixels(
  lat: number,
  lon: number,
  zoom: number,
  mapDim: number
): { x: number; y: number } {
  const mapSize = mapDim * Math.pow(2, zoom);
  const x = ((lon + 180) / 360) * mapSize;
  const y =
    ((1 -
      Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2)) / Math.PI) /
      2) *
    mapSize;
  return { x, y };
}

export function calculateZoomLevel(
  coords: { y: number; x: number }[],
  mapDim: number
): number {
  const maxZoom = 19;
  for (let zoom = maxZoom; zoom > 0; zoom--) {
    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;

    for (const coord of coords) {
      const { y: lat, x: lon } = coord;
      const { x, y } = latLonToPixels(lat, lon, zoom, mapDim);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const width = maxX - minX;
    const height = maxY - minY;

    if (width <= mapDim && height <= mapDim) {
      return zoom;
    }
  }
  return maxZoom;
}
