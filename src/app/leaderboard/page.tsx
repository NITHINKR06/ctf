'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface UserScore {
  userId: string;
  userName: string;
  totalScore: number;
  solvedChallenges: string[];
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!db) return;
      
      try {
        const userScoresRef = collection(db, 'userScores');
        const q = query(userScoresRef, orderBy('totalScore', 'desc'));
        const snapshot = await getDocs(q);
        const scores = snapshot.docs
          .map(doc => doc.data() as UserScore)
          .filter(player => player.totalScore > 0); // Only show users with score > 0
        setLeaderboard(scores);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user.displayName || user.email}
                  </span>
                  <Link href="/" className="btn btn-outline btn-sm">
                    Home
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-outline btn-sm">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you rank against other CTF players
          </p>
        </div>

        <div className="card p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">No Scores Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to solve a challenge and appear on the leaderboard!
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Note: Only players with scores greater than 0 will be shown.
              </p>
              <Link href="/" className="btn btn-primary">
                Start Playing
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((player, index) => {
                const isCurrentUser = user && player.userId === user.uid;
                return (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isCurrentUser 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : index === 1 
                          ? 'bg-gray-100 text-gray-800'
                          : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {player.userName}
                          {isCurrentUser && ' (You)'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {player.solvedChallenges.length} challenges solved
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {player.totalScore}
                      </div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="btn btn-outline">
            Back to Challenges
          </Link>
        </div>
      </main>
    </div>
  );
}