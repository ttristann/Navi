import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles'; // used to adjust color transparency

/**
 * Exporting a hook created by makeStyles
 * Defines custom CSS styles for components
 */
export default makeStyles((theme) => ({
  
  // Style for the title
  title: {
    display: 'none', // Hidden by default
    [theme.breakpoints.up('sm')]: {
      display: 'block', // Shown on small screens and above
    },
  },

  // Style for the search bar container
  search: {
    position: 'relative', // Position needed for placing search icon inside
    borderRadius: theme.shape.borderRadius, // Rounded corners
    backgroundColor: alpha(theme.palette.common.white, 0.15), // Slightly transparent white
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25), // More visible on hover
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto', // On small screens and up, margin added and width auto
    },
  },

  // Style for the search icon inside the search bar
  searchIcon: {
    padding: theme.spacing(0, 2), // Horizontal padding
    height: '100%', // Full height of the parent container
    position: 'absolute', // Positioned absolutely inside search container
    pointerEvents: 'none', // Clicks pass through the icon
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', // Center the icon vertically and horizontally
  },

  // Base style for the input root (input field)
  inputRoot: {
    color: 'inherit', // Inherits color from parent
  },

  // Style for the actual text input inside the search bar
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, // Additional padding on the left to make space for the search icon
    transition: theme.transitions.create('width'), // Smooth transition when width changes
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch', // Fixed width of 20 characters on medium screens and larger
    },
  },

  // Style for the toolbar container inside the AppBar
  toolbar: {
    display: 'flex', 
    justifyContent: 'space-between', // Items are spaced out to the edges
  },
}));
