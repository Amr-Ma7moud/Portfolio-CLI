# Firebase Setup Guide

This guide explains how to set up Firebase for your portfolio's data management system.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "amr-portfolio")
4. Disable Google Analytics (optional, not needed)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Add your admin user:
   - Click "Add user"
   - Enter your email and a strong password
   - Save this password securely!

## Step 3: Create Realtime Database

1. Go to **Build > Realtime Database**
2. Click "Create Database"
3. Choose a location (closest to your users)
4. Start in **locked mode** (we'll add rules next)

## Step 4: Set Security Rules

In the Realtime Database, go to the **Rules** tab and paste:

```json
{
  "rules": {
    "portfolio": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

This allows:
- ✅ Anyone can read portfolio data
- ✅ Only authenticated users can write

## Step 5: Get Your Config

1. Go to **Project Settings** (gear icon)
2. Under "Your apps", click the web icon `</>`
3. Register app (name doesn't matter)
4. Copy the `firebaseConfig` object

## Step 6: Add Environment Variables

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 7: Initialize Data

After setup, run these commands in your terminal:

```bash
# Login with your Firebase admin credentials
sudo login

# Initialize the database with default data
sudo init
```

## Troubleshooting

### "Permission denied" errors
- Check that you're logged in (`sudo status`)
- Verify your Firebase rules allow authenticated writes

### Data not updating
- Check browser console for errors
- Verify your Firebase config is correct
- Ensure Realtime Database is created (not Firestore)

### Can't login
- Verify email/password in Firebase Authentication
- Check that Email/Password provider is enabled

## File Structure

```
src/
├── lib/
│   └── firebase.ts       # Firebase config & helpers
├── context/
│   └── SudoContext.tsx   # Auth state management
├── hooks/
│   └── usePortfolioData.ts  # Data fetching hook
├── data/
│   └── defaults.ts       # Fallback data
└── types/
    └── portfolio.ts      # TypeScript interfaces
```
