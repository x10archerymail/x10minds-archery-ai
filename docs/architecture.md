# X10Minds Architecture

## System Overview

X10Minds is a cloud-native, AI-first application designed for real-time biomechanical feedback.

## Component Breakdown

### 1. Frontend (React/Vite)

- **State Management**: Uses React Context for user sessions, theme, and language.
- **UI Components**: Modular Lucide-indexed components with TailwindCSS styling.
- **Client-Side AI**: Direct integration with Google Gemini via `@google/genai` for low-latency feedback.

### 2. Backend (Firebase)

- **Authentication**: Firebase Auth (Email, Multi-Factor).
- **Database**: Firestore for user profiles, training history, and tournament logs.
- **Storage**: Firebase Storage for archer form photos and videos.
- **Security**: Granular Firestore rules ensuring user data privacy.

### 3. AI Layer (Gemini)

- **Vision Engine**: Analyzes uploaded images for posture detection.
- **Inference Engine**: Generates personalized training plans (SPT).
- **Coach Persona**: Sophisticated system instructions to maintain an elite coaching tone.

### 4. Integration Layer

- **Stripe**: Handles subscription tiers (Charge, Pro, Ultra).
- **i18next**: Manages global translations.

## Data Flow

1. User uploads form photo.
2. Image is sent to Gemini Vision.
3. Gemini returns biomechanical JSON.
4. UI renders overlays and scoring feedback.
5. Result is saved to Firestore history.
