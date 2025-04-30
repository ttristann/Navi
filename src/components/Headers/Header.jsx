import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useStyles from './styles';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autoC) => setAutocomplete(autoC);

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

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Navi
        </Typography>

        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ marginRight: 2 }}>
            Explore
          </Typography>

          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ backgroundColor: 'white', borderRadius: 1, padding: '0 8px' }}
            >
              <SearchIcon sx={{ color: 'gray', mr: 1 }} />
              <InputBase
                placeholder="Search..."
                sx={{ width: 200 }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </Box>
          </Autocomplete>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
