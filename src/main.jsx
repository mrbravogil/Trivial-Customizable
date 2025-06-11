import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { QuizSetupProvider } from './context/QuizSetupContext.jsx'
createRoot(document.getElementById('root')).render(
  <QuizSetupProvider>
    <StrictMode>
      <App />
    </StrictMode>,
  </QuizSetupProvider>
)
