'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [flags, setFlags] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<{ [key: string]: string }>({});
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const res = await fetch('/api/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    };

    fetchChallenges();
  }, []);

  const handleFlagSubmit = async (challengeId: string) => {
    const flag = flags[challengeId];
    if (!flag) {
      setSubmissionStatus({ ...submissionStatus, [challengeId]: 'Please enter a flag' });
      return;
    }

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challengeId, flag }),
    });

    if (res.ok) {
      setSubmissionStatus({ ...submissionStatus, [challengeId]: '🎉 Correct! Well done!' });
      setSolvedChallenges([...solvedChallenges, challengeId]);
      setFlags({ ...flags, [challengeId]: '' });
    } else {
      setSubmissionStatus({ ...submissionStatus, [challengeId]: '❌ Incorrect flag. Try again!' });
    }
  };

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient neon-text">CTF Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-300">Welcome, <span className="text-purple-400 font-semibold">{session.user?.name}</span></span>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/leaderboard" className="px-4 py-2 bg-gradient-secondary text-white rounded-lg hover:opacity-90 transition-opacity">
                    Leaderboard
                  </Link>
                  <button
                    onClick={() => router.push('/api/auth/signout')}
                    className="px-4 py-2 glass text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 glass text-white rounded-lg hover:bg-white/10 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-gradient">Capture The Flag</span>
          </h2>
          <p className="text-xl text-gray-400">Test your skills, solve challenges, and climb the leaderboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-xl p-6 border-gradient card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Challenges</p>
                <p className="text-3xl font-bold text-gradient">{challenges.length}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
          <div className="glass rounded-xl p-6 border-gradient card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Solved by You</p>
                <p className="text-3xl font-bold text-gradient">{solvedChallenges.length}</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>
          <div className="glass rounded-xl p-6 border-gradient card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Your Progress</p>
                <p className="text-3xl font-bold text-gradient">
                  {challenges.length > 0 ? Math.round((solvedChallenges.length / challenges.length) * 100) : 0}%
                </p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Challenges Section */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-6 text-gradient">Active Challenges</h3>
          {!session ? (
            <div className="glass rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <p className="text-xl text-gray-300 mb-4">Please login to view and solve challenges</p>
              <Link href="/login" className="inline-block px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                Login Now
              </Link>
            </div>
          ) : challenges.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-300">No challenges available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => {
                const isSolved = solvedChallenges.includes(challenge.id);
                return (
                  <div
                    key={challenge.id}
                    className={`glass rounded-xl p-6 border-gradient card-hover ${
                      isSolved ? 'border-green-500/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          {challenge.title}
                          {isSolved && <span className="text-green-400">✓ Solved</span>}
                        </h4>
                        <p className="text-gray-400 mb-4">{challenge.description}</p>
                      </div>
                      <div className="ml-4">
                        <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                          {challenge.points} pts
                        </div>
                      </div>
                    </div>
                    
                    {!isSolved && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter flag (e.g., CTF{...})"
                            value={flags[challenge.id] || ''}
                            onChange={(e) => setFlags({ ...flags, [challenge.id]: e.target.value })}
                            className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleFlagSubmit(challenge.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleFlagSubmit(challenge.id)}
                            className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                          >
                            Submit
                          </button>
                        </div>
                        {submissionStatus[challenge.id] && (
                          <p className={`text-sm ${
                            submissionStatus[challenge.id].includes('Correct') 
                              ? 'text-green-400' 
                              : submissionStatus[challenge.id].includes('Incorrect')
                              ? 'text-red-400'
                              : 'text-yellow-400'
                          }`}>
                            {submissionStatus[challenge.id]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
