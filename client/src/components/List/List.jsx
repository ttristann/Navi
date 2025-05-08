import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Rating, 
  Chip,
  CircularProgress,
  Grid
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';

/**
 * List component
 * Displays a list of places based on the current location
 */
const List = ({ places = [], isLoading, onPlaceSelect }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Places nearby
      </Typography>
      
      {places.length === 0 ? (
        <Typography variant="body1">No places found in this area.</Typography>
      ) : (
        <Grid container spacing={2}>
          {places.map((place, index) => (
            <Grid item xs={12} key={`place-list-${index}`}>
              <PlaceCard 
                place={place}
                onClick={() => onPlaceSelect(place)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

/**
 * Place Card component
 * Displays information about a single place
 */
const PlaceCard = ({ place, onClick }) => {
  return (
    <Card 
      elevation={2}
      sx={{ 
        display: 'flex', 
        cursor: 'pointer',
        '&:hover': { boxShadow: 6 }
      }}
      onClick={onClick}
    >
      {/* Place Image */}
      {place.photo && (
        <CardMedia
          component="img"
          sx={{ width: 120, height: '100%', objectFit: 'cover' }}
          image={place.photo}
          alt={place.name}
        />
      )}
      
      {/* Place Details */}
      <CardContent sx={{ flex: '1 0 auto', padding: 2 }}>
        <Typography component="div" variant="h6">
          {place.name}
        </Typography>
        
        {/* Rating */}
        {place.rating && (
          <Box display="flex" alignItems="center" mb={1}>
            <Rating size="small" value={Number(place.rating)} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {place.rating} ({place.user_ratings_total || 0})
            </Typography>
          </Box>
        )}
        
        {/* Price Level */}
        {place.price_level && (
          <Box mb={1}>
            <Typography variant="body2" color="text.secondary">
              {'$'.repeat(place.price_level)}
            </Typography>
          </Box>
        )}
        
        {/* Address */}
        <Box display="flex" alignItems="center" mb={0.5}>
          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {place.vicinity || place.address}
          </Typography>
        </Box>
        
        {/* Category */}
        {place.category && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
            <Chip 
              key={place.category} 
              label={place.category.replace(/_/g, ' ')} 
              size="small" 
              color={
                place.category === 'restaurants' ? 'error' :
                place.category === 'shopping' ? 'primary' :
                place.category === 'attractions' ? 'warning' :
                place.category === 'parks' ? 'success' : 'default'
              }
              sx={{ textTransform: 'capitalize' }} 
            />
            {place.types && place.types.slice(0, 2).map((type, i) => (
              <Chip 
                key={i} 
                label={type.replace(/_/g, ' ')} 
                size="small" 
                variant="outlined"
                sx={{ textTransform: 'capitalize' }} 
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default List;