import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import MUI from './components/MUI';

ReactDOM.render(
  <React.StrictMode>
    <MUI>
      <App />
    </MUI>
  </React.StrictMode>,
  document.getElementById('root')
);
