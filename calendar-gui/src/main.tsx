import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <div>
        <div className="axis-line" id="x-axis-line"></div>
        <div className="axis-line" id="y-axis-line"></div>
        <App />
    </div>
  </React.StrictMode>,
)
