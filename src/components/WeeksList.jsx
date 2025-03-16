import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import workoutData from '../data/workout.json'
import projectData from '../data/project.json'

export default function WeeksList() {
  // Function to calculate date range for a specific week
  const getWeekDateRange = (weekNum) => {
    const startDate = new Date(projectData.program.startDate)
    const weekStartDate = new Date(startDate)
    
    // Add (weekNum - 1) weeks to the start date
    weekStartDate.setDate(startDate.getDate() + (parseInt(weekNum) - 1) * 7)
    
    // Calculate end date (6 days after start date)
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekStartDate.getDate() + 6)
    
    // Format dates
    return {
      start: formatDate(weekStartDate),
      end: formatDate(weekEndDate)
    }
  }
  
  // Format date as MMM DD (e.g., Mar 16)
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">{projectData.program.title}</h2>
      
      <div className="space-y-4">
        {workoutData.map((week, index) => {
          const dateRange = getWeekDateRange(week.week)
          
          return (
            <Link 
              key={index} 
              to={`/week/${week.week}`}
              className="block workout-card"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Week {week.week}</h3>
                  <p className="text-gray-400">{week.goal}</p>
                  <p className="text-sm text-gray-500 mt-1">{dateRange.start} - {dateRange.end}</p>
                </div>
                <span className="text-2xl">→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
