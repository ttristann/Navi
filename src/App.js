import React from 'react';
import { useState } from 'react';
import { CssBaseline, Grid } from '@mui/material'; // Material UI components for layout and baseline CSS reset

// Import custom components
import Header from './components/Headers/Header';
import List from './components/List/List';
import MapComponent from './components/Map/Map';

/**
 * App component
 * Main layout of the application
 * Combines Header, List, and Map components into a responsive grid
 */
function App() {
  const [coordinates, setCoordinates] = useState({ lat: 34.0522, lng: -118.2437 })
  return (
    <>
      {/* CssBaseline normalizes and resets browser default styles */}
      <CssBaseline />

      {/* Top navigation bar */}
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 3 }}>
        <Header onSearch={setCoordinates}/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10vh', height: '90vh' }}>
        {/* List Display */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <List />
        </div>
        {/* Map Display */}
        <div style={{ flex: 2 }}>
          <MapComponent coordinates={coordinates}/>
        </div>
      </div>

      

      {/* Grid over the map */}
      {/* <Grid container spacing={3} style={{ width: '100%', marginTop: '80px', position: 'relative', zIndex: 2 }}> */}
        
        {/* Left side: List */}
        {/* <Grid item xs={12} md={4}>
          <List />
        </Grid> */}

        {/* You can add more content on the right side if needed */}
        {/* <Grid item xs={12} md={8}>Other content</Grid> */}

      {/* </Grid> */}


      {/* Main content layout using Material UI's Grid system */}
      {/* <Grid container spacing={3} style={{ width: '100%', position: "fixed", zindex: '2'}}> */}
        
        {/* Left side: List of places (takes full width on small screens, 4/12 on medium and up) */}
        {/* <Grid item xs={12} md={4}>
          <List />
        </Grid> */}

        {/* Right side: Map display (takes full width on small screens, 8/12 on medium and up) */}
        {/* <Grid item xs={12} md={8}>
          <MapComponent />
        </Grid> */}
{/* 
      </Grid> */}


    </>
  );
}

export default App;
