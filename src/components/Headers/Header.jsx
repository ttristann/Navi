import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useStyles from './styles';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Header = () => {
  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: 'transparent',
        backgroundColor: 'transparent', 
        boxShadow: 'none',
        color: "black",
      }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
      {/* Left side: Navi */}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Navi
        </Typography>

        {/* Right side: Explore + Trips */}
        <Box display="flex" alignItems="center" gap={5} pr={10}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginRight: 3 }}>
            Explore
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Trips
          </Typography>
        </Box>

        {/* <Box display="flex" alignItems="center">
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
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
