import React, { useState } from 'react';
import { useMapStore } from '../store/mapStore';
import { Region, PointOfInterest } from '../types/mapTypes';
import { X, Plus, Trash2, Save, MapPin } from 'lucide-react';

const MapEditor: React.FC = () => {
  const { mapData, selectedRegion, addRegion, updateRegion, deleteRegion, selectRegion } = useMapStore();
  
  // Editor state
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [newRegion, setNewRegion] = useState<Omit<Region, 'id'>>({ 
    name: '',
    description: '',
    terrainType: 'urban',
    levelMin: 1,
    levelMax: 10,
    pointsOfInterest: [],
    bounds: { x1: 0, y1: 0, x2: 100, y2: 100 }
  });
  
  // New POI state
  const [newPOI, setNewPOI] = useState<Omit<PointOfInterest, 'id'>>({ 
    name: '',
    type: 'landmark',
    x: 0,
    y: 0
  });

  // Handle start adding region
  const handleStartAddRegion = () => {
    setIsAddingRegion(true);
    setNewRegion({ 
      name: '',
      description: '',
      terrainType: 'urban',
      levelMin: 1,
      levelMax: 10,
      pointsOfInterest: [],
      bounds: { x1: 0, y1: 0, x2: 100, y2: 100 }
    });
  };

  // Handle start editing region
  const handleStartEditRegion = (region: Region) => {
    setEditingRegion(region);
    setNewRegion({ 
      name: region.name,
      description: region.description,
      terrainType: region.terrainType,
      levelMin: region.levelMin,
      levelMax: region.levelMax,
      pointsOfInterest: [...region.pointsOfInterest],
      bounds: { ...region.bounds }
    });
  };

  // Handle save region
  const handleSaveRegion = () => {
    if (!newRegion.name) return;
    
    if (editingRegion) {
      // Update existing region
      updateRegion({
        ...editingRegion,
        ...newRegion
      });
      setEditingRegion(null);
    } else {
      // Add new region
      const region: Region = {
        ...newRegion,
        id: `region-${Date.now()}`
      };
      addRegion(region);
      setIsAddingRegion(false);
    }
  };

  // Handle delete region
  const handleDeleteRegion = (regionId: string) => {
    if (window.confirm('Are you sure you want to delete this region?')) {
      deleteRegion(regionId);
      setEditingRegion(null);
    }
  };

  // Handle add POI
  const handleAddPOI = () => {
    if (!newPOI.name) return;
    
    const poi: PointOfInterest = {
      ...newPOI,
      id: `poi-${Date.now()}`
    };
    
    setNewRegion({
      ...newRegion,
      pointsOfInterest: [...newRegion.pointsOfInterest, poi]
    });
    
    setNewPOI({ 
      name: '',
      type: 'landmark',
      x: 0,
      y: 0
    });
  };

  // Handle delete POI
  const handleDeletePOI = (poiId: string) => {
    setNewRegion({
      ...newRegion,
      pointsOfInterest: newRegion.pointsOfInterest.filter(poi => poi.id !== poiId)
    });
  };

  return (
    <div className="absolute top-4 left-4 right-4 md:left-1/2 bg-[#16213e]/80 backdrop-blur-md rounded-lg border border-[#e94560] shadow-lg p-4 z-10 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white font-orbitron">Map Editor</h2>
        <button
          onClick={() => {
            setIsAddingRegion(false);
            setEditingRegion(null);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Region list */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-2">Regions</h3>
        <div className="space-y-2">
          {mapData.regions.map((region) => (
            <div key={region.id} className="flex items-center justify-between bg-[#1a1a2e] p-2 rounded border border-[#00b894]">
              <div>
                <div className="font-medium text-white">{region.name}</div>
                <div className="text-xs text-gray-400">Lv {region.levelMin}-{region.levelMax}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartEditRegion(region)}
                  className="text-[#00b894] hover:text-white transition-colors"
                  title="Edit"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => handleDeleteRegion(region.id)}
                  className="text-[#e94560] hover:text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleStartAddRegion}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-[#0f3460] hover:bg-[#16213e] text-white p-2 rounded border border-[#00b894] transition-colors"
        >
          <Plus size={16} />
          <span>Add New Region</span>
        </button>
      </div>

      {/* Region editor */}
      {(isAddingRegion || editingRegion) && (
        <div className="bg-[#1a1a2e] p-4 rounded border border-[#00b894]">
          <h3 className="text-white font-semibold mb-3">{editingRegion ? 'Edit Region' : 'Add New Region'}</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Region Name</label>
              <input
                type="text"
                value={newRegion.name}
                onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                className="w-full bg-[#0f3460] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                placeholder="Enter region name"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                value={newRegion.description}
                onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
                className="w-full bg-[#0f3460] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                placeholder="Enter region description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Terrain Type</label>
                <select
                  value={newRegion.terrainType}
                  onChange={(e) => setNewRegion({ ...newRegion, terrainType: e.target.value })}
                  className="w-full bg-[#0f3460] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                >
                  <option value="urban">Urban</option>
                  <option value="industrial">Industrial</option>
                  <option value="residential">Residential</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Level Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newRegion.levelMin}
                    onChange={(e) => setNewRegion({ ...newRegion, levelMin: parseInt(e.target.value) || 1 })}
                    className="w-1/2 bg-[#0f3460] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    min="1"
                  />
                  <span className="text-gray-400 flex items-center">-</span>
                  <input
                    type="number"
                    value={newRegion.levelMax}
                    onChange={(e) => setNewRegion({ ...newRegion, levelMax: parseInt(e.target.value) || 10 })}
                    className="w-1/2 bg-[#0f3460] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    min="1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Bounds</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Top Left (x, y)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newRegion.bounds.x1}
                      onChange={(e) => setNewRegion({ ...newRegion, bounds: { ...newRegion.bounds, x1: parseInt(e.target.value) || 0 } })}
                      className="w-1/2 bg-[#0f3460] text-white p-1 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    />
                    <input
                      type="number"
                      value={newRegion.bounds.y1}
                      onChange={(e) => setNewRegion({ ...newRegion, bounds: { ...newRegion.bounds, y1: parseInt(e.target.value) || 0 } })}
                      className="w-1/2 bg-[#0f3460] text-white p-1 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Bottom Right (x, y)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newRegion.bounds.x2}
                      onChange={(e) => setNewRegion({ ...newRegion, bounds: { ...newRegion.bounds, x2: parseInt(e.target.value) || 100 } })}
                      className="w-1/2 bg-[#0f3460] text-white p-1 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    />
                    <input
                      type="number"
                      value={newRegion.bounds.y2}
                      onChange={(e) => setNewRegion({ ...newRegion, bounds: { ...newRegion.bounds, y2: parseInt(e.target.value) || 100 } })}
                      className="w-1/2 bg-[#0f3460] text-white p-1 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Points of Interest</label>
              <div className="space-y-2 mb-3">
                {newRegion.pointsOfInterest.map((poi) => (
                  <div key={poi.id} className="flex items-center justify-between bg-[#0f3460] p-2 rounded">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#feca57]" />
                      <span className="text-white">{poi.name}</span>
                      <span className="text-xs text-gray-400">({poi.type})</span>
                    </div>
                    <button
                      onClick={() => handleDeletePOI(poi.id)}
                      className="text-[#e94560] hover:text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="bg-[#0f3460] p-3 rounded border border-dashed border-gray-700">
                <h4 className="text-sm text-white mb-2">Add New Point of Interest</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newPOI.name}
                    onChange={(e) => setNewPOI({ ...newPOI, name: e.target.value })}
                    className="w-full bg-[#1a1a2e] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    placeholder="POI name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newPOI.type}
                      onChange={(e) => setNewPOI({ ...newPOI, type: e.target.value })}
                      className="bg-[#1a1a2e] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                    >
                      <option value="landmark">Landmark</option>
                      <option value="market">Market</option>
                      <option value="tavern">Tavern</option>
                      <option value="dungeon">Dungeon</option>
                      <option value="area">Area</option>
                      <option value="housing">Housing</option>
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newPOI.x}
                        onChange={(e) => setNewPOI({ ...newPOI, x: parseInt(e.target.value) || 0 })}
                        className="w-1/2 bg-[#1a1a2e] text-white p-1 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                        placeholder="X"
                      />
                      <input
                        type="number"
                        value={newPOI.y}
                        onChange={(e) => setNewPOI({ ...newPOI, y: parseInt(e.target.value) || 0 })}
                        className="w-1/2 bg-[#1a1a2e] text-white p-1 rounded border border-gray-700 focus:outline-none focus:border-[#e94560]"
                        placeholder="Y"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddPOI}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#16213e] text-white p-2 rounded border border-[#00b894] transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add POI</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSaveRegion}
                className="flex-1 bg-[#00b894] hover:bg-[#00a383] text-white p-2 rounded transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingRegion(false);
                  setEditingRegion(null);
                }}
                className="flex-1 bg-[#e94560] hover:bg-[#d63755] text-white p-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapEditor;
