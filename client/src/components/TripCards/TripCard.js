import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CardActionArea } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function TripCard({ trip, size = 'default' }) {
  const { destination, image, days, itineraryLink } = trip;
  const isSmall = size === 'small';

  return (
    <Card 
      sx={{ 
        // width: 400,
        width: isSmall ? 350 : 400,
        height: isSmall ? 280 : 350,
        // height: 350,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.12)',
        },
        m: 1, 
        bgcolor: '#ffffff',
      }}
    >
      <CardMedia
        component="img"
        height={isSmall ? '140' : '200'}
        // height="200"
        image={image}
        alt={destination}
        sx={{ 
          objectFit: 'cover',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      />
      
      <CardContent sx={{ 
        p : isSmall ? 2 : 3,
        // p: 3, 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Typography 
          variant="h6" 
          fontWeight="600"
          sx={{
            fontSize: '1.2rem',
            mb: 2,
            color: '#2c3e50'
          }}
        >
          {destination}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            color: '#5f6368'
          }}>
            <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
            <Typography variant="body2">
              {days} Days
            </Typography>
          </Box>

          <Box 
            component="a" 
            href={itineraryLink}
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 500,
              '&:hover': {
                color: '#0d47a1',
                '& .arrow-icon': {
                  transform: 'translateX(4px)',
                }
              }
            }}
          >
            <Typography variant="body2" sx={{ mr: 0.5 }}>
              View Itinerary
            </Typography>
            <ArrowForwardIcon 
              className="arrow-icon"
              sx={{ 
                fontSize: 16,
                transition: 'transform 0.2s ease-in-out'
              }} 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TripCard;