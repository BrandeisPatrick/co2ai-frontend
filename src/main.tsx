import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DataContextProvider, ThemeProvider } from '@/shared'
import { AuthProvider } from '@/features/auth'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DataContextProvider autoSync={true} syncInterval={5 * 60 * 1000}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DataContextProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
