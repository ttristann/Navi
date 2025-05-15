import React, { useState } from 'react';
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

/**
 * List component
 * Displays a list of places based on the current location with drag functionality
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
 * Displays information about a single place with drag functionality
 */
const PlaceCard = ({ place, onClick }) => {
  // State to track if the card is being dragged
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    // Store place data in the drag event
    e.dataTransfer.setData('text/plain', JSON.stringify(place));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a drag image
    const dragImage = document.createElement('div');
    dragImage.style.width = '100px';
    dragImage.style.height = '30px';
    dragImage.style.background = place.category === 'restaurants' ? '#F44336' :
                                place.category === 'shopping' ? '#2196F3' :
                                place.category === 'attractions' ? '#FF9800' :
                                place.category === 'parks' ? '#4CAF50' : '#757575';
    dragImage.style.color = '#fff';
    dragImage.style.padding = '5px';
    dragImage.style.borderRadius = '4px';
    dragImage.style.display = 'flex';
    dragImage.style.alignItems = 'center';
    dragImage.style.justifyContent = 'center';
    dragImage.textContent = place.name;
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 50, 15);
    
    // Remove the dragImage after a moment
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        display: 'flex', 
        cursor: isDragging ? 'grabbing' : 'pointer',
        opacity: isDragging ? 0.7 : 1,
        '&:hover': { boxShadow: 6 }
      }}
      onClick={() => !isDragging && onClick()}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Drag Handle Indicator */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '0 4px',
          color: 'text.secondary',
          cursor: 'grab'
        }}
      >
        <DragIndicatorIcon />
      </Box>
      
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