// import React from 'react';
// import { useState } from 'react';
// import { Autocomplete } from '@react-google-maps/api';
// import { AppBar, Toolbar, Typography, InputBase, Box, alpha } from '@mui/material'; // Material UI components for styling and layout
// import SearchIcon from '@mui/icons-material/Search'; // Icon for the search bar

// import useStyles from './styles'; // (Currently not used in this file but could be for custom styling)

// /**
//  * Header component for the application
//  * Displays a navigation bar with the app name, an 'Explore' label, and a search input
//  */
// const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// const Header = ({onSearch}) => {
//   // Search handling
//   const [searchInput, setSearchInput] = useState('');
//   const [autocomplete, setAutocomplete] = useState(null);

//   // Autocomplete Search
//   const onLoad = (autoC) => setAutocomplete(autoC);
//   const onPlaceChanged = () => {
//     if (autocomplete !== null) {
//       const place = autocomplete.getPlace();
//       if (place && place.geometry && place.geometry.location) {
//         const lat = place.geometry.location.lat();
//         const lng = place.geometry.location.lng();
//         onSearch({ lat, lng });
//       } else {
//         alert('No details available for the selected location. Please select a valid place.');
//       }
//     } else {
//       console.log('Autocomplete is not loaded yet!');
//     }
//   };
  

//   const handleKeyPress = async (e) => {
//     if (e.key == 'Enter'){
//       try {
//         const response = await fetch(
//           `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${apiKey}`
//         );
//         const data = await response.json();
//         console.log('Geocode API Resonse:', data)
//         if (data.status === "OK" && data.results.length > 0) {
//           const location = data.results[0].geometry.location;
//           onSearch({ lat: location.lat, lng: location.lng });
//         } else {
//           alert(`Place not found! (Status: ${data.status})`);
//         }
//       } catch (error) {
//         console.error('Error fetching location: ', error)
//       }
//     }
//   }

//   return (
//     // AppBar is the main top bar container
//     <AppBar position="static">
//       {/* Toolbar arranges the child elements horizontally */}
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
//         {/* Application name on the left side */}
//         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//           Navi
//         </Typography>

//         {/* Right side of the header containing 'Explore' and the search input */}
//         <Box display="flex" alignItems="center">
          
//           {/* 'Explore' label next to the search bar */}
//           <Typography variant="h6" sx={{ marginRight: 2 }}>
//             Explore
//           </Typography>

//           {/* Container for the search icon and search input */}
//           <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//             <Box 
//               display="flex" 
//               alignItems="center" 
//               sx={{ backgroundColor: 'white', borderRadius: 1, padding: '0 8px' }}
//             >
//               {/* Search icon inside the search box */}
//               <SearchIcon sx={{ color: 'gray', mr: 1 }} />
              
//               {/* Input field for entering search queries */}
//               <InputBase
//                 placeholder="Search..."
//                 sx={{ width: 200 }}
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//               />
//             </Box>
//           </Autocomplete>
//         </Box>

//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;


import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useStyles from './styles';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onSearch({ lat, lng });
      }
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      if (autocomplete) {
        const place = autocomplete.getPlace();
        // If autocomplete has a proper place, let onPlaceChanged handle it
        if (place && place.geometry && place.geometry.location) {
          return; // Do nothing — Autocomplete handled it
        }
      }
      // Otherwise, fallback to manual geocode fetch
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${apiKey}`
        );
        const data = await response.json();
        console.log('Manual Geocode API Response:', data);
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

          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ backgroundColor: 'white', borderRadius: 1, padding: '0 8px' }}
            >
              <SearchIcon sx={{ color: 'gray', mr: 1 }} />
              <InputBase
                placeholder="Search..."
                sx={{ width: 200 }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </Box>
          </Autocomplete>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
