# React + Vite
# Student Score Entry Application

## Overview
This application allows teachers to enter and submit student scores for various subjects. It integrates with Google Sheets for data storage.

## Features
- Student details entry (Full Name, Admission Number)
- Support for multiple subjects:
  - English
  - Mathematics
  - Geography
  - Biology
  - Civic Education
  - Chemistry
  - Arabic
  - Hausa
  - Home Economics
  - Elementary Science
- CA and Exam score entry for each subject
- Form validation
- Real-time error feedback
- Google Sheets integration

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google account

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd student-score-entry

# Install dependencies
npm install
```

### Google Apps Script Setup
1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Copy and paste the provided Apps Script code
4. Deploy as web app:
   - Click "Deploy" > "New deployment"
   - Choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
5. Copy the deployment URL
6. Update the URL in App.jsx

### Development
```bash
# Start development server
npm run dev
```

### Building for Production
```bash
# Create production build
npm run build




