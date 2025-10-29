'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [flag, setFlag] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Admin check - fetches admin emails from environment variable
  // NEXT_PUBLIC_ADMIN_EMAILS should be a comma-separated list of emails
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['admin@ctf.local'];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!db) {
      setMessage('Database not available');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'challenges'), {
        title,
        description,
        points: parseInt(points),
        flag,
        category,
        createdAt: new Date()
      });
      
      setMessage('Challenge created successfully!');
      setTitle('');
      setDescription('');
      setPoints('');
      setFlag('');
      setCategory('');
    } catch (err) {
      setMessage('Failed to create challenge');
      console.error('Error creating challenge:', err);
    } finally {
      setLoading(false);
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

        <div className="mt-8 text-center">
          <Link href="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}