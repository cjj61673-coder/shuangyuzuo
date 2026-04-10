import { create } from 'zustand';
import { MapData, Region } from '../types/mapTypes';
import { mapDataService } from '../services/mapDataService';

interface MapState {
  // Map data
  mapData: MapData;
  // Current selected region
  selectedRegion: Region | null;
  // Map view state
  zoom: number;
  panX: number;
  panY: number;
  // Editor state
  isEditorMode: boolean;
  // Actions
  loadMapData: () => void;
  selectRegion: (region: Region | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleEditorMode: () => void;
  addRegion: (region: Region) => void;
  updateRegion: (region: Region) => void;
  deleteRegion: (regionId: string) => void;
  updateSettings: (settings: Partial<MapData['settings']>) => void;
}

export const useMapStore = create<MapState>((set) => ({
  // Initial state
  mapData: mapDataService.loadMapData(),
  selectedRegion: null,
  zoom: 1,
  panX: 0,
  panY: 0,
  isEditorMode: false,

  // Actions
  loadMapData: () => {
    const mapData = mapDataService.loadMapData();
    set({ mapData });
  },

  selectRegion: (region) => {
    set({ selectedRegion: region });
  },

  setZoom: (zoom) => {
    set({ zoom });
  },

  setPan: (x, y) => {
    set({ panX: x, panY: y });
  },

  toggleEditorMode: () => {
    set((state) => ({ isEditorMode: !state.isEditorMode }));
  },

  addRegion: (region) => {
    const mapData = mapDataService.addRegion(region);
    set({ mapData });
  },

  updateRegion: (region) => {
    const mapData = mapDataService.updateRegion(region);
    set({ mapData });
  },

  deleteRegion: (regionId) => {
    const mapData = mapDataService.deleteRegion(regionId);
    set({ mapData, selectedRegion: null });
  },

  updateSettings: (settings) => {
    const mapData = mapDataService.updateSettings(settings);
    set({ mapData });
  }
}));
