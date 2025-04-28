import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component

// Theme dependencies from Material-UI
import { ThemeProvider } from '@mui/styles'; // Provides the theme to all child components
import { createTheme } from '@mui/material/styles'; // Function to create a Material-UI theme

// Create a default MUI theme instance (can be customized later)
const theme = createTheme();

// Create the root element for React to render into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root
root.render(
  <React.StrictMode>
    {/* Provide the MUI theme to the entire app */}
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
