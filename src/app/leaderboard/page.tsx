'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  score: number;
}

const LeaderboardPage = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎯';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-amber-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-purple-600 to-indigo-600';
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
              <Link href="/" className="text-2xl font-bold text-gradient neon-text">
                CTF Platform
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="px-4 py-2 glass text-white rounded-lg hover:bg-white/10 transition-colors">
                ← Back to Challenges
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient neon-text">Leaderboard</span>
          </h1>
          <p className="text-xl text-gray-400">Top hackers of the platform</p>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-purple-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-400">Loading rankings...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-xl text-gray-300">No players yet. Be the first to solve a challenge!</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user, index) => {
                    const rank = index + 1;
                    const isCurrentUser = session?.user?.email === user.email;
                    
                    return (
                      <tr 
                        key={user.id} 
                        className={`hover:bg-white/5 transition-colors ${
                          isCurrentUser ? 'bg-purple-500/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getRankEmoji(rank)}</span>
                            <span className={`text-lg font-bold ${
                              rank <= 3 ? 'text-gradient' : 'text-gray-400'
                            }`}>
                              #{rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(rank)} flex items-center justify-center text-white font-bold mr-3`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium flex items-center gap-2">
                                {user.name}
                                {isCurrentUser && (
                                  <span className="text-xs px-2 py-1 bg-purple-500/30 text-purple-300 rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-500 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={`text-2xl font-bold ${
                              rank === 1 ? 'text-yellow-400' :
                              rank === 2 ? 'text-gray-300' :
                              rank === 3 ? 'text-orange-400' :
                              'text-white'
                            }`}>
                              {user.score}
                            </span>
                            <span className="text-gray-500 text-sm">pts</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {users.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">👑</div>
              <p className="text-gray-400 text-sm mb-1">Current Champion</p>
              <p className="text-xl font-bold text-gradient">{users[0]?.name || 'TBD'}</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <p className="text-gray-400 text-sm mb-1">Total Players</p>
              <p className="text-xl font-bold text-gradient">{users.length}</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">💯</div>
              <p className="text-gray-400 text-sm mb-1">Top Score</p>
              <p className="text-xl font-bold text-gradient">{users[0]?.score || 0} pts</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
