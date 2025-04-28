import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import useStyles from './styles'; // make styles is not needed

const Header = () => {
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
          <Box display="flex" alignItems="center" sx={{ backgroundColor: 'white', borderRadius: 1, padding: '0 8px' }}>
            <SearchIcon sx={{ color: 'gray', mr: 1 }} />
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