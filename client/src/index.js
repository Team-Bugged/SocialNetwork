import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a66c2',
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
  <ThemeProvider theme={theme}  >
    <App />
  </ThemeProvider>
  </BrowserRouter>
);
