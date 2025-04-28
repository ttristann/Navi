import React from 'react';
import GoogleMapReact from 'google-map-react';
import  {Paper, Typography, useMediaQuery} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Rating from '@mui/material/Rating';

import useStyles from './styles';

const Map = () => {
    const classes = useStyles();
    const isMobile = useMediaQuery('(min-width:600px)');
    const coordinates = { lat: 34.0522, lng: -118.2437 };

    return (
        <div className = { classes.mapContainer }>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }} // copy API key here
                defaultCenter = {coordinates}
                center = {coordinates}
                defaultZoom = {14}
                margin = {[50, 50, 50, 50]}
                // options = {''}
                // onChange = {''}
                // onChildClick = {''}
            >
               
            </GoogleMapReact>
        </div>
    );
}

export default Map;
