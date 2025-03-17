import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import workoutData from '../data/workout.json'
import projectData from '../data/project.json'
import { getCompletionStats } from '../data/userProgress'

export default function WeeksList() {
  const [stats, setStats] = useState({ completedDays: 0, totalDays: 112, completionPercentage: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      const completionStats = await getCompletionStats()
      setStats(completionStats)
      setIsLoading(false)
    }
    
    loadStats()
  }, [])
  
  // Calculate current week based on start date
  const getCurrentWeek = () => {
    const startDate = new Date(projectData.program.startDate)
    const today = new Date()
    const diffTime = Math.abs(today - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const currentWeek = Math.ceil(diffDays / 7)
    
    // Ensure we're within program bounds
    return Math.min(Math.max(currentWeek, 1), 16)
  }
  
  const currentWeek = getCurrentWeek()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{projectData.program.title}</h1>
        <p className="text-gray-400">Welcome back, {projectData.user.name}!</p>
        
        {isLoading ? (
          <div className="h-6 mt-4 bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Overall Progress</span>
              <span className="text-sm text-gray-400">{stats.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${stats.completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.completedDays} of {stats.totalDays} workouts completed
            </p>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <Link 
          to={`/week/${currentWeek}`}
          className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded text-center"
        >
          Continue to Current Week (Week {currentWeek})
        </Link>
      </div>
      
      <h2 className="text-xl font-bold mb-4">All Weeks</h2>
      
      <div className="space-y-4">
        {workoutData.map((week) => (
          <Link
            key={week.week}
            to={`/week/${week.week}`}
            className="block workout-card"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Week {week.week}</h3>
                <p className="text-gray-400">{week.goal}</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
