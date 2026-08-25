import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import TaskManagementContextProvider from './context/TaskManagementContext.tsx'
import ThemeContextProvider from './context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeContextProvider>
      <TaskManagementContextProvider>
        <App />
      </TaskManagementContextProvider>
    </ThemeContextProvider>
  </BrowserRouter>
)
