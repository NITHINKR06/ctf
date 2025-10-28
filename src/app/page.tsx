'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  flag: string;
  category: string;
  createdAt: Date | string;
}

interface UserScore {
  userId: string;
  userName: string;
  totalScore: number;
  solvedChallenges: string[];
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [flags, setFlags] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<{ [key: string]: string }>({});
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!db) return;
      
      try {
        const challengesRef = collection(db, 'challenges');
        const snapshot = await getDocs(challengesRef);
        const challengesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Challenge[];
        setChallenges(challengesData);
      } catch (err) {
        console.error('Error fetching challenges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    const fetchUserScore = async () => {
      if (user && db) {
        try {
          const userScoreRef = doc(db, 'userScores', user.uid);
          const userScoreSnap = await getDoc(userScoreRef);
          
          if (userScoreSnap.exists()) {
            const scoreData = userScoreSnap.data() as UserScore;
            setUserScore(scoreData);
            setSolvedChallenges(scoreData.solvedChallenges || []);
          } else {
            // Create new user score document
            const newUserScore: UserScore = {
              userId: user.uid,
              userName: user.displayName || user.email || 'Anonymous',
              totalScore: 0,
              solvedChallenges: []
            };
            await setDoc(userScoreRef, newUserScore);
            setUserScore(newUserScore);
          }
        } catch (err) {
          console.error('Error fetching user score:', err);
        }
      }
    };

    fetchUserScore();
  }, [user]);

  const handleFlagSubmit = async (challengeId: string) => {
    if (!user || !db) return;

    const flag = flags[challengeId];
    if (!flag) {
      setSubmissionStatus({ ...submissionStatus, [challengeId]: 'Please enter a flag' });
      return;
    }

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    try {
      if (flag.trim() === challenge.flag.trim()) {
        // Correct flag
        setSubmissionStatus({ ...submissionStatus, [challengeId]: `Correct! +${challenge.points} points` });
        
        // Update user score
        const updatedSolvedChallenges = [...solvedChallenges, challengeId];
        const newTotalScore = userScore ? userScore.totalScore + challenge.points : challenge.points;
        
        const updatedUserScore: UserScore = {
          userId: user.uid,
          userName: user.displayName || user.email || 'Anonymous',
          totalScore: newTotalScore,
          solvedChallenges: updatedSolvedChallenges
        };

        const userScoreRef = doc(db, 'userScores', user.uid);
        await setDoc(userScoreRef, updatedUserScore);
        
        setUserScore(updatedUserScore);
        setSolvedChallenges(updatedSolvedChallenges);
        setFlags({ ...flags, [challengeId]: '' });
      } else {
        setSubmissionStatus({ ...submissionStatus, [challengeId]: 'Incorrect flag' });
      }
    } catch {
      setSubmissionStatus({ ...submissionStatus, [challengeId]: 'Submission failed' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

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
              <h1 className="text-2xl font-bold text-primary">CTF Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.displayName || user.email}
                  </span>
                  <Link href="/leaderboard" className="btn btn-outline btn-sm">
                    Leaderboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">Total Challenges</h3>
            <p className="text-3xl font-bold text-primary">{challenges.length}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">Solved</h3>
            <p className="text-3xl font-bold text-green-600">{solvedChallenges.length}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">Your Score</h3>
            <p className="text-3xl font-bold text-primary">{userScore?.totalScore || 0}</p>
          </div>
        </div>

        {/* Challenges */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Challenges</h2>
          
          {!user ? (
            <div className="card p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Authentication Required</h3>
              <p className="text-muted-foreground mb-6">Please login to access challenges</p>
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          ) : challenges.length === 0 ? (
            <div className="card p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">No Challenges Available</h3>
              <p className="text-muted-foreground">Check back later for new challenges</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {challenges.map((challenge) => {
                const isSolved = solvedChallenges.includes(challenge.id);
                return (
                  <div key={challenge.id} className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{challenge.title}</h3>
                          {isSolved && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              Solved
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {challenge.category}</span>
                          <span>Points: {challenge.points}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{challenge.points}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                    
                    {!isSolved && (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Enter flag..."
                            value={flags[challenge.id] || ''}
                            onChange={(e) => setFlags({ ...flags, [challenge.id]: e.target.value })}
                            className="input flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleFlagSubmit(challenge.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleFlagSubmit(challenge.id)}
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </div>
                        {submissionStatus[challenge.id] && (
                          <div className={`text-sm ${
                            submissionStatus[challenge.id].includes('Correct') 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {submissionStatus[challenge.id]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}