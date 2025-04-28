import React from 'react';
import GoogleMapReact from 'google-map-react'; // Library for embedding Google Maps in React apps
import { Paper, Typography, useMediaQuery } from '@mui/material'; // Material UI components and hook
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'; // Map pin icon
import Rating from '@mui/material/Rating'; // Star rating component

import useStyles from './styles'; 

/**
 * Map component
 * Displays a Google Map centered around a given set of coordinates
 */
const Map = () => {
    const classes = useStyles(); // Access custom styles
    const isMobile = useMediaQuery('(min-width:600px)'); // Detect if the device screen is at least 600px wide
    const coordinates = { lat: 34.0522, lng: -118.2437 }; // Default coordinates (Los Angeles)

    return (
        // Container for the map
        <div className={classes.mapContainer}>
            {/* Google Map Component */}
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }} // API Key for Google Maps (from environment variables)
                defaultCenter={coordinates} // Default center of the map
                center={coordinates}         // Dynamic center (could be updated later)
                defaultZoom={14}              // Default zoom level
                margin={[50, 50, 50, 50]}     // Margin around the map
                // options = {''}
                // onChange = {''}
                // onChildClick = {''}
            >
                {/* Map children (like markers or popups) could go here */}
            </GoogleMapReact>
        </div>
    );
}

export default Map;

