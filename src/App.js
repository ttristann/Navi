import React from 'react';
import { CssBaseline, Grid } from '@mui/material'; // Material UI components for layout and baseline CSS reset

// Import custom components
import Header from './components/Headers/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

/**
 * App component
 * Main layout of the application
 * Combines Header, List, and Map components into a responsive grid
 */
function App() {
  return (
    <>
      {/* CssBaseline normalizes and resets browser default styles */}
      <CssBaseline />

      {/* Top navigation bar */}
      <Header />

      {/* Main content layout using Material UI's Grid system */}
      <Grid container spacing={3} style={{ width: '100%' }}>
        
        {/* Left side: List of places (takes full width on small screens, 4/12 on medium and up) */}
        <Grid item xs={12} md={4}>
          <List />
        </Grid>

        {/* Right side: Map display (takes full width on small screens, 8/12 on medium and up) */}
        <Grid item xs={12} md={8}>
          <Map />
        </Grid>

      </Grid>
    </>
  );
}

export default App;
