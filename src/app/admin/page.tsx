'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { getDocs } from "firebase/firestore";


export default function AdminPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [flag, setFlag] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [digestLoading, setDigestLoading] = useState(false);

  // Admin check - fetches admin emails from environment variable
  // NEXT_PUBLIC_ADMIN_EMAILS should be a comma-separated list of emails
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['admin@ctf.local'];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  const handleMigrateUsers = async () => {
    const migrationSecret = prompt('Enter migration secret token:');
    if (!migrationSecret) return;

    setMigrationLoading(true);
    try {
      const response = await fetch("/api/migrate-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${migrationSecret}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✓ Migration successful!\nMigrated: ${data.stats.migrated}, Skipped: ${data.stats.skipped}, Failed: ${data.stats.failed}`);
      } else {
        setMessage(`✗ Migration failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setMessage('✗ Migration error: ' + (err instanceof Error ? err.message : String(err)));
      console.error(err);
    } finally {
      setMigrationLoading(false);
    }
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) {
      alert('Please enter an email address');
      return;
    }

    setTestLoading(true);
    try {
      // First, count how many users would be notified
      const usersSnap = await getDocs(collection(db, "users"));
      const usersCount = usersSnap.size;
      
      const userScoresSnap = await getDocs(collection(db, "userScores"));
      const scoresCount = userScoresSnap.size;

      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          testMessage: "This is a test email to verify the email system is working."
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✓ Test email sent to ${testEmail}! Check your inbox.\n\nℹ️ Stats: ${usersCount} users in database, ${scoresCount} user scores found.`);
      } else {
        setMessage(`✗ Email test failed: ${data.details || data.error}`);
      }
    } catch (err) {
      setMessage('✗ Error testing email: ' + (err instanceof Error ? err.message : String(err)));
      console.error(err);
    } finally {
      setTestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'challenges'), {
        title,
        description,
        points: parseInt(points),
        flag,
        category,
        createdAt: new Date()
      });

      setMessage('✓ Challenge created successfully! Use the "Send Digest Email" button below to notify users.');
      setTitle('');
      setDescription('');
      setPoints('');
      setFlag('');
      setCategory('');
    } catch (err) {
      setMessage('✗ Failed to create challenge: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error creating challenge:', err);
    } finally {
      setLoading(false);
    }

  };

  const handleSendDigest = async () => {
    setDigestLoading(true);
    try {
      // Fetch challenges from last 24 hours
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const challengesRef = collection(db, 'challenges');
      const snapshot = await getDocs(challengesRef);
      
      const recentChallenges = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            category: data.category,
            points: data.points,
            createdAt: data.createdAt
          };
        })
        .filter(doc => {
          const createdAt = doc.createdAt?.toDate?.() || new Date(doc.createdAt);
          return createdAt >= oneDayAgo;
        })
        .sort((a, b) => {
          const timeA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const timeB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return (timeB as any) - (timeA as any);
        });

      if (recentChallenges.length === 0) {
        setMessage('No challenges added in the last 24 hours.');
        return;
      }

      // Fetch all user emails from users collection
      const usersSnap = await getDocs(collection(db, "users"));
      const allEmails = new Set(
        usersSnap.docs
          .map(d => d.data().email)
          .filter(Boolean)
      );

      // Also fetch from userScores collection as fallback for existing users
      const userScoresSnap = await getDocs(collection(db, "userScores"));
      for (const scoreDoc of userScoresSnap.docs) {
        const userData = scoreDoc.data();
        if (userData.userEmail && userData.userEmail.includes('@')) {
          allEmails.add(userData.userEmail);
        }
      }

      const emailList = Array.from(allEmails);
      if (emailList.length === 0) {
        setMessage('No user emails found to notify.');
        return;
      }

      // Send digest email
      const emailResponse = await fetch("/api/send-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: emailList,
          challenges: recentChallenges
        })
      });

      const emailData = await emailResponse.json();
      
      if (!emailResponse.ok) {
        console.warn('Email sending failed:', emailData.details || emailData.error);
        setMessage(`✗ Digest email failed: ${emailData.details || emailData.error}`);
      } else {
        setMessage(`✓ Digest email sent! ${recentChallenges.length} challenge(s) sent to ${emailData.sent} user(s).`);
      }
    } catch (err) {
      setMessage('✗ Error sending digest: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error sending digest:', err);
    } finally {
      setDigestLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don&apos;t have permission to access this page.</p>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                CTF Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Admin: {user?.displayName || user?.email}
              </span>
              <Link href="/" className="btn btn-outline btn-sm">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Admin Panel</h1>
          <p className="text-muted-foreground">
            Create new CTF challenges
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`px-4 py-3 rounded-md text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-100 border border-green-200 text-green-800'
                  : 'bg-destructive/10 border border-destructive/20 text-destructive'
              }`}>
                {message}
              </div>
            )}
            
            <div>
              <label htmlFor="title" className="label">
                Challenge Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input mt-1"
                placeholder="Enter challenge title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input mt-1 min-h-[100px] resize-y"
                placeholder="Enter challenge description"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="label">
                Category
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input mt-1"
              >
                <option value="">Select a category</option>
                <optgroup label="Difficulty Levels">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Medium-Hard">Medium-Hard</option>
                  <option value="Hard">Hard</option>
                </optgroup>
                <optgroup label="Challenge Types">
                  <option value="Web">Web</option>
                  <option value="Crypto">Cryptography</option>
                  <option value="Forensics">Forensics</option>
                  <option value="Reverse">Reverse Engineering</option>
                  <option value="Pwn">Binary Exploitation</option>
                  <option value="Misc">Miscellaneous</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label htmlFor="points" className="label">
                Points
              </label>
              <input
                id="points"
                type="number"
                required
                min="1"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="input mt-1"
                placeholder="Enter point value"
              />
            </div>
            
            <div>
              <label htmlFor="flag" className="label">
                Flag
              </label>
              <input
                id="flag"
                type="text"
                required
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="input mt-1"
                placeholder="Enter the flag"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? 'Creating Challenge...' : 'Create Challenge'}
            </button>
          </form>
        </div>

        {/* Send Digest Email Section */}
        <div className="card p-8 mt-8 bg-green-50 border border-green-200">
          <h2 className="text-2xl font-bold text-foreground mb-4">📧 Send Digest Email</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Send an email to all users with all challenges added in the last 24 hours.
          </p>
          <button
            onClick={handleSendDigest}
            disabled={digestLoading}
            className="btn btn-success w-full"
          >
            {digestLoading ? 'Sending...' : 'Send Digest Email'}
          </button>
        </div>

        {/* Test Email Section */}
        <div className="card p-8 mt-8 bg-blue-50 border border-blue-200">
          <h2 className="text-2xl font-bold text-foreground mb-4">🧪 Test Email System</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Quickly test if the email system is working without creating a full challenge.
          </p>
          <form onSubmit={handleTestEmail} className="space-y-4">
            <div>
              <label htmlFor="testEmail" className="label">
                Test Email Address
              </label>
              <input
                id="testEmail"
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="input mt-1"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={testLoading}
              className="btn btn-secondary w-full"
            >
              {testLoading ? 'Sending...' : 'Send Test Email'}
            </button>
          </form>
        </div>

        {/* User Migration Section */}
        <div className="card p-8 mt-8 bg-purple-50 border border-purple-200">
          <h2 className="text-2xl font-bold text-foreground mb-4">🔄 Migrate Existing Users</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Migrate existing users from userScores to the users collection. This fetches emails from Firebase Auth for each user.
          </p>
          <button
            onClick={handleMigrateUsers}
            disabled={migrationLoading}
            className="btn btn-warning w-full"
          >
            {migrationLoading ? 'Migrating...' : 'Start Migration'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );

  
}