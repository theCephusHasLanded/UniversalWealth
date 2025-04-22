import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/animations.css'
import './styles/globals.css'
import { TranslationProvider } from './contexts/TranslationContext'
import { LificosmProvider } from './contexts/LificosmContext'
import { AuthProvider } from './auth/AuthContext'

// Enable future flags for React Router v7 compatibility
const router = createBrowserRouter(
  [{ 
    path: '*', 
    element: (
      <TranslationProvider>
        <AuthProvider>
          <LificosmProvider>
            <App />
          </LificosmProvider>
        </AuthProvider>
      </TranslationProvider>
    ) 
  }],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
