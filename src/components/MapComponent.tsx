import React, { useRef, useEffect, useState } from 'react';
import { useMapStore } from '../store/mapStore';
import { Region, PointOfInterest } from '../types/mapTypes';
import { MapPin, ZoomIn, ZoomOut, Edit3, X } from 'lucide-react';

// Terrain type to color mapping
const terrainColors: Record<string, string> = {
  urban: 'rgba(30, 41, 59, 0.7)',
  industrial: 'rgba(51, 65, 85, 0.7)',
  residential: 'rgba(15, 23, 42, 0.7)',
  financial: 'rgba(17, 24, 39, 0.7)'
};

// POI type to icon mapping
const poiIcons: Record<string, string> = {
  market: '🛒',
  landmark: '🏢',
  tavern: '🍻',
  dungeon: '🐉',
  area: '🌳',
  housing: '🏠'
};

const MapComponent: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  // Get state from store
  const {
    mapData,
    selectedRegion,
    zoom,
    panX,
    panY,
    isEditorMode,
    selectRegion,
    setZoom,
    setPan,
    toggleEditorMode
  } = useMapStore();

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.5));
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      setPan(panX + dx / zoom, panY + dy / zoom);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle region click
  const handleRegionClick = (region: Region) => {
    selectRegion(region);
  };

  // Handle double click to zoom in
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleZoomIn();
  };

  // Handle wheel event for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Render region
  const renderRegion = (region: Region) => {
    const isSelected = selectedRegion?.id === region.id;
    const color = terrainColors[region.terrainType] || 'rgba(30, 41, 59, 0.7)';
    
    return (
      <g key={region.id}>
        <rect
          x={region.bounds.x1}
          y={region.bounds.y1}
          width={region.bounds.x2 - region.bounds.x1}
          height={region.bounds.y2 - region.bounds.y1}
          fill={color}
          stroke={isSelected ? '#e94560' : '#00b894'}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={isEditorMode ? '5,5' : '0'}
          rx={5}
          ry={5}
          onClick={() => handleRegionClick(region)}
          className="cursor-pointer transition-all duration-300 hover:stroke-white"
        />
        <text
          x={region.bounds.x1 + (region.bounds.x2 - region.bounds.x1) / 2}
          y={region.bounds.y1 + (region.bounds.y2 - region.bounds.y1) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          className="pointer-events-none drop-shadow-lg"
        >
          {region.name}
        </text>
        <text
          x={region.bounds.x1 + (region.bounds.x2 - region.bounds.x1) / 2}
          y={region.bounds.y1 + (region.bounds.y2 - region.bounds.y1) / 2 + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#feca57"
          fontSize="12"
          className="pointer-events-none drop-shadow-lg"
        >
          Lv {region.levelMin}-{region.levelMax}
        </text>
      </g>
    );
  };

  // Render point of interest
  const renderPointOfInterest = (poi: PointOfInterest) => {
    const icon = poiIcons[poi.type] || '📍';
    
    return (
      <g key={poi.id} className="cursor-pointer">
        <circle
          cx={poi.x}
          cy={poi.y}
          r="15"
          fill="rgba(23, 32, 42, 0.8)"
          stroke="#feca57"
          strokeWidth="2"
          className="transition-all duration-300 hover:r-18 hover:stroke-white"
        />
        <text
          x={poi.x}
          y={poi.y + 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          className="pointer-events-none"
        >
          {icon}
        </text>
        <title>{poi.name}</title>
      </g>
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#1a1a2e] overflow-hidden">
      {/* Map container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          ref={mapRef}
          width="1000"
          height="1000"
          viewBox="0 0 1000 1000"
          className="transform origin-center"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
        >
          {/* Grid background */}
          {mapData.settings.gridEnabled && (
            <g className="pointer-events-none">
              {Array.from({ length: 21 }).map((_, i) => (
                <React.Fragment key={i}>
                  <line
                    x1={i * 50}
                    y1={0}
                    x2={i * 50}
                    y2={1000}
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth="1"
                  />
                  <line
                    x1={0}
                    y1={i * 50}
                    x2={1000}
                    y2={i * 50}
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth="1"
                  />
                </React.Fragment>
              ))}
            </g>
          )}

          {/* Render regions */}
          <g>
            {mapData.regions.map(renderRegion)}
          </g>

          {/* Render points of interest */}
          <g>
            {mapData.regions.flatMap(region => region.pointsOfInterest).map(renderPointOfInterest)}
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="bg-[#16213e] text-white p-2 rounded-full shadow-lg hover:bg-[#0f3460] transition-colors border border-[#00b894] hover:border-[#e94560]"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-[#16213e] text-white p-2 rounded-full shadow-lg hover:bg-[#0f3460] transition-colors border border-[#00b894] hover:border-[#e94560]"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={toggleEditorMode}
          className={`bg-[#16213e] text-white p-2 rounded-full shadow-lg hover:bg-[#0f3460] transition-colors border ${isEditorMode ? 'border-[#e94560]' : 'border-[#00b894]'}`}
          title={isEditorMode ? 'Exit Editor Mode' : 'Enter Editor Mode'}
        >
          <Edit3 size={20} />
        </button>
      </div>

      {/* Region details */}
      {selectedRegion && (
        <div className="absolute bottom-4 left-4 right-4 md:right-1/2 bg-[#16213e]/80 backdrop-blur-md rounded-lg border border-[#00b894] shadow-lg p-4 z-10">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-white mb-2 font-orbitron">{selectedRegion.name}</h2>
            <button
              onClick={() => selectRegion(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-300 mb-3">{selectedRegion.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-[#0f3460] text-white px-2 py-1 rounded text-sm">
              Level: {selectedRegion.levelMin}-{selectedRegion.levelMax}
            </span>
            <span className="bg-[#0f3460] text-white px-2 py-1 rounded text-sm">
              Terrain: {selectedRegion.terrainType}
            </span>
          </div>
          {selectedRegion.pointsOfInterest.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Points of Interest:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRegion.pointsOfInterest.map((poi) => (
                  <div key={poi.id} className="flex items-center gap-1 bg-[#1a1a2e] px-2 py-1 rounded text-sm">
                    <span>{poiIcons[poi.type] || '📍'}</span>
                    <span className="text-gray-300">{poi.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
