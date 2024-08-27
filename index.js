import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // Adjust the path if your App component is located somewhere else
import './index.css';     // Ensure you have the necessary CSS file

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
