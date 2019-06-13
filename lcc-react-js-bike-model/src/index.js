import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Don't user service workers for now
// import registerServiceWorker from './registerServiceWorker';

// Once DOM is loaded, insert the React App
window.addEventListener('load', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
});

// registerServiceWorker();
