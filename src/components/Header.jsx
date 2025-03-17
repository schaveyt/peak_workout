import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCompletionStats } from '../data/userProgress'
import { useState, useEffect } from 'react'

export default function Header() {
  const [stats, setStats] = useState({ completedDays: 0, totalDays: 112, completionPercentage: 0 })
  const location = useLocation()
  
  useEffect(() => {
    const loadStats = async () => {
      const completionStats = await getCompletionStats()
      setStats(completionStats)
    }
    
    loadStats()
  }, [location.pathname]) // Reload stats when route changes
  
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center max-w-2xl">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-xl font-bold text-white">
            Peak Workout
          </Link>
          <div className="ml-4 bg-blue-900/50 text-blue-200 text-xs px-2 py-1 rounded-full">
            {stats.completionPercentage}% Complete
          </div>
        </div>
        
        <nav className="flex space-x-4">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Program
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            Exercise History
          </Link>
        </nav>
      </div>
    </header>
  )
}
