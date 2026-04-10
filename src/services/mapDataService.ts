import { MapData, Region } from '../types/mapTypes';

const STORAGE_KEY = 'rpg-map-data';

// Mock data for initial map
const mockMapData: MapData = {
  regions: [
    {
      id: 'region-1',
      name: 'Cyber District',
      description: 'A bustling urban area with neon lights and futuristic architecture. Home to the city\'s main market and tech hub.',
      terrainType: 'urban',
      levelMin: 1,
      levelMax: 10,
      pointsOfInterest: [
        {
          id: 'poi-1',
          name: 'Neon Market',
          type: 'market',
          x: 150,
          y: 150
        },
        {
          id: 'poi-2',
          name: 'Tech Tower',
          type: 'landmark',
          x: 200,
          y: 100
        },
        {
          id: 'poi-3',
          name: 'Cyber Bar',
          type: 'tavern',
          x: 100,
          y: 200
        }
      ],
      bounds: {
        x1: 50,
        y1: 50,
        x2: 250,
        y2: 250
      }
    },
    {
      id: 'region-2',
      name: 'Industrial Zone',
      description: 'A gritty industrial area with factories and warehouses. Known for its high-level enemies and valuable loot.',
      terrainType: 'industrial',
      levelMin: 10,
      levelMax: 20,
      pointsOfInterest: [
        {
          id: 'poi-4',
          name: 'Factory Complex',
          type: 'dungeon',
          x: 400,
          y: 150
        },
        {
          id: 'poi-5',
          name: 'Warehouse District',
          type: 'area',
          x: 350,
          y: 200
        }
      ],
      bounds: {
        x1: 300,
        y1: 50,
        x2: 500,
        y2: 250
      }
    },
    {
      id: 'region-3',
      name: 'Residential Area',
      description: 'A quiet residential neighborhood with apartments and parks. Perfect for low-level quests and social interactions.',
      terrainType: 'residential',
      levelMin: 1,
      levelMax: 5,
      pointsOfInterest: [
        {
          id: 'poi-6',
          name: 'Apartments',
          type: 'housing',
          x: 150,
          y: 400
        },
        {
          id: 'poi-7',
          name: 'Park',
          type: 'area',
          x: 200,
          y: 350
        }
      ],
      bounds: {
        x1: 50,
        y1: 300,
        x2: 250,
        y2: 500
      }
    },
    {
      id: 'region-4',
      name: 'Financial District',
      description: 'The financial heart of the city, with skyscrapers and banks. High-level area with valuable rewards.',
      terrainType: 'financial',
      levelMin: 15,
      levelMax: 25,
      pointsOfInterest: [
        {
          id: 'poi-8',
          name: 'Bank Tower',
          type: 'landmark',
          x: 400,
          y: 400
        },
        {
          id: 'poi-9',
          name: 'Stock Exchange',
          type: 'landmark',
          x: 350,
          y: 350
        }
      ],
      bounds: {
        x1: 300,
        y1: 300,
        x2: 500,
        y2: 500
      }
    }
  ],
  settings: {
    backgroundColor: '#1a1a2e',
    gridEnabled: true,
    zoomLevel: 1
  }
};

export const mapDataService = {
  // Load map data from local storage or use mock data
  loadMapData(): MapData {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
    }
    return mockMapData;
  },

  // Save map data to local storage
  saveMapData(data: MapData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving map data:', error);
    }
  },

  // Add a new region
  addRegion(region: Region): MapData {
    const mapData = this.loadMapData();
    mapData.regions.push(region);
    this.saveMapData(mapData);
    return mapData;
  },

  // Update an existing region
  updateRegion(updatedRegion: Region): MapData {
    const mapData = this.loadMapData();
    const index = mapData.regions.findIndex(r => r.id === updatedRegion.id);
    if (index !== -1) {
      mapData.regions[index] = updatedRegion;
      this.saveMapData(mapData);
    }
    return mapData;
  },

  // Delete a region
  deleteRegion(regionId: string): MapData {
    const mapData = this.loadMapData();
    mapData.regions = mapData.regions.filter(r => r.id !== regionId);
    this.saveMapData(mapData);
    return mapData;
  },

  // Update map settings
  updateSettings(settings: Partial<MapData['settings']>): MapData {
    const mapData = this.loadMapData();
    mapData.settings = { ...mapData.settings, ...settings };
    this.saveMapData(mapData);
    return mapData;
  }
};
