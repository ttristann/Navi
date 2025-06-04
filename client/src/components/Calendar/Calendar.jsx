import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  IconButton,
  Tooltip,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useUser } from '../../context/UserContext';

// Styled components for calendar elements
const CalendarContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '1500px',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2]
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText
}));

const CalendarDays = styled(Box)({
  display: 'flex',
  flex: '0 0 auto',
  borderBottom: '1px solid #e0e0e0'
});

const DayColumn = styled(Box)(({ theme, isToday }) => ({
  flex: 1,
  textAlign: 'center',
  padding: theme.spacing(1, 0),
  backgroundColor: isToday ? theme.palette.primary.light : 'transparent',
  color: isToday ? theme.palette.primary.contrastText : 'inherit',
  fontWeight: isToday ? 'bold' : 'normal'
}));

const CalendarGrid = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'auto'
});

const TimeColumn = styled(Box)(({ theme }) => ({
  width: '60px',
  borderRight: '1px solid #e0e0e0',
  overflowY: 'hidden'
}));

const TimeSlot = styled(Box)(({ theme }) => ({
  height: '50px',
  padding: theme.spacing(0, 1),
  borderBottom: '1px solid #f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary
}));

const DayGrid = styled(Box)({
  flex: 1,
  display: 'flex'
});

const DayColumn2 = styled(Box)({
  flex: 1,
  position: 'relative',
  borderRight: '1px solid #f0f0f0'
});

const DropZone = styled(Box)(({ theme, isOver }) => ({
  height: '50px',
  borderBottom: '1px solid #f0f0f0',
  backgroundColor: isOver ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
  transition: 'background-color 0.2s',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  }
}));

const EventItem = styled(Paper)(({ theme, category }) => {
  let bgColor = '#757575';
  
  if (category === 'restaurants') bgColor = '#F44336';
  else if (category === 'shopping') bgColor = '#2196F3';
  else if (category === 'attractions') bgColor = '#FF9800';
  else if (category === 'parks') bgColor = '#4CAF50';
  
  return {
    position: 'absolute',
    left: '2px',
    right: '2px',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0.5),
    backgroundColor: bgColor,
    color: '#fff',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    zIndex: 1,
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[4]
    }
  };
});

const DateSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.dark,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.contrastText
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1)
}));

/**
 * Calendar component for scheduling places
 */
const Calendar = ({ 
  places, 
  onEventAdded, 
  onEventRemoved, 
  itineraryId, 
  onSaveSuccess,
  onSaveError,
  initialEvents = []
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [events, setEvents] = useState([]);
  const [dropTarget, setDropTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // Dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [itineraryTitle, setItineraryTitle] = useState('');
  const [itineraryDescription, setItineraryDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  
  const { user } = useUser();
  const userId = user?.id;

  // Load initial events if provided
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);
  
  // Generate week days
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const day = addDays(weekStart, i);
    return {
      date: day,
      dayName: format(day, 'EEE').toUpperCase(),
      dayNumber: format(day, 'd'),
      isToday: isSameDay(day, new Date())
    };
  });
  
  // Generate time slots for 24 hours (0 to 23)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i; // 0 to 23
    return {
      hour,
      label: `${hour % 12 === 0 ? 12 : hour % 12} ${hour >= 12 ? 'PM' : 'AM'}`
    };
  });
  
  // Handle previous week
  const handlePrevWeek = () => {
    const newWeekStart = addDays(weekStart, -7);
    setWeekStart(newWeekStart);
  };
  
  // Handle next week
  const handleNextWeek = () => {
    const newWeekStart = addDays(weekStart, 7);
    setWeekStart(newWeekStart);
  };
  
  // Handle drag over
  const handleDragOver = (e, dayIndex, hourIndex) => {
    e.preventDefault();
    setDropTarget({ day: dayIndex, hour: hourIndex });
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setDropTarget(null);
  };
  
  // Handle drop
  const handleDrop = (e, dayIndex, hourIndex) => {
    e.preventDefault();
  
    const categoryMapping = {
      'restaurants': ['restaurant', 'cafe', 'bar', 'food'],
      'shopping': ['shopping_mall', 'store', 'clothing_store', 'electronics_store'],
      'attractions': ['tourist_attraction', 'museum', 'amusement_park', 'art_gallery'],
      'parks': ['park', 'campground', 'natural_feature', 'points_of_interest']
    };
  
    const determineCategory = (types = []) => {
      for (const [category, typeList] of Object.entries(categoryMapping)) {
        if (types.some(type => typeList.includes(type))) {
          return category;
        }
      }
      return 'other';
    };
  
    let placeData;
  
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        placeData = JSON.parse(jsonData);
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
  
    if (!placeData) {
      try {
        const textData = e.dataTransfer.getData('text/plain');
        if (textData) {
          try {
            placeData = JSON.parse(textData);
          } catch {
            const placeId = textData;
            placeData = places.find(p => p.id === placeId);
          }
        }
      } catch (error) {
        console.error('Error getting place data from text:', error);
      }
    }
  
    if (!placeData) {
      console.error('No valid place data found in drop event.');
      return;
    }
  
    // Ensure category is attached
    const category = placeData.category || determineCategory(placeData.types || []);
  
    const day = weekDays[dayIndex].date;
    const hour = timeSlots[hourIndex].hour;
    const endHour = hour + 1;
  
    const newEvent = {
      id: `event-${placeData.id}-${Date.now()}`,
      placeId: placeData.id,
      place: {
        ...placeData,
        category
      },
      date: day,
      startHour: hour,
      endHour,
      dayIndex,
      timeIndex: hourIndex
    };
  
    setEvents([...events, newEvent]);
  
    if (onEventAdded) {
      onEventAdded(newEvent);
    }
  
    setDropTarget(null);
  };
  
  
  // Handle remove event
  const handleRemoveEvent = (e, eventId) => {
    e.stopPropagation(); // Prevent event bubbling
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    
    if (onEventRemoved) {
      onEventRemoved(eventId);
    }
  };
  
  // Handle save button click - open dialog
  const handleSaveClick = () => {
    if (!userId) {
      setSaveMessage('User not logged in.');
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    if (events.length === 0) {
      setSaveMessage('No events to save');
      setAlertSeverity('warning');
      setShowAlert(true);
      return;
    }

    // Generate default title based on date range
    const defaultTitle = `Trip ${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 4), 'MMM d, yyyy')}`;
    setItineraryTitle(defaultTitle);
    setItineraryDescription('');
    setTitleError('');
    setShowSaveDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowSaveDialog(false);
    setTitleError('');
  };

  // Validate form
  const validateForm = () => {
    if (!itineraryTitle.trim()) {
      setTitleError('Title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  // Handle save calendar events (actual save logic)
  const handleSaveItinerary = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setShowSaveDialog(false);

    try {
      // Step 1: Create the itinerary with user-provided title and description
      const itineraryRes = await fetch(`http://localhost:4000/api/itineraries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: itineraryTitle.trim(),
          description: itineraryDescription.trim() || 'Generated from Calendar'
        }),
      });
  
      const itineraryData = await itineraryRes.json();
  
      if (!itineraryRes.ok) {
        throw new Error(itineraryData.error || 'Failed to create itinerary');
      }
  
      const newItineraryId = itineraryData.id;
  
      // Step 2: Save the calendar events
      const placesRes = await fetch(`http://localhost:4000/api/itineraries/${newItineraryId}/places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
  
      const placesData = await placesRes.json();
  
      if (!placesRes.ok) {
        throw new Error(placesData.error || 'Failed to save calendar events');
      }
  
      setSaveMessage(`Itinerary "${itineraryTitle}" created and ${placesData.length} places saved!`);
      setAlertSeverity('success');
      setShowAlert(true);
  
      if (onSaveSuccess) {
        onSaveSuccess({ itineraryId: newItineraryId, events: placesData });
      }
    } catch (error) {
      console.error('Error saving calendar events:', error);
      setSaveMessage(`Error: ${error.message}`);
      setAlertSeverity('error');
      setShowAlert(true);
  
      if (onSaveError) {
        onSaveError(error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle share (placeholder for now)
  const handleShare = () => {
    if (navigator.share && itineraryId) {
      navigator.share({
        title: 'My Travel Itinerary',
        text: 'Check out my travel itinerary!',
        url: `${window.location.origin}/itinerary/${itineraryId}`,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      const shareUrl = `${window.location.origin}/itinerary/${itineraryId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setSaveMessage('Itinerary link copied to clipboard!');
        setAlertSeverity('info');
        setShowAlert(true);
      }).catch(() => {
        setSaveMessage('Unable to copy link');
        setAlertSeverity('error');
        setShowAlert(true);
      });
    }
  };
  
  // Find events for a specific day and time slot
  const getEventsForSlot = (dayIndex, hourIndex) => {
    return events.filter(event => 
      event.dayIndex === dayIndex && 
      hourIndex >= event.timeIndex && 
      hourIndex < (event.timeIndex + (event.endHour - event.startHour))
    );
  };
  
  // Calculate event style based on position
  const calculateEventStyle = (event) => {
    const duration = event.endHour - event.startHour;
    const height = duration * 50 - 4; // Height of time slot (50px) * duration - padding
    
    return {
      height: `${height}px`
    };
  };
  
  // Check if this is the start of an event
  const isEventStart = (event, hourIndex) => {
    return hourIndex === event.timeIndex;
  };

  // Close alert
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  
  return (
    <>
      <CalendarContainer>
        {/* Calendar Header */}
        <CalendarHeader>
          <DateSelector>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 4), 'MMM d, yyyy')}
            </Typography>
            <IconButton size="small" onClick={handlePrevWeek} sx={{ color: 'inherit', ml: 1 }}>
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleNextWeek} sx={{ color: 'inherit' }}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </DateSelector>
          
          <ActionButtons>
            <Button 
              variant="contained" 
              color="success" 
              size="small"
              sx={{ color: '#fff' }}
              onClick={handleSaveClick}
              disabled={isSaving || events.length === 0}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="small"
              sx={{ color: '#fff', borderColor: '#fff' }}
              onClick={handleShare}
              disabled={!itineraryId}
              startIcon={<ShareIcon />}
            >
              Share
            </Button>
          </ActionButtons>
        </CalendarHeader>
        
        {/* Calendar Days */}
        <CalendarDays>
          <Box sx={{ width: '60px' }}></Box>
          {weekDays.map((day, index) => (
            <DayColumn key={index} isToday={day.isToday}>
              <Typography variant="subtitle2">{day.dayName}</Typography>
              <Typography variant="h6">{day.dayNumber}</Typography>
            </DayColumn>
          ))}
        </CalendarDays>
        
        {/* Calendar Grid */}
        <CalendarGrid>
          {/* Time Column */}
          <TimeColumn>
            {timeSlots.map((slot, index) => (
              <TimeSlot key={index}>
                {slot.label}
              </TimeSlot>
            ))}
          </TimeColumn>
          
          {/* Day Columns */}
          <DayGrid>
            {weekDays.map((day, dayIndex) => (
              <DayColumn2 key={dayIndex}>
                {timeSlots.map((timeSlot, hourIndex) => {
                  const isOver = dropTarget && dropTarget.day === dayIndex && dropTarget.hour === hourIndex;
                  
                  return (
                    <DropZone 
                      key={hourIndex}
                      isOver={isOver}
                      onDragOver={(e) => handleDragOver(e, dayIndex, hourIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, dayIndex, hourIndex)}
                    >
                      {getEventsForSlot(dayIndex, hourIndex).map((event, eventIndex) => {
                        // Only render the event at its start position
                        if (isEventStart(event, hourIndex)) {
                          const eventStyle = calculateEventStyle(event);
                          
                          return (
                            <EventItem 
                              key={event.id} 
                              style={eventStyle}
                              category={event.place.category}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" noWrap>
                                  {`${timeSlots[event.timeIndex].label} - ${timeSlots[Math.min(event.timeIndex + (event.endHour - event.startHour), 23)].label}`}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  sx={{ color: 'inherit', p: 0 }}
                                  onClick={(e) => handleRemoveEvent(e, event.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography variant="body2" noWrap sx={{ fontWeight: 'bold' }}>
                                {event.place.name}
                              </Typography>
                            </EventItem>
                          );
                        }
                        return null;
                      })}
                    </DropZone>
                  );
                })}
              </DayColumn2>
            ))}
          </DayGrid>
        </CalendarGrid>
      </CalendarContainer>

      {/* Save Itinerary Dialog */}
      <Dialog 
        open={showSaveDialog} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Your Itinerary</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            label="Itinerary Title"
            fullWidth
            variant="outlined"
            value={itineraryTitle}
            onChange={(e) => setItineraryTitle(e.target.value)}
            error={!!titleError}
            helperText={titleError || 'Give your itinerary a memorable name'}
            required
          />
          <TextField
            margin="normal"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={itineraryDescription}
            onChange={(e) => setItineraryDescription(e.target.value)}
            helperText="Add a description to help you remember this trip"
            placeholder="Tell us about your trip plans..."
          />
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              📅 <strong>Date Range:</strong> {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 4), 'MMM d, yyyy')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              📍 <strong>Places:</strong> {events.length} scheduled
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveItinerary} 
            variant="contained" 
            color="primary"
            disabled={!itineraryTitle.trim()}
          >
            Save Itinerary
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Alert */}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity} 
          sx={{ width: '100%' }}
        >
          {saveMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Calendar;