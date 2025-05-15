import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

// Styled components for calendar elements
const CalendarContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '300px',
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
  overflowY: 'auto'
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
  backgroundColor: isOver ? theme.palette.action.hover : 'transparent',
  transition: 'background-color 0.2s',
  position: 'relative'
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
const Calendar = ({ places, onEventAdded, onEventRemoved }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [events, setEvents] = useState([]);
  const [draggedPlace, setDraggedPlace] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  
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
  
  // Generate time slots
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start at 8 AM
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
  
  // Handle drag start
  const handleDragStart = (e, place) => {
    setDraggedPlace(place);
    // Set custom drag image or data if needed
    e.dataTransfer.setData('text/plain', place.id);
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  // Handle drag over
  const handleDragOver = (e, day, hour) => {
    e.preventDefault();
    setDropTarget({ day, hour });
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setDropTarget(null);
  };
  
  // Handle drop
  const handleDrop = (e, dayIndex, hourIndex) => {
    e.preventDefault();
    if (!draggedPlace) return;
    
    const day = weekDays[dayIndex].date;
    const hour = timeSlots[hourIndex].hour;
    const endHour = hour + 1; // Default 1 hour event
    
    const newEvent = {
      id: `event-${draggedPlace.id}-${Date.now()}`,
      placeId: draggedPlace.id,
      place: draggedPlace,
      date: day,
      startHour: hour,
      endHour: endHour,
      dayIndex,
      timeIndex: hourIndex
    };
    
    setEvents([...events, newEvent]);
    
    if (onEventAdded) {
      onEventAdded(newEvent);
    }
    
    setDraggedPlace(null);
    setDropTarget(null);
  };
  
  // Handle remove event
  const handleRemoveEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    
    if (onEventRemoved) {
      onEventRemoved(eventId);
    }
  };
  
  // Find events for a specific day and time slot
  const getEventsForSlot = (dayIndex, hourIndex) => {
    return events.filter(event => 
      event.dayIndex === dayIndex && 
      hourIndex >= (event.timeIndex) && 
      hourIndex < (event.timeIndex + (event.endHour - event.startHour))
    );
  };
  
  // Calculate event style based on position
  const calculateEventStyle = (event, hourIndex) => {
    const duration = event.endHour - event.startHour;
    const top = 0;
    const height = duration * 50 - 4; // Height of time slot (50px) * duration - padding
    
    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };
  
  // Check if this is the start of an event
  const isEventStart = (event, hourIndex) => {
    return hourIndex === event.timeIndex;
  };
  
  return (
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
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            size="small"
            sx={{ color: '#fff', borderColor: '#fff' }}
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
                const slotEvents = getEventsForSlot(dayIndex, hourIndex);
                const isOver = dropTarget && dropTarget.day === dayIndex && dropTarget.hour === hourIndex;
                
                return (
                  <DropZone 
                    key={hourIndex}
                    isOver={isOver}
                    onDragOver={(e) => handleDragOver(e, dayIndex, hourIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, dayIndex, hourIndex)}
                  >
                    {slotEvents.map((event, eventIndex) => {
                      // Only render the event at its start position
                      if (isEventStart(event, hourIndex)) {
                        const eventStyle = calculateEventStyle(event, hourIndex);
                        
                        return (
                          <EventItem 
                            key={event.id} 
                            style={eventStyle}
                            category={event.place.category}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" noWrap>
                                {`${timeSlots[event.timeIndex].label} - ${timeSlots[event.timeIndex + (event.endHour - event.startHour) - 1].label}`}
                              </Typography>
                              <IconButton 
                                size="small" 
                                sx={{ color: 'inherit', p: 0 }}
                                onClick={() => handleRemoveEvent(event.id)}
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
  );
};

export default Calendar;