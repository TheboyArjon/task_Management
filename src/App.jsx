// src/App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuth } from './context/AuthContext'

function AppRoutes({ dark, setDark }) {
  const { currentUser } = useAuth()

  return (
    <>
      {currentUser && <Navbar dark={dark} setDark={setDark} />}
      <Routes>
        <Route path="/login"    element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
        <AppRoutes dark={dark} setDark={setDark} />
      </AuthProvider>
    </BrowserRouter>
  )
}
