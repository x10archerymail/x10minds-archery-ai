# 🔐 Security Configuration Guide

This project follows strict security protocols to protect user data and API credentials.

## 🛡️ Security Best Practices

### 1. Environment Variables

All sensitive keys (AI models, Firebase, Payments) are stored in `.env` files.

- **NEVER** commit the `.env` file to version control.
- A template file `.env.example` is provided to show required variables.

### 2. Authentication & MFA

- Users can enable Multi-Factor Authentication (MFA) via SMS in the Settings menu.
- Re-authentication is required for sensitive operations like changing security settings.

### 3. Data Privacy

- User coaching data and scores are encrypted in transit and stored securely on Firebase.
- Incognito mode in chat prevents session saving to history.
- Users can export or delete their entire account data at any time via Data Management settings.

### 4. API Security

- reCAPTCHA Enterprise is integrated to prevent bot abuse.
- Firebase App Check is enabled to ensure only authorized clients can access backend services.

## 🚀 Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/x10archerymail/x10minds-archery-ai.git
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env` in the `frontend` directory and fill in your keys:

   ```bash
   cd frontend
   cp .env.example .env
   ```

3. **Required Variables:**
   - `VITE_GEMINI_API_KEY`: Main AI engine for coaching.
   - `VITE_FIREBASE_API_KEY`: Backend services and authentication.
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Payment integration.

## ⚖️ Reporting Vulnerabilities

If you discover a security vulnerability, please do NOT open a public issue. Instead, report it privately to:
**ai@x10minds.com**

We aim to acknowledge reports within 24 hours and provide updates throughout the resolution process.

---

_© 2026 X10Minds Intelligence. Built for elite performance._
