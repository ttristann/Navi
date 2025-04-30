import React, { useState } from 'react';
import { CssBaseline } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';

// Import custom components
import Navbar from './components/Navbar/Navbar';
import List from './components/List/List';
import MapComponent from './components/Map/Map';
// import SearchBar from './components/SearchBar/SearchBar';
// import PopularTrips from './components/TripCards/PopularTrips';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Explore from './pages/Explore/Explore';
import Trips from './pages/Trips/Trips';


/**
 * App component
 * Main layout of the application
 */
function App() {
  // const [coordinates, setCoordinates] = useState({ lat: 34.0522, lng: -118.2437 });

  return (
    <div className="App">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Explore/>}/>
            <Route path="/trips" element={<Trips/>}/>
          </Routes>
        </Router>
      </LoadScript>
    </div>


            // <MapComponent coordinates={coordinates} />

  );
}

export default App;


