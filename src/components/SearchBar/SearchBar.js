
// import { CssBaseline } from '@mui/material';
// import { LoadScript } from '@react-google-maps/api';

import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, Button, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn'
// import SearchIcon from '@mui/icons-material/Search';

/**
 * SearchBar component
 * To be imported on different pages
 */

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function SearchBar ({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);
  
    const onLoad = (autoC) => setAutocomplete(autoC);

    // handles the autosearch
    const onPlaceChanged = () => {
      if (autocomplete !== null) {
        const place = autocomplete.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          onSearch({ lat, lng });
        }
      }
    };
    
    // handles keypress for search
    const handleKeyPress = async (e) => {
      if (e.key === 'Enter') {
        if (autocomplete) {
          const place = autocomplete.getPlace();
          // If autocomplete has a proper place, let onPlaceChanged handle it
          if (place && place.geometry && place.geometry.location) {
            return; // Do nothing — Autocomplete handled it
          }
        }
        // Otherwise, fallback to manual geocode fetch
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${apiKey}`
          );
          const data = await response.json();
          console.log('Manual Geocode API Response:', data);
          if (data.status === "OK" && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            onSearch({ lat: location.lat, lng: location.lng });
          } else {
            alert(`Place not found! (Status: ${data.status})`);
          }
        } catch (error) {
          console.error('Error fetching location manually: ', error);
        }
      }
    };

    // handles when user presses 'Search'


  // styling for dropdown autocomplete results
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .pac-container {
        border-radius: 5px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
        font-family: 'Roboto', sans-serif !important;
        z-index: 9999 !important;
        width:500px !important;
        margin-left: -30px !important;
        margin-top: 12px !important;
      }
  
      .pac-item {
        padding: 12px !important;
        font-size: 16px;
      }
  
      .pac-item:hover {
        background-color: #f0f4ff !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 2,
        maxWidth: 600,
        mx: 'auto',
        mt: 6,
        backgroundColor: '#fff',
        textAlign:'center'
      }}
      >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Plan Your Perfect Getaway
          </Typography>

          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Box
              sx={{
                display: 'flex',
                alignItems:'center',
                backgroundColor: '#fff', 
                borderRadius: '999px', 
                px: 2,
                py: 1, 
                mt: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}
            >
              <LocationOnIcon sx={{ color: 'gray', mr: 1 }} />
              <InputBase
                placeholder="Where To?"
                fullWidth
                sx={{ flex: 1 }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button
                variant="contained"
                onClick={handleKeyPress}
                sx={{
                  backgroundColor: '#1e2a55',
                  borderRadius: '20px',
                  textTransform: 'none',
                  ml: 2,
                  px: 3,
                  '&hover': {
                    backgroundColor: '#2c3a75',
                  }
                }}
                > Search
              </Button>
            </Box>
          </Autocomplete>
        </Paper>
  );
}

export default SearchBar;


