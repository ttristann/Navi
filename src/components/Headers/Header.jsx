import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMap } from '@vis.gl/react-google-maps';
import useStyles from './styles';

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  // Initialize autocomplete when the component mounts
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        document.getElementById('search-input'),
        { types: ['geocode'] }
      );
      
      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          onSearch({ lat, lng });
        }
      });
      
      setAutocomplete(autocompleteInstance);
    }
  }, [onSearch]);

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      if (autocomplete) {
        const place = autocomplete.getPlace();
        // If autocomplete has a proper place with geometry, it's already handled by the listener
        if (place && place.geometry && place.geometry.location) {
          return;
        }
      }
      
      // Fallback to manual geocode fetch
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${apiKey}`
        );
        const data = await response.json();
        
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

          <Box
            display="flex"
            alignItems="center"
            sx={{ backgroundColor: 'white', borderRadius: 1, padding: '0 8px' }}
          >
            <SearchIcon sx={{ color: 'gray', mr: 1 }} />
            <InputBase
              id="search-input"
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
