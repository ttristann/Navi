import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles'; // (imported but not used in this file)

export default makeStyles(() => ({

  // Style for a Chip component (e.g., tags like "Open Now", "Free Wi-Fi", etc.)
  chip: {
    margin: '5px 5px 5px 0', // Top, Right, Bottom, Left margin (adds spacing between chips)
  },

  // Style for subtitles (e.g., rating + number of reviews)
  subtitle: {
    display: 'flex',                // Flex container
    alignItems: 'center',            // Vertically center items
    justifyContent: 'space-between', // Spread child elements apart horizontally
    marginTop: '10px',               // Top margin to add space above
  },

  // Style for general spacing between elements (used in various sections)
  spacing: {
    display: 'flex',                // Flex container
    alignItems: 'center',            // Vertically center items
    justifyContent: 'space-between', // Spread out items evenly
  },

}));
