import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, InputBase, Paper, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  
  // Load Google Places API script if not already loaded
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);
  
  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !inputRef.current) {
      return;
    }
    
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    const fetchSuggestions = (input) => {
      if (!input) {
        setSuggestions([]);
        return;
      }
      
      autocompleteService.getPlacePredictions(
        { input },
        (predictions, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
            setSuggestions([]);
            return;
          }
          
          setSuggestions(predictions.map(prediction => ({
            id: prediction.place_id,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text
          })));
        }
      );
    };
    
    // Debounce function to limit API calls
    let timeoutId = null;
    const handleInputChange = (value) => {
      setSearchInput(value);
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    };
    
    // Setup event listener
    const input = inputRef.current;
    input.addEventListener('input', (e) => handleInputChange(e.target.value));
    
    return () => {
      input.removeEventListener('input', (e) => handleInputChange(e.target.value));
      clearTimeout(timeoutId);
    };
  }, []);
  
  const handleSuggestionClick = (placeId) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }
    
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    placesService.getDetails(
      { placeId },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
          setSearchInput(place.formatted_address || place.name);
          setShowSuggestions(false);
          
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          onSearch(location);
        }
      }
    );
  };
  
  const handleSearch = () => {
    // Handle direct search with entered text
    if (!searchInput) return;
    console.log("Search Button Pressed");
    // Use geocoding API to get coordinates
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    )
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          onSearch({ lat: location.lat, lng: location.lng });
        } else {
          alert('Place not found!');
        }
      })
      .catch(err => {
        console.error('Geocode API error:', err);
      });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Plan Your Perfect Getaway
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '999px',
            px: 2,
            py: 1,
            mt: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <LocationOnIcon sx={{ color: 'gray', mr: 1 }} />
          <InputBase
            ref={inputRef}
            placeholder="Where to?"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            fullWidth
            sx={{
              border: 'none',
              outline: 'none',
              '& .MuiInputBase-input': {
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
              },
              '& .MuiInputBase-input:focus': {
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: '#1e2a55',
              borderRadius: '20px',
              textTransform: 'none',
              ml: 2,
              px: 3,
              '&:hover': {
                backgroundColor: '#2c3a75',
              },
            }}
          >
            Search
          </Button>
        </Box>
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              zIndex: 9999,
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {suggestions.map(suggestion => (
              <Box
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.id)}
                sx={{
                  p: 2,
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f9f9f9',
                  },
                  textAlign: 'left',
                }}
              >
                <Box display="flex" alignItems="center">
                  <LocationOnIcon fontSize="small" sx={{ color: 'gray', mr: 1 }} />
                  <Box>
                    <Typography variant="body1">{suggestion.mainText}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {suggestion.secondaryText}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default SearchBar;