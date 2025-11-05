import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { DataContextProvider } from './contexts/DataContext'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <DataContextProvider autoSync={true} syncInterval={5 * 60 * 1000}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
