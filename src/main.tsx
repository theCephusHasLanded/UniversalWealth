import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './AppRoutes'
import './index.css'
import './styles/animations.css'
import { TranslationProvider } from './contexts/TranslationContext'
import { LificosmProvider } from './contexts/LificosmContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TranslationProvider>
      <LificosmProvider>
        <AppRoutes />
      </LificosmProvider>
    </TranslationProvider>
  </React.StrictMode>,
)
