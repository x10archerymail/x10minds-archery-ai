# 🔐 Security Configuration Guide

## Environment Variables Setup

This project uses environment variables to securely store API keys and sensitive configuration. **NEVER commit the `.env` file to version control.**

### Setup Instructions

1. **Copy the template file:**

   ```bash
   cp .env.example .env
   ```

2. **Fill in your API keys** in the `.env` file with your actual credentials.

3. **Verify `.gitignore`** includes `.env` to prevent accidental commits:
   ```
   .env
   .env.local
   .env.*.local
   ```

### Required Environment Variables

#### Google Gemini API

- `VITE_GEMINI_API_KEY` - Main AI service for chat, analysis, and exercises

#### OpenAI API (Optional)

- `VITE_OPENAI_API_KEY` - Alternative AI service

#### Firebase - Main App

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

#### Firebase - Shop (Optional)

- `VITE_FIREBASE_SHOP_API_KEY`
- `VITE_FIREBASE_SHOP_AUTH_DOMAIN`
- `VITE_FIREBASE_SHOP_PROJECT_ID`
- `VITE_FIREBASE_SHOP_STORAGE_BUCKET`
- `VITE_FIREBASE_SHOP_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_SHOP_APP_ID`
- `VITE_FIREBASE_SHOP_MEASUREMENT_ID`

## Security Best Practices

### ✅ DO:

- Keep `.env` file in `.gitignore`
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use different keys for development and production
- Review commits before pushing to ensure no keys are exposed

### ❌ DON'T:

- Commit `.env` files to version control
- Share API keys in chat, email, or documentation
- Hardcode API keys in source code
- Use production keys in development

## Checking for Exposed Secrets

Before committing, verify no secrets are exposed:

```bash
# Check if .env is ignored
git check-ignore .env

# Search for potential API keys in staged files
git diff --cached | grep -i "api"
```

## Emergency: Key Exposure

If you accidentally commit API keys:

1. **Immediately revoke/regenerate** the exposed keys in their respective consoles
2. **Remove from git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (⚠️ coordinate with team):
   ```bash
   git push origin --force --all
   ```
4. **Update** `.env` with new keys

## Development Server

The dev server automatically loads `.env` variables. Restart the server after changing `.env`:

```bash
npm run dev
```

---

**Remember:** Security is everyone's responsibility. When in doubt, ask before committing!
