import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';

/**
 * Exporting a hook created by makeStyles
 * Defines custom CSS styles for the List component and its children
 */
export default makeStyles((theme) => ({

  // Style for the form control (Select dropdowns)
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginBottom: '30px', // Adds extra spacing at the bottom
  },

  // Style for empty select elements
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  // Style for loading state (centered loader)
  loading: {
    height: '600px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Center loading spinner vertically and horizontally
  },

  // Container style for the whole List component
  container: {
    padding: '25px', // Padding around
  },

  // For adding bottom margin
  marginBottom: {
    marginBottom: '30px',
  },

  // Style for the list of places
  list: {
    height: '75vh',           // List takes up 75% of the viewport height
    overflowY: 'auto',        // Vertical scrolling enabled
    overflowX: 'hidden',      // Prevent horizontal scrolling
    display: 'flex',          // Flex container
    flexDirection: 'column',  // Stack child elements vertically
  },

  // Style for slightly larger form control
  formControlSmall: {
    minWidth: 200,             // Wider minimum width
    marginBottom: '8px',
    marginRight: theme.spacing(2), // Space between Type and Rating dropdowns
  },

  // Style for smaller form control
  formControlSmaller: {
    minWidth: 120,             // Smaller minimum width
    marginBottom: '8px',
  },
}));
