# EcoTrack

EcoTrack is a production-oriented personal carbon footprint dashboard built with React, Vite, Tailwind CSS, Framer Motion, Flask, Firebase Authentication, Firestore, Groq, and Carbon Interface.

## Features

- Firebase Authentication with sign up, login, logout, forgot password, and persistent sessions
- Protected dashboard routes
- Daily carbon logging for travel, food, and household energy
- Carbon calculation engine with Carbon Interface API fallback coefficients
- Animated dashboard with budget gauge, summaries, charts, and recent activity
- AI-powered eco suggestions through Groq
- Badge progression and streak tracking
- Historical analytics with filters, heatmap, exportable CSV, and charts
- PDF report export with summary metrics and equivalents
- Responsive UI with dark mode, offline detection, skeletons, and toast notifications

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Chart.js
- React ChartJS 2
- React Hook Form
- Axios
- Firebase SDK
- React Icons
- date-fns

### Backend

- Flask
- Flask-CORS
- Python 3.12
- requests
- python-dotenv
- firebase-admin
- reportlab

### Data and AI

- Firebase Authentication
- Firestore
- Groq API with `llama-3.3-70b-versatile`
- Carbon Interface API

## Folder Structure

```text
frontend/
  public/
  src/
    animations/
    assets/
    components/
    context/
    hooks/
    pages/
    services/
    styles/
    test/
    utils/
backend/
  firebase/
  models/
  routes/
  services/
  utils/
tests/
```

## Installation

### 1. Frontend dependencies

```bash
cd frontend
npm install
```

### 2. Backend dependencies

```bash
cd backend
python -m pip install -r requirements.txt
```

## Environment Variables

Copy `.env.example` to `.env` and fill the values.

### Frontend

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_API_BASE_URL`

### Backend

- `SECRET_KEY`
- `PORT`
- `FRONTEND_ORIGIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_DATABASE_URL`
- `CARBON_INTERFACE_API_KEY`
- `CARBON_INTERFACE_BASE_URL`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `RATE_LIMIT_PER_MINUTE`
- `DEV_ALLOW_ANONYMOUS`

## Firebase Setup

1. Create a Firebase project.
2. Enable Firebase Authentication with email/password.
3. Create a Firestore database.
4. Add a web app and copy the frontend Firebase config.
5. Create a service account for the backend and map the values into the backend environment variables.
6. Configure Firestore security rules for authenticated users only.

Example rule starting point:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Groq Setup

1. Create a Groq API key.
2. Set `GROQ_API_KEY` in the backend environment.
3. The backend uses `llama-3.3-70b-versatile` by default.
4. Suggestions automatically fall back to local deterministic tips if the API is unavailable.

## Carbon Interface Setup

1. Create a Carbon Interface API key.
2. Set `CARBON_INTERFACE_API_KEY` in the backend environment.
3. The backend uses Carbon Interface for supported travel and energy calculations when available.
4. The local coefficient engine is used as a fallback for reliability and for unsupported categories such as food.

## Running Locally

### Backend

```bash
cd backend
python app.py
```

The API runs on `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm run dev
```

The client runs on `http://localhost:5173` by default.

## API Endpoints

- `POST /api/log`
- `GET /api/history`
- `GET /api/dashboard`
- `POST /api/suggestions`
- `GET /api/badges`
- `POST /api/report`
- `GET /api/profile`
- `PUT /api/profile`

## Testing

### Backend tests

```bash
python -m pytest
```

### Frontend tests

```bash
cd frontend
npm test
```

## Deployment

- Deploy the Flask backend behind a production WSGI server such as Gunicorn or Waitress.
- Build the frontend with `npm run build` and serve the static output through a CDN or static host.
- Store all secrets in your deployment platform’s secret manager.
- Make sure Firebase Auth, Firestore, Groq, and Carbon Interface credentials are injected at runtime.

## Future Enhancements

- User-specific badge definitions stored in Firestore
- Multi-device sync for offline logs
- More granular carbon factors by country and region
- Custom emission goals per category
- Scheduled report generation and email delivery
- Push notifications for streak reminders

## Notes

The backend includes a development fallback that allows anonymous access when `DEV_ALLOW_ANONYMOUS=1`. Disable that in production.
