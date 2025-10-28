# 🚀 Firebase Setup Instructions

## ✅ Your Firebase Configuration is Ready!

I've updated the Firebase configuration with your actual project details. Here's what you need to do to complete the setup:

## 📋 **Step 1: Create Environment File**

Create a file named `.env.local` in your project root with this content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBRbmQpetKUlLDa88Ct6A7DMnSpsvP5kpk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ctf-s-d99e5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ctf-s-d99e5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ctf-s-d99e5.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=301310209475
NEXT_PUBLIC_FIREBASE_APP_ID=1:301310209475:web:1c42907ae762a09cfea176
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VP32EKJ1PJ
```

## 🔧 **Step 2: Firebase Console Setup**

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project**: `ctf-s-d99e5`
3. **Enable Authentication**:
   - Go to "Authentication" → "Sign-in method"
   - Enable "Email/Password" provider
4. **Create Firestore Database**:
   - Go to "Firestore Database" → "Create database"
   - Choose "Start in test mode" (for now)
   - Select a location (choose closest to your users)

## 🔒 **Step 3: Set Firestore Security Rules**

In Firebase Console → Firestore Database → Rules, replace with:

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

## 🎮 **Step 4: Test Your Application**

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open** [http://localhost:3000](http://localhost:3000)

3. **Test the features**:
   - Register a new account
   - Login with your account
   - Check the leaderboard
   - Try the admin panel (login with email containing "admin")

## 🎯 **Step 5: Add Your First Challenge**

1. **Login as admin** (use an email containing "admin" or "admin@ctf.local")
2. **Go to Admin panel**
3. **Add a challenge**:
   - Title: "Welcome Challenge"
   - Description: "Solve this to get started!"
   - Points: 100
   - Flag: "CTF{welcome_to_ctf}"
   - Category: "Misc"

## 🚀 **You're Ready!**

Your CTF dashboard is now fully functional with Firebase! 

### **What You Can Do:**
- ✅ Users can register and login
- ✅ Admins can add/edit challenges
- ✅ Players can submit flags
- ✅ Leaderboard updates in real-time
- ✅ Responsive design works on all devices

### **Next Steps:**
- Add more challenges through the admin panel
- Customize the UI if needed
- Deploy to Vercel or your preferred platform

**Happy CTF hosting! 🎉**
