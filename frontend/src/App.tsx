import type { JSX } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useTaskManagementContext } from './context/TaskManagementContext'
import { useThemeContext } from './context/ThemeContext'
import Layout from './components/Layout'
import Login from './components/Login'
import SignUp from './components/SignUp'

import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';
import Dashboard from './pages/Dashboard'
import PendingPage from './pages/PendingPage'
import CompletePage from './pages/CompletePage'
import Profile from './components/Profile'
import ScrollToTop from './components/ScrollToTop'

const ProtectedLayout = (): JSX.Element => {
  const { currentUser } = useTaskManagementContext()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout />
  )
}

const App = (): JSX.Element => {

  const { navigate } = useTaskManagementContext()
  const { theme } = useThemeContext()

  return (
    <>
      <ScrollToTop />
      <div className="bg-base-200 min-h-screen">
        <ToastContainer 
          theme={theme === 'nord' ? 'light' : 'dark'}
          position="top-center"
          autoClose={3000}
        />
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path='/'         element={<Dashboard />}    />
            <Route path='/pending'  element={<PendingPage />}  />
            <Route path='/complete' element={<CompletePage />} />
            <Route path='/profile'  element={<Profile />}      />
          </Route>

          <Route path='/login' element={
            <div className='fixed inset-0 bg-base-content/50 flex items-center justify-center px-4'>
              <Login onSwitchMode={() => navigate('/signup')} />
            </div>
          } />

          <Route path='/signup' element={
            <div className='fixed inset-0 bg-base-content/50 flex items-center justify-center px-4'>
              <SignUp onSwitchMode={() => navigate('/login')} />
            </div>
          } />
        </Routes>
      </div>
      <Analytics />
    </>
  )
}

export default App