import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, alpha } from '@mui/material'; // Material UI components for styling and layout
import SearchIcon from '@mui/icons-material/Search'; // Icon for the search bar

import useStyles from './styles'; // (Currently not used in this file but could be for custom styling)

/**
 * Header component for the application
 * Displays a navigation bar with the app name, an 'Explore' label, and a search input
 */
const Header = () => {
  return (
    // AppBar is the main top bar container
    <AppBar position="static">
      {/* Toolbar arranges the child elements horizontally */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Application name on the left side */}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Navi
        </Typography>

        {/* Right side of the header containing 'Explore' and the search input */}
        <Box display="flex" alignItems="center">
          
          {/* 'Explore' label next to the search bar */}
          <Typography variant="h6" sx={{ marginRight: 2 }}>
            Explore
          </Typography>

          {/* Container for the search icon and search input */}
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ backgroundColor: 'white', borderRadius: 1, padding: '0 8px' }}
          >
            {/* Search icon inside the search box */}
            <SearchIcon sx={{ color: 'gray', mr: 1 }} />
            
            {/* Input field for entering search queries */}
            <InputBase
              placeholder="Search..."
              sx={{ width: 200 }}
            />
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
