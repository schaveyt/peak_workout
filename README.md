# Peak Workout Tracker

This repository contains a comprehensive 4-month (16-week) workout plan with an accompanying web application for easy tracking and reference. The program balances German Volume Training (GVT), strength/hypertrophy phases, and cardio, focusing on minimizing fatigue while prioritizing fat loss and muscle retention.

## Program Structure

- **16-week schedule**: Detailed daily workouts, cardio sessions, and recovery days
- **Exercise glossary**: Definitions, substitutions, and details for all exercises
- **Program overview**: Explanation of the program's structure, goals, and key principles
- **Web application**: Mobile-optimized tracker for following the program

## Key Features

- Rotating phases: GVT, strength, hypertrophy, and deload weeks
- Monthly focus areas: Endurance, strength, density, and conditioning
- Detailed exercise substitutions for different equipment and joint safety
- Mobile-optimized web interface for gym use
- Dark mode design for better visibility in various lighting conditions

## Files Included

- `workout.csv`: Structured 16-week workout schedule
- `exercises.md`: Exercise glossary with detailed descriptions and substitutions
- `workout-overview.md`: Program overview and key principles
- Web application source code for the workout tracker

## How to Use

1. Review the `workout-overview.md` file to understand the program's structure and goals
2. Use the web application to follow your workouts on a day-to-day basis
3. Refer to the exercise glossary for detailed instructions and substitutions

## Deployment to Cloudflare Pages

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Deployment Steps via Cloudflare Dashboard

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Deploy via Cloudflare Dashboard**:
   - Go to the [Cloudflare Pages dashboard](https://dash.cloudflare.com/?to=/:account/pages)
   - Click "Create a project"
   - Connect your GitHub repository or upload your build files directly
   - Configure build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Node.js version: 16 (or later)
   - Click "Save and Deploy"

3. **Custom Domain Setup** (optional):
   - In your project dashboard, navigate to "Custom domains"
   - Click "Set up a custom domain"
   - Follow the instructions to add and verify your domain

## Web Application Features

- Mobile-optimized interface designed for gym use
- Dark mode for better visibility in various lighting conditions
- Week and day navigation to easily find your current workout
- Detailed exercise instructions and substitutions
- Progress tracking based on your program start date

## Notes

- Adjust exercises based on available equipment and individual needs
- Track progress weekly and adjust as needed
- Maintain proper nutrition and supplement regimen for optimal results
