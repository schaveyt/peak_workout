import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WeeksList from './components/WeeksList'
import WeekView from './components/WeekView'
import DayView from './components/DayView'
import ExerciseHistory from './components/ExerciseHistory'
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Routes>
          <Route path="/" element={<WeeksList />} />
          <Route path="/week/:weekNum" element={<WeekView />} />
          <Route path="/week/:weekNum/day/:dayNum" element={<DayView />} />
          <Route path="/history" element={<ExerciseHistory />} />
        </Routes>
      </main>
    </div>
  )
}
