import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>
      <App />
    </div>
  </React.StrictMode>,
)