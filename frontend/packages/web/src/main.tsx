import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setConfig } from "../../shared/dist";

setConfig({
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/24bet',
  NODE_ENV: import.meta.env.MODE
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
