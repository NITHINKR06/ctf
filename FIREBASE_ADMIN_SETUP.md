# Firebase Admin Setup Guide

## Step 1: Get Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file (keep it safe!)

## Step 2: Extract Credentials

From the downloaded JSON file, you need:

```json
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com",
  ...
}
```

## Step 3: Update `.env.local`

Add these to your `.env.local` file:

```env
# Firebase Admin SDK Configuration
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Migration Configuration (create your own secret token)
MIGRATION_SECRET=mysecrettoken123
```

**Important:**
- Make sure to include the `\n` characters as shown in the JSON
- If copy-pasting, ensure the entire private key is included
- `MIGRATION_SECRET` is a security token YOU create yourself (can be any random string like "mysecrettoken123")
- Never commit these credentials to git
- Add `.env.local` to `.gitignore` (should already be there)

## Step 4: Run Migration

1. Go to Admin Panel
2. Scroll to "🔄 Migrate Existing Users" section
3. Click "Start Migration"
4. Enter the `MIGRATION_SECRET` when prompted
5. The migration will:
   - Fetch all users from `userScores` collection
   - Look up their email from Firebase Auth
   - Save their data to the `users` collection
   - Skip users already in the `users` collection

## What the Migration Does

- ✓ Creates `users` collection if it doesn't exist
- ✓ Fetches user emails from Firebase Auth by userId
- ✓ Saves: `uid`, `email`, `displayName`, `createdAt`, `migratedAt`
- ✓ Skips users already migrated
- ✓ Reports stats: migrated, skipped, failed

## After Migration

Once migration is complete:
- All user emails will be in the `users` collection
- Email notifications will work for all users
- Future registrations are automatically saved to `users` collection
