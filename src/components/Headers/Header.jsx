import React from 'react';
import { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, alpha } from '@mui/material'; // Material UI components for styling and layout
import SearchIcon from '@mui/icons-material/Search'; // Icon for the search bar

import useStyles from './styles'; // (Currently not used in this file but could be for custom styling)

/**
 * Header component for the application
 * Displays a navigation bar with the app name, an 'Explore' label, and a search input
 */
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Header = ({onSearch}) => {
  // Search handling
  const [searchInput, setSearchInput] = useState('');
  const handleKeyPress = async (e) => {
    if (e.key == 'Enter'){
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${apiKey}`
        );
        const data = await response.json();
        console.log('Geocode API Resonse:', data)
        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          onSearch({ lat: location.lat, lng: location.lng });
        } else {
          alert(`Place not found! (Status: ${data.status})`);
        }
        // if (data.results.length > 0){
        //   const location = data.results[0].geometry.location;
        //   onSearch({ lat: location.lat, lng: location.lng });
        // } else {
        //   alert('Place not found!')
        // }
      } catch (error) {
        console.error('Error fetching location: ', error)
      }
    }
  }

  return (
    // AppBar is the main top bar container
    <AppBar position="static">
      {/* Toolbar arranges the child elements horizontally */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Application name on the left side */}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Navi
        </Typography>

        {/* Right side of the header containing 'Explore' and the search input */}
        <Box display="flex" alignItems="center">
          
          {/* 'Explore' label next to the search bar */}
          <Typography variant="h6" sx={{ marginRight: 2 }}>
            Explore
          </Typography>

          {/* Container for the search icon and search input */}
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ backgroundColor: 'white', borderRadius: 1, padding: '0 8px' }}
          >
            {/* Search icon inside the search box */}
            <SearchIcon sx={{ color: 'gray', mr: 1 }} />
            
            {/* Input field for entering search queries */}
            <InputBase
              placeholder="Search..."
              sx={{ width: 200 }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
