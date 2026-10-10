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
1. Create a new Google Sheet.
2. Go to **Extensions > Apps Script**.
3. In `Code.gs`, select all existing code and replace it with the single complete script from [`apps-script/Code.gs`](./apps-script/Code.gs). Do not paste the new script after the old one; the project should contain only one `doGet` and one `doPost`.
4. Deploy as web app:
   - Click **Deploy > New deployment** and choose **Web app**.
   - Set **Execute as** to **Me**.
   - Set **Who has access** to **Anyone**.
   - Click **Deploy** and authorize the script to access the sheet.
5. Copy the web app URL ending in `/exec`.
6. Create a `.env.local` file in the project root (you can copy `.env.example`) and set `VITE_GOOGLE_APPS_SCRIPT_URL` to the deployment URL.
7. Restart the Vite development server after changing `.env.local`. For a production deployment, set the same environment variable in the hosting provider and rebuild.

When updating an already deployed script, use **Deploy > Manage deployments > Edit**, select **New version**, and deploy. Then open the `/exec` URL in a browser; it should report that the service is running and name the connected sheet.

The script responds to GET requests with a service status and the connected sheet name. It adds a labeled header row when the active sheet is empty and appends each submission with its timestamp, student details, and scores. The frontend uses a cross-origin `no-cors` request because Apps Script does not provide a browser-readable CORS response. As a result, the app can report that the request was sent but cannot confirm whether Apps Script stored it; check the sheet after submitting. Apps Script errors are available in its **Executions** page.

### Development
```bash
# Start development server
npm run dev
```

### Building for Production
```bash
# Create production build
npm run build
