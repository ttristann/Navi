import React, { useState, useEffect } from 'react';
import { 
  CssBaseline, 
  Box, 
  ToggleButton, 
  ToggleButtonGroup,
  Tooltip,
  Divider
} from '@mui/material';
import { APIProvider } from '@vis.gl/react-google-maps';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ParkIcon from '@mui/icons-material/Park';
import { useLocation } from 'react-router-dom';

// Import custom components
import Header from '../../components/Headers/Header';
import List from '../../components/List/List';
import MapComponent from '../../components/Map/Map';
import Calendar from '../../components/Calendar/Calendar';

/**
 * ExploreTo component
 * Displays a map and list of places based on coordinates from URL parameters
 * with a calendar for scheduling places
 */
function ExploreTo() {
  // Default coordinates (Los Angeles)
  const defaultCoordinates = { lat: 34.0522, lng: -118.2437 };
  
  // Get URL parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Initial coordinates from URL params or default
  const initialCoordinates = {
    lat: queryParams.get('lat') ? parseFloat(queryParams.get('lat')) : defaultCoordinates.lat,
    lng: queryParams.get('lng') ? parseFloat(queryParams.get('lng')) : defaultCoordinates.lng
  };
  
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [scheduledEvents, setScheduledEvents] = useState([]);

  // Set default active filter to 'restaurants' only
  const [activeFilter, setActiveFilter] = useState('restaurants');
  
  // Category to Places API type mapping
  const categoryMapping = {
    'restaurants': ['restaurant', 'cafe', 'bar', 'food'],
    'shopping': ['shopping_mall', 'store', 'clothing_store', 'electronics_store'],
    'attractions': ['tourist_attraction', 'museum', 'amusement_park', 'art_gallery'],
    'parks': ['park', 'campground', 'natural_feature', 'points_of_interest']
  };
  
  // Listen for URL parameter changes
  useEffect(() => {
    const lat = queryParams.get('lat');
    const lng = queryParams.get('lng');
    
    if (lat && lng) {
      setCoordinates({
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
    }
  }, [location.search]);
  
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
        
        // Fetch places for the active filter only
        const fetchPromises = [];
        
        if (categoryMapping[activeFilter]) {
          // Get types for the active filter
          const typesToFetch = categoryMapping[activeFilter];
          
          // Fetch places for each type in the active filter
          typesToFetch.forEach(type => {
            fetchPromises.push(fetchPlacesByType(type));
          });
        }
        
        // Wait for all fetches to complete
        const results = await Promise.all(fetchPromises);
        
        // Combine all results and remove duplicates
        results.forEach(placeArray => {
          placeArray.forEach(place => {
            // Only add places that match the active filter category
            if (place.category === activeFilter && !allPlaces.some(p => p.id === place.id)) {
              allPlaces.push(place);
            }
          });
        });
        
        // Update state with the places
        // Limits the number of places shown to 30 for now --> more efficient
        setPlaces(
          allPlaces
          .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating
          .slice(0, 30) // Gets the top 30 places
        );

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
  }, [coordinates, activeFilter]);

  // Handle place selection from the list
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    // If you want to update the map view when a place is selected:
    setCoordinates({ 
      lat: place.lat || place.latitude,
      lng: place.lng || place.longitude 
    });
  };

  // Handle search from header
  const handleHeaderSearch = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  // Handle filter changes - only one filter can be active at a time
  const handleFilterChange = (event, newFilter) => {
    // If user tries to deselect all filters, keep the current one active
    if (newFilter !== null) {
      setActiveFilter(newFilter);
    }
  };

  // Handle event added to calendar
  const handleEventAdded = (newEvent) => {
    setScheduledEvents(prev => [...prev, newEvent]);
  };

  // Handle event removed from calendar
  const handleEventRemoved = (eventId) => {
    setScheduledEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      {/* CssBaseline normalizes and resets browser default styles */}
      <CssBaseline />

      {/* Main content layout */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Upper section with list and map */}
        <div style={{ display: 'flex', flexDirection: 'row', flex: 2 }}>
          {/* Left side: List Display with filters above */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Filter buttons now inside the list column */}
            <div style={{ padding: '10px', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
              <ToggleButtonGroup
                value={activeFilter}
                exclusive
                onChange={handleFilterChange}
                aria-label="place categories"
                size="small"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <ToggleButton 
                  value="restaurants" 
                  aria-label="food and drinks"
                  style={{ 
                    borderRadius: '4px', 
                    margin: '0 2px', 
                    paddingLeft: '12px', 
                    paddingRight: '12px',
                    backgroundColor: activeFilter === 'restaurants' ? '#F44336' : '#e3f2fd',
                    color: activeFilter === 'restaurants' ? 'white' : '#F44336'
                  }}
                >
                  <Tooltip title="Food & Drinks">
                    <RestaurantIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton 
                  value="shopping" 
                  aria-label="shopping and retail"
                  style={{ 
                    borderRadius: '4px', 
                    margin: '0 2px', 
                    paddingLeft: '12px', 
                    paddingRight: '12px',
                    backgroundColor: activeFilter === 'shopping' ? '#2196F3' : '#e3f2fd',
                    color: activeFilter === 'shopping' ? 'white' : '#2196F3'
                  }}
                >
                  <Tooltip title="Shopping & Retail">
                    <ShoppingBagIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton 
                  value="attractions" 
                  aria-label="activities and attractions"
                  style={{ 
                    borderRadius: '4px', 
                    margin: '0 2px', 
                    paddingLeft: '12px', 
                    paddingRight: '12px',
                    backgroundColor: activeFilter === 'attractions' ? '#FF9800' : '#e3f2fd',
                    color: activeFilter === 'attractions' ? 'white' : '#FF9800'
                  }}
                >
                  <Tooltip title="Activities & Attractions">
                    <LocalActivityIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton 
                  value="parks" 
                  aria-label="parks and landmarks"
                  style={{ 
                    borderRadius: '4px', 
                    margin: '0 2px', 
                    paddingLeft: '12px', 
                    paddingRight: '12px',
                    backgroundColor: activeFilter === 'parks' ? '#4CAF50' : '#e3f2fd',
                    color: activeFilter === 'parks' ? 'white' : '#4CAF50'
                  }}
                >
                  <Tooltip title="Parks & Landmarks">
                    <ParkIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            
            {/* List component */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <List 
                places={places} 
                isLoading={isLoading} 
                onPlaceSelect={handlePlaceSelect} 
              />
            </div>
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
        
        {/* Divider between map and calendar */}
        <Divider />
        
        {/* Calendar section */}
        <div style={{ flex: 1, minHeight: '300px', padding: '10px' }}>
          <Calendar 
            places={places}
            onEventAdded={handleEventAdded}
            onEventRemoved={handleEventRemoved}
          />
        </div>
      </div>
    </APIProvider>
  );
}

export default ExploreTo;