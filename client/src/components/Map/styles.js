import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles'; // (imported but not used in this file)

export default makeStyles(() => ({

  // Style for a Paper component (could be used for map popups or info windows)
  paper: {
    padding: '10px',                // Inner spacing
    display: 'flex',                // Flex container
    flexDirection: 'column',        // Stack child elements vertically
    justifyContent: 'center',       // Center content vertically
    width: '100px',                 // Fixed width
  },

  // Style for the overall map container
  mapContainer: {
    height: '85vh',                 // 85% of the viewport height
    width: '100%',                  // Full width of its parent
  },

  // Style for each marker container (for pins on the map)
  markerContainer: {
    position: 'absolute',           // Absolutely positioned based on map coordinates
    transform: 'translate(-50%, -50%)', // Center the marker exactly at the coordinate point
    zIndex: 1,                      // Layering order (below hover state)
    '&:hover': { zIndex: 2 },        // Bring marker to front on hover
  },

  // Style for clickable elements (like markers)
  pointer: {
    cursor: 'pointer',              // Shows pointer cursor on hover (indicates clickable)
  },

}));
