import React, { useState, useEffect } from 'react';
import { Paper, Typography, useMediaQuery, Rating, Box } from '@mui/material';
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useUser } from '../../context/UserContext';

import useStyles from './styles';

const MapComponent = ({
  coordinates,
  location_lat,
  location_lng,
  places = [],
  selectedPlace: propSelectedPlace,
  setSelectedPlace: propSetSelectedPlace,
  origin,
  destination,
  height = '470px', // Added a configurable height prop with default
  width = '100%'     // Added a configurable width prop with default
}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(min-width:600px)');
  const [localSelectedPlace, setLocalSelectedPlace] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeBreakpoints, setRouteBreakpoints] = useState([]);
  // csont [itinerary, setItinerary] = useState(null);
  const map = useMap();

  const selectedPlace = propSelectedPlace !== undefined ? propSelectedPlace : localSelectedPlace;
  const setSelectedPlace = propSetSelectedPlace || setLocalSelectedPlace;

  const mapCenter = location_lat && location_lng
  ? { lat: location_lat, lng: location_lng }
  : coordinates;

  // Fit all markers and the center into view
  useEffect(() => {
    if (!map || !places.length) return;

    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      const lat = place.latitude || place.lat;
      const lng = place.longitude || place.lng;
      bounds.extend(new window.google.maps.LatLng(lat, lng));
    });

    bounds.extend(new window.google.maps.LatLng(coordinates.lat, coordinates.lng));
    map.fitBounds(bounds);
  }, [map, places, coordinates]);

  const getCategoryIcon = (category) => {
    if (category === 'restaurants') return 'R';
    if (category === 'shopping') return 'S';
    if (category === 'attractions') return 'A';
    if (category === 'parks') return 'P';
    return '?';
  };

  // Make info window smaller to match reduced map size
  const renderInfoContent = (place) => (
    <Box
      sx={{
        width: 240,
        minWidth: 240,
        maxWidth: 240,
        height: 200,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Box sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            place.category === 'restaurants' ? '#F44336' :
            place.category === 'shopping' ? '#2196F3' :
            place.category === 'attractions' ? '#FF9800' :
            place.category === 'parks' ? '#4CAF50' :
            '#757575',
          color: '#FFFFFF',
          fontSize: '16px',
          flexShrink: 0
        }}>
          {getCategoryIcon(place.category)}
        </Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 'bold', flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {place.name}
        </Typography>
      </Box>
  
      {place.rating && (
        <Box display="flex" alignItems="center" mb={0.5}>
          <Rating size="small" value={Number(place.rating)} precision={0.5} readOnly />
          <Typography variant="body2" sx={{ ml: 0.5, whiteSpace: 'nowrap' }}>
            {place.rating} ({place.user_ratings_total || 0})
          </Typography>
        </Box>
      )}
  
      {place.price_level && (
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          {'$'.repeat(place.price_level)}
        </Typography>
      )}
  
      {place.photo && (
        <img
          src={place.photo}
          alt={place.name}
          style={{
            width: '100%',
            height: 80,
            objectFit: 'cover',
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
      )}
  
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {place.address || place.vicinity}
      </Typography>
  
      {place.category && (
        <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
          {place.category}
        </Typography>
      )}
  
      {place.opening_hours && (
        <Typography variant="body2" color={place.opening_hours.open_now ? "success.main" : "error.main"} sx={{ mt: 0.5 }}>
          {place.opening_hours.open_now ? "Open now" : "Closed"}
        </Typography>
      )}
    </Box>
  );
  
  // Custom container style to ensure the map stays within bounds
  const containerStyle = {
    height: height,
    width: width,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <Map
        mapId={process.env.REACT_APP_GOOGLE_MAP_ID || 'demo-map-id'}
        defaultCenter={mapCenter}
        center={mapCenter}
        defaultZoom={14}
        style={{ width: '100%', height: '100%' }}
        options={{
          mapTypeControl: false,
          streetViewControl: false, // Removed street view to save space
          fullscreenControl: true,
          gestureHandling: 'cooperative', // Changed to cooperative instead of greedy
          zoomControl: true,
          zoomControlOptions: {
            position: 9 // GOOGLE_MAP.CONTROL_POSITION.RIGHT_BOTTOM
          }
        }}
      >
        <AdvancedMarker position={coordinates} title="Current Location">
          <Pin
            background={'#4285F4'}
            glyphColor={'#FFFFFF'}
            borderColor={'#FFFFFF'}
            scale={1.2}
          />
        </AdvancedMarker>

        {places.map((place, index) => {
          let pinColor = '#FF5252';
          if (place.category === 'restaurants') pinColor = '#F44336';
          else if (place.category === 'shopping') pinColor = '#2196F3';
          else if (place.category === 'attractions') pinColor = '#FF9800';
          else if (place.category === 'parks') pinColor = '#4CAF50';

          return (
            <AdvancedMarker
              key={`place-${place.id || index}`}
              position={{ lat: place.latitude || place.lat, lng: place.longitude || place.lng }}
              title={place.name}
              onClick={() => setSelectedPlace(place)}
            >
              <Pin
                background={pinColor}
                glyphColor={'#FFFFFF'}
                borderColor={'#FFFFFF'}
                scale={1}
              />
            </AdvancedMarker>
          );
        })}
        
        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.latitude || selectedPlace.lat,
              lng: selectedPlace.longitude || selectedPlace.lng
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            {renderInfoContent(selectedPlace)}
          </InfoWindow>
        )}

        {routeBreakpoints.map((point, index) => (
          <AdvancedMarker
            key={`breakpoint-${index}`}
            position={point}
            title={`Route Breakpoint ${index + 1}`}
          >
            <Pin
              background={'#8E24AA'}
              glyphColor={'#FFFFFF'}
              borderColor={'#FFFFFF'}
              scale={1.2}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;