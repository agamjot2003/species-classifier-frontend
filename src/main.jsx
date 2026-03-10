import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This finds the <div id="root"> in index.html
// and tells React to render your entire App inside it.
// This runs once when the page loads — it's the ignition key.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)