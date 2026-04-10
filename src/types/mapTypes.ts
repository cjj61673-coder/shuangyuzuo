export interface PointOfInterest {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
}

export interface Bounds {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  terrainType: string;
  levelMin: number;
  levelMax: number;
  pointsOfInterest: PointOfInterest[];
  bounds: Bounds;
}

export interface MapSettings {
  backgroundColor: string;
  gridEnabled: boolean;
  zoomLevel: number;
}

export interface MapData {
  regions: Region[];
  settings: MapSettings;
}
