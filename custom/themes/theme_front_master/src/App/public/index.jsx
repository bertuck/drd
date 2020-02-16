import React from 'react';
import ReactDOM from 'react-dom';

import App from "../src/App.jsx";

/*if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js');
}*/

ReactDOM.render((<App/>), document.getElementById('root'));