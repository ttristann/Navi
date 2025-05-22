import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, InputBase, TextField, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import TripCard from '../../components/TripCards/TripCard';

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


function Trips() {
  const [searchInput, setSearchInput] = useState('');
  const [location, setLocation] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      setSearchInput(place.formatted_address || place.name);
      setLocation({
        name: place.formatted_address || place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  }, []);

  const handleSubmit = () => {
    if (!location || !startDate || !endDate) {
      alert('Please fill out all fields');
      return;
    }

    const params = new URLSearchParams({
      lat: location.lat,
      lng: location.lng,
      name: location.name,
      start: startDate,
      end: endDate,
    });

    navigate(`/ExploreTo?${params.toString()}`);
  };
  return (
    <Box
      display='flex'
      gap={2}
      alignItems='center'
      justifyContent='center'
      width='100%'
      height='100vh'
    >
      {/* Left Card */}
      <Card
        sx={{
          width: '30%',
          height: '70%',
          display: 'flex',
          alignItems: 'center', 
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Title */}
        <Typography
          variant='h5'
          sx={{
            fontWeight: 'bold',
            paddingTop: 5,
            paddingBottom: 5,
            color: '#212C59',
            fontSize: '1.6rem'
          }}
        >
          Plan A New Trip
        </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          border: '1px solid #ddd',
          borderRadius: 2,
          px: 2,
          width: '60%',

        }}
      >
        <LocationOnIcon sx={{ mr: 1, color: 'gray' }} />
        <InputBase
          inputRef={inputRef}
          placeholder="To"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Start Date */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          border: '1px solid #ddd',
          borderRadius: 2,
          px: 2,
          width: '60%'
        }}
      >
        <CalendarMonthIcon sx={{ mr: 1, color: 'gray' }} />
        <TextField
          type="date"
          variant="standard"
          InputProps={{ disableUnderline: true }}
          fullWidth
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </Box>

      {/* End Date */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          border: '1px solid #ddd',
          borderRadius: 2,
          px: 2,
          width: '60%'
        }}
      >
        <CalendarMonthIcon sx={{ mr: 1, color: 'gray' }} />
        <TextField
          type="date"
          variant="standard"
          InputProps={{ disableUnderline: true }}
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
          backgroundColor: '#1e2a55',
          color: '#fff',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          mt: 1,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: '#2c3a75',
          },
          width: '30%',
          mt: 5
        }}
      >
        Plan it
      </Button>
      </Card>

      {/* Right Card */}
      <Card
        sx={{
          width: '60%',
          height: '70%',
          display: 'flex',
        }}
      >

        <Box
          sx={{
            width: '100%',
            height: '100%',
            p: 2,
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            pt: 4

          }}
        >
          {/* Title */}
          <Typography
            variant='h5'
            sx={{ fontWeight: 'bold', mb: 2, color: '#212C59', pb: 5, fontSize: '1.6rem'}}
          >
            Your Trips
          </Typography>

          {/* Trip Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 2,
              justifyItems: 'center',  
              maxWidth: '90%',
              pb: 10
            }}
          >
            {popularTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} size='small'/>
            ))}
          </Box>
        </Box>
      </Card>

    </Box>
  )
}

export default Trips

