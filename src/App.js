import React, { useState } from 'react';
import { CssBaseline } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';

// Import custom components
import Header from './components/Headers/Header';
import List from './components/List/List';
import MapComponent from './components/Map/Map';
import SearchBar from './components/SearchBar/SearchBar';

/**
 * App component
 * Main layout of the application
 * Combines Header, List, and Map components into a responsive grid
 */
function App() {
  const [coordinates, setCoordinates] = useState({ lat: 34.0522, lng: -118.2437 });

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      {/* CssBaseline normalizes and resets browser default styles */}
      <CssBaseline />

      {/* Top navigation bar */}
      <div style={{backgroundColor: "#74BEED", minHeight: '100vh'}}>
        <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 3 }}>
          <Header/>
        </div>

        {/* Main content layout */}
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10vh', height: '90vh' }}>
          {/* Left side: List Display */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <SearchBar onSearch={setCoordinates}  />
          </div>

          {/* Right side: Map Display */}
          {/* <div style={{ flex: 2 }}>
            <MapComponent coordinates={coordinates} />
          </div> */}
        </div>
      </div>
    </LoadScript>
  );
}

export default App;


