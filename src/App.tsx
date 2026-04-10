import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import MapEditor from './components/MapEditor';
import { useMapStore } from './store/mapStore';

function App() {
  const { isEditorMode } = useMapStore();

  return (
    <Router>
      <div className="App">
        <MapComponent />
        {isEditorMode && <MapEditor />}
      </div>
    </Router>
  );
}

export default App;
