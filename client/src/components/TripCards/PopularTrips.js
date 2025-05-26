import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import TripCard from './TripCard';

// Dummy data for the cards
const popularTrips = [
  {
    id: 1,
    destination: 'San Diego, CA',
    image: '/images/San Diego.png',
    days: '3',
    itineraryLink: '/itinerary/san-diego'  // for this, prob will have to have some sort of link already premade and ready?
  },
  {
    id: 2,
    destination: 'San Francisco, CA',
    image: '/images/San Francisco.png', 
    days: '2',
    itineraryLink: '/itinerary/san-francisco'
  },
  {
    id: 3,
    destination: 'Seattle, WA',
    image: '/images/Seattle.png', 
    days: '4',
    itineraryLink: '/itinerary/seattle'
  },

];

function PopularTrips() {
  return (
    <Box sx={{ mt: 7, mb: 6, px: 8 }}>

      <Typography
        variant="h4"
        component="h3"
        // color="#1E3A8A"
        sx={{
          fontWeight: 'bold',
          mb: 3,
          ml: 2,
          marginTop: 13,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: -8,
            width: 140,
            height: 4,
            backgroundColor: '#1e2a55',
            borderRadius: 2
          }
        }}
      >
        Current Popular Trips
      </Typography>

      {/* <Box
        sx={{
          position: 'relative',
          mt: 1,
          height: 6,
          backgroundColor: '#1e2a55',
          width: '100%',
          borderRadius: 2,
          pl: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '80px',
            backgroundColor: '#0057ff',
          },
        }}
      /> */}
      <Grid container spacing={4} sx={{ mt: 6 }} justifyContent="center">
        {popularTrips.map((trip) => (
          <Grid item xs={12} sm={6} md={4} key={trip.id}>
            <TripCard trip={trip} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PopularTrips;