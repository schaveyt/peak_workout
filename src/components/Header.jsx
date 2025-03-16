import React from 'react'
import { Link } from 'react-router-dom'
import projectData from '../data/project.json'

export default function Header() {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-2xl">
        <Link to="/" className="text-xl font-bold text-white">
          Peak Workout Tracker
        </Link>
        <div className="text-sm text-gray-400">
          <div>{projectData.user.name}'s Program</div>
        </div>
      </div>
    </header>
  )
}
