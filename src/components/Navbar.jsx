// src/components/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, CheckSquare, Moon, Sun, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar({ dark, setDark }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      toast.error('Failed to log out')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 dark:border-surface-700 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <CheckSquare size={16} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-surface-900 dark:text-white">
            TaskFlow
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Dark mode */}
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {currentUser && (
            <>
              {/* User pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100 dark:bg-surface-800">
                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                  <User size={11} className="text-white" />
                </div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300 max-w-[140px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
