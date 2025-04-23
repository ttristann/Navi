import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import useStyles from './styles'; // make styles is not needed

const Header = () => {
    return (
      <AppBar position="static">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Navi
          </Typography>
          <Box display="flex">
            <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
              Explore
            </Typography>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 1,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
                },
                marginLeft: 0,
                width: '100%',
                [theme => theme.breakpoints.up('sm')]: {
                  marginLeft: 1,
                  width: 'auto',
                },
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  padding: (theme) => theme.spacing(0, 2),
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search…"
                sx={{
                  color: 'inherit',
                  padding: (theme) => theme.spacing(1, 1, 1, 0),
                  // vertical padding + font size from theme
                  paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
                  transition: (theme) => theme.transitions.create('width'),
                  width: '100%',
                  [theme => theme.breakpoints.up('md')]: {
                    width: '20ch',
                  },
                }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Header;