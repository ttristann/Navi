import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import TripCard from './TripCard';

function PopularTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/itineraries/all`);
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <Box sx={{ mt: 7, mb: 6, px: 8, display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', minHeight: '100vh'}}>
      <Typography
        variant="h4"
        component="h3"
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

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 6, flexGrow: 1, height: '100%', overflowY: 'auto'}} justifyContent="flex-start">
          {trips.map((trip) => (
            <Grid item xs={12} sm={4} md={4} key={trip.id}>
              <TripCard
                trip={{
                  id: trip.id,
                  destination: trip.title || 'Unknown Destination',
                  description: trip.description || 'No description available',
                  image: `/images/${trip.destinations?.[0]?.replace(/\s+/g, '-') || 'default'}.png`,
                  days: '3', // replace with actual data if available
                  itineraryLink: `/ExploreTo?itineraryId=${trip.id}`
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default PopularTrips;
