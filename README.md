# CTF Dashboard - Simple Firebase Version

A simple Capture The Flag (CTF) platform built with Next.js and Firebase. This version removes complex backend code and uses Firebase for data storage and authentication.

## Features

- 🔐 **Simple Authentication** - Firebase Auth for user management
- 🏆 **Challenge Management** - Add/edit/delete challenges via admin panel
- 🎯 **Flag Submission** - Submit flags and track solved challenges
- 📊 **Real-time Leaderboard** - Live scoring and rankings
- 🎨 **Terminal UI** - Cyberpunk-themed interface
- 📱 **Responsive Design** - Works on all devices

## Quick Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy the environment variables from `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

3. Update `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

Set up your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Challenges are readable by everyone
    match /challenges/{challengeId} {
      allow read: if true;
      allow write: if false; // Only admins can write via admin panel
    }
    
    // User scores are readable by everyone, writable by authenticated users
    match /userScores/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Players

1. **Register** - Create an account with email/password
2. **Login** - Access the platform
3. **Solve Challenges** - View challenges and submit flags
4. **Track Progress** - See your score and solved challenges
5. **Compete** - Check the leaderboard

### For Admins

1. **Admin Access** - Login with an admin email (contains "admin" or is "admin@ctf.local")
2. **Add Challenges** - Use the admin panel to create new challenges
3. **Manage Content** - Edit or delete existing challenges
4. **Monitor Activity** - View the leaderboard and user activity

## Database Structure

### Collections

#### `challenges`
```javascript
{
  title: string,
  description: string,
  points: number,
  flag: string,
  category: string,
  createdAt: timestamp
}
```

#### `userScores`
```javascript
{
  userId: string,
  userName: string,
  totalScore: number,
  solvedChallenges: string[]
}
```

## Admin Panel

The admin panel allows you to:
- Add new challenges with custom flags
- Set point values and categories
- Delete challenges
- View all challenges in one place

**Admin Access**: Users with emails containing "admin" or "admin@ctf.local" get admin access.

## Customization

### Adding New Challenge Categories

Edit the admin panel form in `src/app/admin/page.tsx`:

```javascript
<option value="YourCategory">Your Category</option>
```

### Styling

The app uses Tailwind CSS with custom terminal-themed classes. Main styles are in `src/app/globals.css`.

### Firebase Rules

For production, consider more restrictive Firestore rules and implement proper admin role management.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js.

## Troubleshooting

### Common Issues

1. **Firebase not connecting** - Check your environment variables
2. **Authentication not working** - Ensure Firebase Auth is enabled
3. **Challenges not loading** - Check Firestore rules and database setup
4. **Admin panel not accessible** - Verify admin email configuration

### Getting Help

- Check Firebase Console for errors
- Verify Firestore security rules
- Ensure all environment variables are set correctly

## License

MIT License - feel free to use this for your CTF events!

---

**Happy Hacking! 🚀**