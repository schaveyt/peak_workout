import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import workoutData from '../data/workout.json'
import exercisesData from '../data/exercises.json'
import projectData from '../data/project.json'
import { getDayProgress, saveDayProgress } from '../data/userProgress'

export default function DayView() {
  const { weekNum, dayNum } = useParams()
  const [exerciseDetails, setExerciseDetails] = useState([])
  const [progress, setProgress] = useState({ completed: false, exercises: [], notes: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [availableExercises, setAvailableExercises] = useState([])
  const [exerciseEntries, setExerciseEntries] = useState([
    { id: 1, name: '', weight: '', reps: '', sets: '' }
  ])
  
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
  
  // Parse workout title to extract potential exercises
  const parseWorkoutTitle = (title) => {
    // Common separators in workout titles
    const separators = [',', '/', '&', 'and', '+', ' + ', ' & ', ' and ']
    let parts = [title]
    
    // Try to split by each separator
    for (const separator of separators) {
      if (title.toLowerCase().includes(separator)) {
        parts = title.split(new RegExp(separator, 'i')).map(part => part.trim())
        break
      }
    }
    
    // Special case for parentheses format like "GVT Upper (Bench, Rows)"
    if (title.includes('(') && title.includes(')')) {
      const mainPart = title.split('(')[0].trim()
      const inParentheses = title.match(/\((.*?)\)/)[1]
      
      // Check if there are multiple exercises in parentheses
      if (separators.some(sep => inParentheses.includes(sep))) {
        // Split the parentheses content by separators
        for (const separator of separators) {
          if (inParentheses.includes(separator)) {
            const subParts = inParentheses.split(new RegExp(separator, 'i')).map(part => part.trim())
            parts = [mainPart, ...subParts]
            break
          }
        }
      } else {
        parts = [mainPart, inParentheses]
      }
    }
    
    return parts
  }
  
  // Function to find exercise details
  const findExerciseDetails = (name) => {
    for (const category of exercisesData.categories) {
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          const exercise = subcategory.exercises.find(e => 
            name.toLowerCase().includes(e.name.toLowerCase())
          )
          if (exercise) return { ...exercise, category: category.name, subcategory: subcategory.name }
        }
      }
      
      if (category.exercises) {
        const exercise = category.exercises.find(e => 
          name.toLowerCase().includes(e.name.toLowerCase())
        )
        if (exercise) return { ...exercise, category: category.name }
      }
    }
    return null
  }
  
  // Function to get all available exercises from the glossary
  const getAllExercises = () => {
    const exercises = []
    
    exercisesData.categories.forEach(category => {
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          subcategory.exercises.forEach(exercise => {
            exercises.push({
              name: exercise.name,
              category: category.name,
              subcategory: subcategory.name
            })
          })
        })
      } else if (category.exercises) {
        category.exercises.forEach(exercise => {
          exercises.push({
            name: exercise.name,
            category: category.name
          })
        })
      }
    })
    
    return exercises
  }
  
  // Function to get relevant exercises for the current workout
  const getRelevantExercises = (workoutName) => {
    const allExercises = getAllExercises()
    const workoutLower = workoutName.toLowerCase()
    
    // First, try to find exercises that match keywords in the workout name
    const keywordMatches = allExercises.filter(exercise => 
      workoutLower.includes(exercise.name.toLowerCase()) ||
      exercise.category.toLowerCase().includes(workoutLower) ||
      (exercise.subcategory && exercise.subcategory.toLowerCase().includes(workoutLower))
    )
    
    // If we found matches, return those, otherwise return all exercises
    return keywordMatches.length > 0 ? keywordMatches : allExercises
  }
  
  useEffect(() => {
    // Parse workout title to identify potential multiple exercises
    const workoutParts = parseWorkoutTitle(workout)
    
    // Find details for each potential exercise
    const details = workoutParts
      .map(part => findExerciseDetails(part))
      .filter(detail => detail !== null)
    
    setExerciseDetails(details)
    
    // Get all available exercises for dropdown
    const allExercises = getAllExercises()
    setAvailableExercises(allExercises)
    
    // Load saved progress data
    const loadProgress = async () => {
      setIsLoading(true)
      const savedProgress = await getDayProgress(weekNum, dayNum)
      setProgress(savedProgress)
      setNotes(savedProgress.notes || '')
      
      if (savedProgress.exercises && savedProgress.exercises.length > 0) {
        // Create exercise entries from saved data
        const entries = savedProgress.exercises.map((exercise, index) => ({
          id: index + 1,
          name: exercise.name || '',
          weight: exercise.weight || '',
          reps: exercise.reps || '',
          sets: exercise.sets || ''
        }))
        setExerciseEntries(entries)
      } else if (details.length > 0) {
        // If no saved exercises but we have matching exercises from the workout name
        const entries = details.map((detail, index) => ({
          id: index + 1,
          name: detail.name,
          weight: '',
          reps: '',
          sets: ''
        }))
        setExerciseEntries(entries.length > 0 ? entries : [{ id: 1, name: '', weight: '', reps: '', sets: '' }])
      }
      
      setIsLoading(false)
    }
    
    loadProgress()
  }, [weekNum, dayNum, workout])
  
  const handleExerciseChange = (id, field, value) => {
    const updatedEntries = exerciseEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    )
    setExerciseEntries(updatedEntries)
  }
  
  const addExerciseEntry = () => {
    const newId = Math.max(...exerciseEntries.map(e => e.id), 0) + 1
    setExerciseEntries([...exerciseEntries, { id: newId, name: '', weight: '', reps: '', sets: '' }])
  }
  
  const removeExerciseEntry = (id) => {
    if (exerciseEntries.length > 1) {
      setExerciseEntries(exerciseEntries.filter(entry => entry.id !== id))
    }
  }
  
  const handleSaveProgress = async () => {
    // Validate that at least one exercise has a name
    const hasNamedExercise = exerciseEntries.some(entry => entry.name)
    
    if (!hasNamedExercise && !workout.toLowerCase().includes('rest')) {
      alert('Please select at least one exercise')
      return
    }
    
    // Filter out empty exercise entries
    const validExercises = exerciseEntries
      .filter(entry => entry.name)
      .map(({ id, ...rest }) => rest) // Remove the id field
    
    const updatedProgress = {
      completed: true,
      exercises: validExercises,
      notes: notes
    }
    
    await saveDayProgress(weekNum, dayNum, updatedProgress)
    setProgress(updatedProgress)
    alert('Progress saved successfully!')
  }
  
  const handleMarkIncomplete = async () => {
    const updatedProgress = {
      ...progress,
      completed: false
    }
    
    await saveDayProgress(weekNum, dayNum, updatedProgress)
    setProgress(updatedProgress)
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

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
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{dayName}</h2>
          <p className="text-gray-400">Week {weekNum} - {week.goal}</p>
          <p className="text-sm text-gray-500">{getDayDate()}</p>
        </div>
        
        <div>
          {progress.completed ? (
            <div className="flex flex-col items-end">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm mb-2">
                Completed
              </span>
              <button 
                onClick={handleMarkIncomplete}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                Mark as incomplete
              </button>
            </div>
          ) : (
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              Inomplete
            </span>
          )}
        </div>
      </div>
      
      <div className="workout-card">
        <h3 className="text-xl font-bold mb-2">{workout}</h3>
        
        {exerciseDetails.length > 0 ? (
          <div className="mt-4 space-y-4">
            {exerciseDetails.map((detail, index) => (
              <div key={index} className="border-t border-gray-700 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0">
                <h4 className="font-semibold text-lg">{detail.name}</h4>
                <p>{detail.description}</p>
                {detail.substitution && (
                  <p className="text-gray-400 mt-1">
                    <strong>Substitution:</strong> {detail.substitution}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-2">
            This is a {workout.toLowerCase().includes('rest') ? 'rest' : 'workout'} day. 
            {!workout.toLowerCase().includes('rest') && ' Check the exercise glossary for more details.'}
          </p>
        )}
      </div>
      
      {!workout.toLowerCase().includes('rest') && (
        <div className="workout-card">
          <h3 className="text-lg font-semibold mb-4">Track Your Progress</h3>
          
          <div className="space-y-6">
            {exerciseEntries.map((entry, index) => (
              <div key={entry.id} className={`p-4 rounded-lg ${index > 0 ? 'border border-gray-700 bg-gray-800/50' : ''}`}>
                {index > 0 && (
                  <div className="flex justify-between mb-3">
                    <h4 className="font-medium">Exercise {index + 1}</h4>
                    <button 
                      onClick={() => removeExerciseEntry(entry.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Exercise</label>
                    <select
                      value={entry.name}
                      onChange={(e) => handleExerciseChange(entry.id, 'name', e.target.value)}Not completedc
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    >
                      <option value="">Select an exercise</option>
                      {availableExercises.map((exercise, i) => (
                        <option key={i} value={exercise.name}>
                          {exercise.name} {exercise.subcategory ? `(${exercise.subcategory})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Weight (lbs)</label>
                      <input
                        type="text"
                        value={entry.weight}
                        onChange={(e) => handleExerciseChange(entry.id, 'weight', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="185"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Reps</label>
                      <input
                        type="text"
                        value={entry.reps}
                        onChange={(e) => handleExerciseChange(entry.id, 'reps', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Sets</label>
                      <input
                        type="text"
                        value={entry.sets}
                        onChange={(e) => handleExerciseChange(entry.id, 'sets', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={addExerciseEntry}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Exercise
            </button>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                rows="3"
                placeholder="How did you feel? Any modifications?"
              ></textarea>
            </div>
            
            <button
              onClick={handleSaveProgress}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Save Progress
            </button>
          </div>
        </div>
      )}
      
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
