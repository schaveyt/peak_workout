import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import workoutData from '../data/workout.json'
import projectData from '../data/project.json'

export default function WeekView() {
  const { weekNum } = useParams()
  const week = workoutData.find(w => w.week === weekNum)
  
  if (!week) {
    return <div>Week not found</div>
  }
  
  const days = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
    { key: 'sun', label: 'Sunday' }
  ]
  
  // Calculate the date for each day of the week
  const getDayDate = (dayIndex) => {
    const startDate = new Date(projectData.program.startDate)
    const weekStartDate = new Date(startDate)
    
    // Add (weekNum - 1) weeks to the start date
    weekStartDate.setDate(startDate.getDate() + (parseInt(weekNum) - 1) * 7)
    
    // Add day offset
    const dayDate = new Date(weekStartDate)
    dayDate.setDate(weekStartDate.getDate() + dayIndex)
    
    // Format date
    const options = { month: 'short', day: 'numeric' }
    return dayDate.toLocaleDateString('en-US', options)
  }
  
  // Get week date range
  const getWeekDateRange = () => {
    const startDate = getDayDate(0) // Monday
    const endDate = getDayDate(6)   // Sunday
    return `${startDate} - ${endDate}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-2">Week {weekNum}</h2>
      <p className="text-gray-400 mb-1">{week.goal}</p>
      <p className="text-sm text-gray-500 mb-6">{getWeekDateRange()}</p>

      <div className="space-y-4">
        {days.map((day, index) => (
          <Link
            key={day.key}
            to={`/week/${weekNum}/day/${index + 1}`}
            className="block workout-card"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{day.label} <span className="font-normal text-sm text-gray-500">({getDayDate(index)})</span></h3>
                <p className="text-gray-400">{week[day.key]}</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
