import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n' // Импорт конфигурации i18n
import './main.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
