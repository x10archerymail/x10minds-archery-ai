# 🚀 Quick Setup Guide - Archery AI X10Minds AI

## ⚠️ Important: Project Structure

This project has its main application in the **`frontend`** folder. All npm commands must be run from there!

```
x10minds-archery-ai/
├── frontend/          ← YOUR MAIN APP IS HERE!
│   ├── package.json   ← npm install runs here
│   ├── components/
│   ├── services/
│   └── ...
├── backend/
├── ai/
└── README.md
```

## 📋 Setup Steps

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the `frontend` folder:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_actual_domain
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id

# AI Configuration
VITE_GEMINI_API_KEY=your_actual_gemini_key

# Security
VITE_RECAPTCHA_SITE_KEY=your_actual_recaptcha_key
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## 🔧 Common Issues

### ❌ Error: "Cannot find package.json"

**Problem**: You're running npm commands from the root directory  
**Solution**: Run `cd frontend` first!

### ❌ Error: "Module not found"

**Problem**: Dependencies not installed  
**Solution**: Run `npm install` from the `frontend` folder

### ❌ Error: "Firebase/Gemini API errors"

**Problem**: Missing or invalid API keys in `.env`  
**Solution**: Create `.env` file with your actual API keys (see step 3)

## 📚 More Information

See the main [README.md](./README.md) for full project documentation.

---

**Remember**: Always work from the `frontend` directory! 🎯
