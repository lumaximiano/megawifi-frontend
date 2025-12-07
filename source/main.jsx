import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Verifica se o caminho está correto
import './styles/global.css' // Pode ou não ter este CSS, mas o importante é o App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
