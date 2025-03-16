import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import workoutData from '../data/workout.json'
import exercisesData from '../data/exercises.json'
import projectData from '../data/project.json'

export default function DayView() {
  const { weekNum, dayNum } = useParams()
  const [exerciseDetails, setExerciseDetails] = useState(null)
  
  const week = workoutData.find(w => w.week === weekNum)
  if (!week) {
    return <div>Week not found</div>
  }
  
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const dayIndex = parseInt(dayNum) - 1
  const dayKey = days[dayIndex]
  const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex]
  const workout = week[dayKey]
  
  // Calculate the actual date for this day
  const getDayDate = () => {
    const startDate = new Date(projectData.program.startDate)
    const weekStartDate = new Date(startDate)
    
    // Add (weekNum - 1) weeks to the start date
    weekStartDate.setDate(startDate.getDate() + (parseInt(weekNum) - 1) * 7)
    
    // Add day offset
    const dayDate = new Date(weekStartDate)
    dayDate.setDate(weekStartDate.getDate() + dayIndex)
    
    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return dayDate.toLocaleDateString('en-US', options)
  }
  
  // Function to find exercise details
  const findExerciseDetails = (name) => {
    for (const category of exercisesData.categories) {
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          const exercise = subcategory.exercises.find(e => 
            workout.toLowerCase().includes(e.name.toLowerCase())
          )
          if (exercise) return exercise
        }
      }
      
      if (category.exercises) {
        const exercise = category.exercises.find(e => 
          workout.toLowerCase().includes(e.name.toLowerCase())
        )
        if (exercise) return exercise
      }
    }
    return null
  }
  
  useEffect(() => {
    const details = findExerciseDetails(workout)
    setExerciseDetails(details)
  }, [workout])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <Link to={`/week/${weekNum}`} className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Week {weekNum}
        </Link>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold">{dayName}</h2>
        <p className="text-gray-400">Week {weekNum} - {week.goal}</p>
        <p className="text-sm text-gray-500">{getDayDate()}</p>
      </div>
      
      <div className="workout-card">
        <h3 className="text-xl font-bold mb-2">{workout}</h3>
        
        {exerciseDetails ? (
          <div className="mt-4 space-y-2">
            <p>{exerciseDetails.description}</p>
            {exerciseDetails.substitution && (
              <p className="text-gray-400">
                <strong>Substitution:</strong> {exerciseDetails.substitution}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-400 mt-2">
            This is a {workout.toLowerCase().includes('rest') ? 'rest' : 'workout'} day. 
            {!workout.toLowerCase().includes('rest') && ' Check the exercise glossary for more details.'}
          </p>
        )}
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Training Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-300">
          {exercisesData.notes.map((note, index) => (
            <li key={index}>
              <strong>{note.title}:</strong> {note.content}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
