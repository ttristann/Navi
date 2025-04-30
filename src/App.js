import React, { useState, useEffect } from 'react';
import { 
  CssBaseline, 
  CircularProgress, 
  Box, 
  ToggleButton, 
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import { APIProvider } from '@vis.gl/react-google-maps';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ParkIcon from '@mui/icons-material/Park';

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
  const [coordinates, setCoordinates] = useState({ lat: 34.0522, lng: -118.2437 });
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Available category filters
  const [activeFilters, setActiveFilters] = useState(['restaurants', 'shopping', 'attractions', 'parks']);
  
  // Category to Places API type mapping
  const categoryMapping = {
    'restaurants': ['restaurant', 'cafe', 'bar', 'food'],
    'shopping': ['shopping_mall', 'store', 'clothing_store', 'electronics_store'],
    'attractions': ['tourist_attraction', 'museum', 'amusement_park', 'art_gallery'],
    'parks': ['park', 'campground', 'natural_feature', 'points_of_interest']
  };
  
  // Function to fetch places from Google Places API based on current coordinates and filters
  useEffect(() => {
    let placesService;
    
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        
        // Wait for the Google Maps API to load
        if (!window.google) {
          console.log("Google Maps API not loaded yet");
          return;
        }
        
        // Initialize the Places service
        const placesDiv = document.createElement('div');
        const map = new window.google.maps.Map(placesDiv);
        placesService = new window.google.maps.places.PlacesService(map);
        
        // Create an array to store all fetched places
        let allPlaces = [];
        
        // Function to fetch places for a specific type
        const fetchPlacesByType = (type) => {
          return new Promise((resolve) => {
            const request = {
              location: new window.google.maps.LatLng(coordinates.lat, coordinates.lng),
              radius: 1500, // 1.5km radius
              type: type
            };
            
            placesService.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Process and map the results to our format
                const mappedResults = results.map(place => ({
                  id: place.place_id,
                  name: place.name,
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  rating: place.rating,
                  user_ratings_total: place.user_ratings_total,
                  price_level: place.price_level,
                  vicinity: place.vicinity,
                  types: place.types,
                  photo: place.photos && place.photos[0] ? 
                    place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 }) : null,
                  category: getCategoryFromTypes(place.types)
                }));
                
                resolve(mappedResults);
              } else {
                console.warn(`Places request for type ${type} failed with status: ${status}`);
                resolve([]);
              }
            });
          });
        };
        
        // Determine category from place types
        const getCategoryFromTypes = (types) => {
          for (const [category, categoryTypes] of Object.entries(categoryMapping)) {
            if (types.some(type => categoryTypes.includes(type))) {
              return category;
            }
          }
          return 'other';
        };
        
        // Fetch places for each active filter
        const fetchPromises = [];
        
        // Get all types from active filters
        const typesToFetch = [];
        activeFilters.forEach(filter => {
          if (categoryMapping[filter]) {
            typesToFetch.push(...categoryMapping[filter]);
          }
        });
        
        // Remove duplicates
        const uniqueTypes = [...new Set(typesToFetch)];
        
        // Fetch places for each unique type
        uniqueTypes.forEach(type => {
          fetchPromises.push(fetchPlacesByType(type));
        });
        
        // Wait for all fetches to complete
        const results = await Promise.all(fetchPromises);
        
        // Combine all results and remove duplicates
        results.forEach(placeArray => {
          placeArray.forEach(place => {
            if (!allPlaces.some(p => p.id === place.id)) {
              allPlaces.push(place);
            }
          });
        });
        
        // Update state with the places
        setPlaces(allPlaces);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Wait a bit to ensure Google Maps API has loaded
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [coordinates, activeFilters]);

  // Handle place selection from the list
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    // If you want to update the map view when a place is selected:
    setCoordinates({ 
      lat: place.lat || place.latitude,
      lng: place.lng || place.longitude 
    });
  };

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      {/* CssBaseline normalizes and resets browser default styles */}
      <CssBaseline />

      {/* Top navigation bar */}
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 3 }}>
        <Header onSearch={setCoordinates} />
      </div>
      
      {/* Category Filters */}
      <div style={{ position: 'fixed', top: '10vh', width: '100%', zIndex: 2, display: 'flex', justifyContent: 'center', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <ToggleButtonGroup
          value={activeFilters}
          onChange={(event, newFilters) => {
            setActiveFilters(newFilters.length ? newFilters : ['restaurants', 'shopping', 'attractions', 'parks']);
          }}
          aria-label="place categories"
          color="primary"
        >
          <ToggleButton value="restaurants" aria-label="food and drinks">
            <Tooltip title="Food & Drinks">
              <RestaurantIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="shopping" aria-label="shopping and retail">
            <Tooltip title="Shopping & Retail">
              <ShoppingBagIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="attractions" aria-label="activities and attractions">
            <Tooltip title="Activities & Attractions">
              <LocalActivityIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="parks" aria-label="parks and landmarks">
            <Tooltip title="Parks & Landmarks">
              <ParkIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Main content layout */}
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '15vh', height: '85vh' }}>
        {/* Left side: List Display */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <List 
            places={places} 
            isLoading={isLoading} 
            onPlaceSelect={handlePlaceSelect} 
          />
        </div>

        {/* Right side: Map Display */}
        <div style={{ flex: 2 }}>
          <MapComponent 
            coordinates={coordinates} 
            places={places}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
          />
        </div>
      </div>
    </APIProvider>
  );
}

export default App;