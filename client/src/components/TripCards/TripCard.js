import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function TripCard({ trip, size = 'default' }) {
  const { destination, description, days, itineraryLink } = trip;
  const isSmall = size === 'small';

  return (
    <Card 
      sx={{ 
        width: isSmall ? 350 : 400,
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
      <CardContent sx={{ 
        p: isSmall ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.8, // small vertical spacing between sections
      }}>
        <Typography 
          variant="h6" 
          fontWeight="600"
          sx={{
            fontSize: '1.2rem',
            color: '#2c3e50'
          }}
        >
          {destination}
        </Typography>

        {description && (
          <Typography 
            variant="body2"
            sx={{
              color: '#555',
              lineHeight: 1.4
            }}
          >
            {description}
          </Typography>
        )}

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
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
      </CardContent>
    </Card>
  );
}

export default TripCard;
