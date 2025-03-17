import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllProgress, getExerciseHistory } from '../data/userProgress'
import exercisesData from '../data/exercises.json'

export default function ExerciseHistory() {
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Get all unique exercises that have been logged
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true)
      const allProgress = await getAllProgress()
      
      // Extract all unique exercises from progress data
      const uniqueExercises = new Set()
      
      Object.values(allProgress).forEach(day => {
        if (day.exercises && day.exercises.length > 0) {
          day.exercises.forEach(exercise => {
            if (exercise.name) {
              uniqueExercises.add(exercise.name)
            }
          })
        }
      })
      
      // Convert to array and sort alphabetically
      const exerciseList = Array.from(uniqueExercises).sort()
      setExercises(exerciseList)
      setIsLoading(false)
    }
    
    loadExercises()
  }, [])

  // Load history for selected exercise
  useEffect(() => {
    const loadHistory = async () => {
      if (selectedExercise) {
        setIsLoading(true)
        const exerciseHistory = await getExerciseHistory(selectedExercise)
        setHistory(exerciseHistory)
        setIsLoading(false)
      }
    }
    
    loadHistory()
  }, [selectedExercise])

  // Filter exercises based on search term
  const filteredExercises = exercises.filter(exercise => 
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date from week/day to readable format
  const formatDate = (week, day) => {
    const weekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return `Week ${week}, ${weekNames[day-1]}`
  }

  // Get exercise category and description if available
  const getExerciseDetails = (name) => {
    for (const category of exercisesData.categories) {
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          const exercise = subcategory.exercises.find(e => e.name === name)
          if (exercise) {
            return {
              category: category.name,
              subcategory: subcategory.name,
              description: exercise.description
            }
          }
        }
      }
      
      if (category.exercises) {
        const exercise = category.exercises.find(e => e.name === name)
        if (exercise) {
          return {
            category: category.name,
            description: exercise.description
          }
        }
      }
    }
    
    return { category: 'Custom Exercise' }
  }

  if (isLoading && exercises.length === 0) {
    return <div className="text-center py-8">Loading exercises...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Program
        </Link>
        <h1 className="text-2xl font-bold mb-4">Exercise History</h1>
      </div>

      {exercises.length === 0 ? (
        <div className="workout-card text-center py-8">
          <p>No exercise data recorded yet. Start tracking your workouts to see history.</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Go to Workout Program
          </Link>
        </div>
      ) : (
        <>
          <div className="workout-card">
            <div className="mb-4">
              <label htmlFor="search" className="block text-sm text-gray-400 mb-1">Search Exercises</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Search by exercise name..."
              />
            </div>

            <h2 className="text-lg font-semibold mb-3">Your Exercises</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredExercises.map((exercise, index) => {
                const details = getExerciseDetails(exercise)
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedExercise(exercise)}
                    className={`text-left p-3 rounded-lg border ${
                      selectedExercise === exercise 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <h3 className="font-medium">{exercise}</h3>
                    <p className="text-sm text-gray-400">{details.category}</p>
                    {details.subcategory && (
                      <p className="text-xs text-gray-500">{details.subcategory}</p>
                    )}
                  </button>
                )
              })}
            </div>

            {filteredExercises.length === 0 && (
              <p className="text-center text-gray-400 my-4">No exercises match your search.</p>
            )}
          </div>

          {selectedExercise && (
            <div className="workout-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedExercise} History</h2>
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Close
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-4">Loading history...</div>
              ) : history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-3">Date</th>
                        <th className="text-left py-2 px-3">Weight</th>
                        <th className="text-left py-2 px-3">Reps</th>
                        <th className="text-left py-2 px-3">Sets</th>
                        <th className="text-left py-2 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((entry, index) => (
                        <tr 
                          key={index} 
                          className={index % 2 === 0 ? 'bg-gray-800/30' : ''}
                        >
                          <td className="py-2 px-3">{formatDate(entry.week, entry.day)}</td>
                          <td className="py-2 px-3">{entry.weight || '-'}</td>
                          <td className="py-2 px-3">{entry.reps || '-'}</td>
                          <td className="py-2 px-3">{entry.sets || '-'}</td>
                          <td className="py-2 px-3">
                            <Link 
                              to={`/week/${entry.week}/day/${entry.day}`}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              View Workout
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-4">
                  No history found for this exercise.
                </p>
              )}

              {history.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Progress Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Max Weight</p>
                      <p className="text-xl font-bold">
                        {Math.max(...history.map(h => parseFloat(h.weight) || 0))} lbs
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Max Reps</p>
                      <p className="text-xl font-bold">
                        {Math.max(...history.map(h => parseFloat(h.reps) || 0))}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Workouts</p>
                      <p className="text-xl font-bold">{history.length}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
