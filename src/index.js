import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { customTheme } from './utils/theme';

render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={customTheme} resetCSS>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
