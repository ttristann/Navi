// import React from 'react';
// import GoogleMapReact from 'google-map-react';
// import  {Paper, Typography, useMediaQuery} from '@mui/material';
// import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import Rating from '@mui/material/Rating';

// import useStyles from './styles';

// const Map = () => {
//     const classes = useStyles();
//     const isMobile = useMediaQuery('(min-width:600px)');
//     const coordinates = { lat: 34.0522, lng: -118.2437 };

//     return (
//         <div className = { classes.mapContainer }>
//             <GoogleMapReact
//                 bootstrapURLKeys={{ key: 'AIzaSyBYk2kpGJidS6ifZosEFPPFg2ycO5EaXMw' }}
//                 defaultCenter = {coordinates}
//                 center = {coordinates}
//                 defaultZoom = {14}
//                 margin = {[50, 50, 50, 50]}
//                 // options = {''}
//                 // onChange = {''}
//                 // onChildClick = {''}
//             >
               
//             </GoogleMapReact>
//         </div>
//     );
// }

// export default Map;
import React, { useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '85vh',
};

const center = {
  lat: 34.0522, // Los Angeles Latitude
  lng: -118.2437, // Los Angeles Longitude
};

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA6p0hAsUO2R0CgmstTTOG78ZcHomxTg40', // <<< Replace here
  });

  const mapRef = useRef();
  
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
    >
      {/* You can add markers like this: */}
      <Marker position={center} />
    </GoogleMap>
  );
}

export default Map;
