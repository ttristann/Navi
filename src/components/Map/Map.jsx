import React, { useState, useEffect } from 'react';
import { Paper, Typography, useMediaQuery, Rating, Box } from '@mui/material';
import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import useStyles from './styles';

const MapComponent = ({ coordinates, places = [], selectedPlace: propSelectedPlace, setSelectedPlace: propSetSelectedPlace }) => {
    const classes = useStyles();
    const isMobile = useMediaQuery('(min-width:600px)');
    const [localSelectedPlace, setLocalSelectedPlace] = useState(null);

    const selectedPlace = propSelectedPlace !== undefined ? propSelectedPlace : localSelectedPlace;
    const setSelectedPlace = propSetSelectedPlace || setLocalSelectedPlace;

    useEffect(() => {
        if (propSelectedPlace !== undefined) {
            setLocalSelectedPlace(propSelectedPlace);
        }
    }, [propSelectedPlace]);

    const getCategoryIcon = (category) => {
        if (category === 'restaurants') return '🍴';
        if (category === 'shopping') return '🛍️';
        if (category === 'attractions') return '🎭';
        if (category === 'parks') return '🌳';
        return '📍';
    };

    const renderInfoContent = (place) => (
        <Box sx={{ padding: 1, maxWidth: 250 }}>
            <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor:
                        place.category === 'restaurants' ? '#F44336' :
                        place.category === 'shopping' ? '#2196F3' :
                        place.category === 'attractions' ? '#FF9800' :
                        place.category === 'parks' ? '#4CAF50' :
                        '#757575',
                    color: '#FFFFFF',
                    fontSize: '18px'
                }}>
                    {getCategoryIcon(place.category)}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {place.name}
                </Typography>
            </Box>

            {place.rating && (
                <Box display="flex" alignItems="center" mt={1} mb={0.5}>
                    <Rating size="small" value={Number(place.rating)} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {place.rating} ({place.user_ratings_total || 0})
                    </Typography>
                </Box>
            )}

            {place.price_level && (
                <Box mt={0.5}>
                    <Typography variant="body2" color="text.secondary">
                        {'$'.repeat(place.price_level)}
                    </Typography>
                </Box>
            )}

            {place.photo && (
                <img
                    src={place.photo}
                    alt={place.name}
                    style={{ width: '100%', height: 120, objectFit: 'cover', marginTop: 8, borderRadius: 4 }}
                />
            )}

            <Typography variant="body2" sx={{ mt: 1 }}>
                {place.address || place.vicinity}
            </Typography>

            {place.category && (
                <Box mt={1} display="flex" alignItems="center">
                    <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                        {place.category}
                    </Typography>
                </Box>
            )}

            {place.opening_hours && (
                <Typography variant="body2" color={place.opening_hours.open_now ? "success.main" : "error.main"} sx={{ mt: 0.5 }}>
                    {place.opening_hours.open_now ? "Open now" : "Closed"}
                </Typography>
            )}
        </Box>
    );

    return (
        <div className={classes.mapContainer}>
            <Map
                mapId={process.env.REACT_APP_GOOGLE_MAP_ID || 'demo-map-id'}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                style={{ width: '100%', height: '100%' }}
                options={{
                    mapTypeControl: false,
                    streetViewControl: true,
                    fullscreenControl: true,
                    gestureHandling: 'greedy'
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
            </Map>
        </div>
    );
};

export default MapComponent;
