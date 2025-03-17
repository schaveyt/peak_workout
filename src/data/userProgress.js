import localforage from 'localforage';

// Initialize localforage
localforage.config({
  name: 'peak-workout',
  storeName: 'workout_progress'
});

// Structure of workout progress data
// {
//   "week_1_day_1": {
//     completed: true,
//     exercises: [
//       { name: "Bench Press", weight: "185", reps: 10, sets: 10 }
//     ],
//     notes: "Felt strong today"
//   }
// }

// Get all progress data
export const getAllProgress = async () => {
  try {
    return await localforage.getItem('workoutProgress') || {};
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return {};
  }
};

// Get progress for a specific day
export const getDayProgress = async (weekNum, dayNum) => {
  try {
    const allProgress = await getAllProgress();
    const key = `week_${weekNum}_day_${dayNum}`;
    return allProgress[key] || { completed: false, exercises: [], notes: '' };
  } catch (error) {
    console.error('Error fetching day progress:', error);
    return { completed: false, exercises: [], notes: '' };
  }
};

// Save progress for a specific day
export const saveDayProgress = async (weekNum, dayNum, progressData) => {
  try {
    const allProgress = await getAllProgress();
    const key = `week_${weekNum}_day_${dayNum}`;
    
    const updatedProgress = {
      ...allProgress,
      [key]: progressData
    };
    
    await localforage.setItem('workoutProgress', updatedProgress);
    return true;
  } catch (error) {
    console.error('Error saving progress data:', error);
    return false;
  }
};

// Get program completion statistics
export const getCompletionStats = async () => {
  try {
    const allProgress = await getAllProgress();
    const totalDays = 16 * 7; // 16 weeks * 7 days
    const completedDays = Object.values(allProgress).filter(day => day.completed).length;
    
    return {
      completedDays,
      totalDays,
      completionPercentage: Math.round((completedDays / totalDays) * 100)
    };
  } catch (error) {
    console.error('Error calculating completion stats:', error);
    return { completedDays: 0, totalDays: 112, completionPercentage: 0 };
  }
};

// Get exercise history (for tracking progress over time)
export const getExerciseHistory = async (exerciseName) => {
  try {
    const allProgress = await getAllProgress();
    const history = [];
    
    for (const [key, data] of Object.entries(allProgress)) {
      if (data.exercises) {
        const matchingExercise = data.exercises.find(ex => ex.name === exerciseName);
        if (matchingExercise) {
          // Parse the key to get week and day
          const [_, weekStr, __, dayStr] = key.split('_');
          
          history.push({
            week: parseInt(weekStr),
            day: parseInt(dayStr),
            weight: matchingExercise.weight,
            reps: matchingExercise.reps,
            sets: matchingExercise.sets,
            date: key // We could calculate the actual date if needed
          });
        }
      }
    }
    
    // Sort by week and day (most recent first)
    return history.sort((a, b) => {
      if (a.week !== b.week) return b.week - a.week;
      return b.day - a.day;
    });
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    return [];
  }
};
