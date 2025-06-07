import React, { useState, useEffect } from 'react';
import { 
  CssBaseline, 
  Box, 
  ToggleButton, 
  ToggleButtonGroup,
  Tooltip,
  Divider,
  Typography,
  Chip,
  Paper
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
 * with a calendar for scheduling places - all visible at the same time
 */
function ExploreTo() {
  const [activeTab, setActiveTab] = useState('make');

  // Default coordinates (Los Angeles)
  const defaultCoordinates = { lat: 34.0522, lng: -118.2437 };
  
  // Get URL parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get itinerary ID from URL params if available
  const itineraryId = queryParams.get('itineraryId');

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

  // Define category colors
  const categoryColors = {
    'restaurants': '#F44336',
    'shopping': '#2196F3',
    'attractions': '#FF9800',
    'parks': '#4CAF50',
    'default': '#FF5252'
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
                  category: getCategoryFromTypes(place.types),
                  pinColor: getCategoryColor(getCategoryFromTypes(place.types))
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

        // Get color based on category
        const getCategoryColor = (category) => {
          return categoryColors[category] || categoryColors.default;
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

  // If itineraryId is provided, fetch places for that itinerary
  useEffect(() => {
    const fetchSavedItinerary = async () => {
      if (!itineraryId) return;
  
      try {
        const res = await fetch(`http://localhost:4000/api/itineraries/${itineraryId}`);
        const data = await res.json();
  
        if (res.ok && data.places) {
          const mappedEvents = data.places.map(place => {
            const startHour = parseInt(place.start_time.split(':')[0]);
            const endHour = parseInt(place.end_time.split(':')[0]);
            const visitDate = new Date(place.visit_date + 'T00:00:00');
            const dayIndex = visitDate.getDay() === 0 ? 6 : visitDate.getDay() - 1;
  
            return {
              id: `event-${place.place_id}-${place.id}`,
              placeId: place.place_id,
              place: {
                id: place.place_id,
                name: place.name,
                address: place.address,
                lat: place.lat,
                lng: place.lng,
                category: place.category || 'default',
              },
              date: visitDate,
              startHour,
              endHour,
              dayIndex,
              timeIndex: startHour
            };
          });
  
          setScheduledEvents(mappedEvents);
        }
      } catch (err) {
        console.error('Failed to load itinerary:', err);
      }
    };
  
    fetchSavedItinerary();
  }, [itineraryId]);
  

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
  const handleFilterChange = (category) => {
    setActiveFilter(category);
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
      <CssBaseline />
      {/* Main Grid Container */}
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Content Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Column - List */}
          <Paper sx={{ 
            width: '30%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 0,
            boxShadow: 'none',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            bgcolor: '#1a2642' // Dark blue background like in wireframe
          }}>
          
          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '20px'}}>
            <button onClick={() => setActiveTab('make')} style={{ width: '100%', height: '50px', color: 'white', backgroundColor: activeTab === 'make'? '#36499A': '#475EBF', border: 'none', borderRadius: '10px 0 0 10px', fontWeight: '600', transition: 'background-color 0.3s ease'}}>Make Your Own</button>
            <button onClick={() => setActiveTab('explore')} style={{ width: '100%', height: '50px', color: 'white', backgroundColor: activeTab === 'explore'? '#36499A': '#475EBF', border: 'none', borderRadius: '0 10px 10px 0', fontWeight: '600', transition: 'background-color 0.3s ease'}}>Explore Itineraries</button>
          </div>

          {activeTab === 'make' && (
            <>
              {/* Filter Buttons */}
              <Box sx={{ p: 1 }}>
                <Box sx={{ mb: 1, px: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', py: 1 }}>
                    Suggested Stops
                  </Typography>
                </Box>
                
                {/* Updated filter buttons structure */}
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  gap: 2,
                  px: 2,
                  py: 1
                }}>
                  <Box sx={{ 
                    width: '45%', 
                    bgcolor: activeFilter === 'restaurants' ? '#000' : '#fff',
                    color: activeFilter === 'restaurants' ? '#fff' : '#000',
                    py: 1.5,
                    px: 1,
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'medium',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleFilterChange('restaurants')}>
                    food/drinks
                  </Box>
                  
                  <Box sx={{ 
                    width: '45%', 
                    bgcolor: activeFilter === 'shopping' ? '#000' : '#fff',
                    color: activeFilter === 'shopping' ? '#fff' : '#000',
                    py: 1.5,
                    px: 1,
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'medium',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleFilterChange('shopping')}>
                    shopping/retail
                  </Box>
                  
                  <Box sx={{ 
                    width: '45%', 
                    bgcolor: activeFilter === 'attractions' ? '#000' : '#fff',
                    color: activeFilter === 'attractions' ? '#fff' : '#000',
                    py: 1.5,
                    px: 1,
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'medium',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleFilterChange('attractions')}>
                    adventure/activities
                  </Box>
                  
                  <Box sx={{ 
                    width: '45%', 
                    bgcolor: activeFilter === 'parks' ? '#000' : '#fff',
                    color: activeFilter === 'parks' ? '#fff' : '#000',
                    py: 1.5,
                    px: 1,
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'medium',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleFilterChange('parks')}>
                    landmark/park
                  </Box>
                </Box>
              </Box>
              
              {/* Places List - Scrollable */}
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <List 
                  places={places} 
                  isLoading={isLoading} 
                  onPlaceSelect={handlePlaceSelect} 
                />
              </Box>
            </>
          )}

            
          </Paper>
          
          {/* Right Column - Map and Calendar */}
          <Box sx={{ 
            width: '70%', 
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            {/* Map Component - Takes upper 60% */}
            <Box sx={{ height: '60%', position: 'relative' }}>
              <MapComponent 
                coordinates={coordinates} 
                places={places}
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
              />
            </Box>
            
            {/* Calendar Component - Takes lower 40% */}
            <Box sx={{ 
              height: '40%', 
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              overflow: 'auto',
              p: 2
            }}>
              <Calendar 
                places={places}
                onEventAdded={handleEventAdded}
                onEventRemoved={handleEventRemoved}
                initialEvents={scheduledEvents}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </APIProvider>
  );
}

export default ExploreTo;