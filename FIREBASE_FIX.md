# 🔥 Firebase Setup Troubleshooting

## ❌ **Current Issue**: API Key Not Valid

The error `auth/api-key-not-valid` means Firebase Authentication isn't properly configured.

## ✅ **Step-by-Step Fix**

### **1. Go to Firebase Console**
- Open [Firebase Console](https://console.firebase.google.com/)
- Select your project: **ctf-s-d99e5**

### **2. Enable Authentication**
- Click **"Authentication"** in the left sidebar
- Click **"Get Started"** if you haven't enabled it yet
- Go to **"Sign-in method"** tab
- Click **"Email/Password"**
- **Enable** the first option (Email/Password)
- Click **"Save"**

### **3. Create Firestore Database**
- Click **"Firestore Database"** in the left sidebar
- Click **"Create database"**
- Choose **"Start in test mode"** (for now)
- Select a location (choose closest to you)
- Click **"Done"**

### **4. Set Security Rules**
In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /challenges/{challengeId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /userScores/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **5. Restart Development Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🧪 **Test the Setup**

1. **Open** [http://localhost:3000](http://localhost:3000)
2. **Click "Register"**
3. **Create an account** with any email/password
4. **Should work now!**

## 🔍 **If Still Not Working**

The API key might be incorrect. To get the correct one:

1. **Firebase Console** → **Project Settings** (gear icon)
2. **General** tab → **Your apps** section
3. **Web app** → **Config** 
4. **Copy the config** and update `.env.local`

## 🎯 **Quick Test**

Try registering with:
- **Email**: `test@example.com`
- **Password**: `password123`

If this works, your Firebase is properly configured!

---

**The issue is almost certainly that Authentication isn't enabled in Firebase Console yet. Enable it and you'll be good to go!** 🚀
