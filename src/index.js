import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Theme Dependencies
import { ThemeProvider} from '@mui/styles'
import { createTheme} from '@mui/material/styles'; // for creating a basic theme

const theme = createTheme(); // can be customized later on when needed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
