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

  const getRankSymbol = (rank: number) => {
    switch (rank) {
      case 1: return '[GOLD]';
      case 2: return '[SILVER]';
      case 3: return '[BRONZE]';
      default: return `[${rank}]`;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'text-terminal-yellow';
      case 2: return 'text-terminal-green-dark';
      case 3: return 'text-terminal-amber';
      default: return 'text-terminal-green-muted';
    }
  };

  return (
    <div className="min-h-screen bg-black text-terminal-green font-mono relative">
      {/* Matrix background effect */}
      <div className="matrix-bg"></div>
      
      {/* Terminal Header */}
      <nav className="relative z-10 border-b border-terminal-green/30 bg-terminal-bg-alt/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-terminal-green terminal-text-bright text-xl font-bold">
                CTF_TERMINAL
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="terminal-button px-3 py-1 text-sm">
                [← CHALLENGES]
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 terminal-fade-in">
          <pre className="text-terminal-green text-xs sm:text-sm inline-block">
{`╔═══════════════════════════════════════╗
║         GLOBAL LEADERBOARD            ║
╚═══════════════════════════════════════╝`}
          </pre>
          <div className="mt-4 text-terminal-green-muted text-sm">
            <span className="terminal-prompt">query --table users --sort score DESC</span>
          </div>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-terminal-green text-lg mb-4 terminal-loading">
                LOADING DATABASE
              </div>
              <div className="text-terminal-green-muted text-sm">
                Fetching user rankings...
              </div>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="terminal-card p-12 text-center">
            <pre className="text-terminal-amber text-sm">
{`╔════════════════════════════════════════╗
║        NO PLAYERS REGISTERED           ║
║                                        ║
║    Be the first to solve a challenge!  ║
╚════════════════════════════════════════╝`}
            </pre>
          </div>
        ) : (
          <>
            <div className="terminal-card overflow-hidden mb-8">
              <div className="p-4 border-b border-terminal-green/30">
                <div className="text-terminal-green text-sm">
                  <span className="terminal-prompt">SELECT * FROM leaderboard ORDER BY score DESC;</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="terminal-table w-full">
                  <thead>
                    <tr className="text-terminal-green text-sm">
                      <th className="text-left p-4 border-b border-terminal-green/30">RANK</th>
                      <th className="text-left p-4 border-b border-terminal-green/30">USERNAME</th>
                      <th className="text-left p-4 border-b border-terminal-green/30 hidden sm:table-cell">EMAIL</th>
                      <th className="text-right p-4 border-b border-terminal-green/30">SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      const rank = index + 1;
                      const isCurrentUser = session?.user?.email === user.email;
                      
                      return (
                        <tr 
                          key={user.id} 
                          className={`hover:bg-terminal-green/5 transition-colors ${
                            isCurrentUser ? 'bg-terminal-green/10' : ''
                          }`}
                        >
                          <td className="p-4 border-b border-terminal-green/10">
                            <span className={`font-bold ${getRankClass(rank)}`}>
                              {getRankSymbol(rank)}
                            </span>
                          </td>
                          <td className="p-4 border-b border-terminal-green/10">
                            <div className="flex items-center gap-2">
                              <span className={rank <= 3 ? getRankClass(rank) : 'text-terminal-green'}>
                                {user.name}
                              </span>
                              {isCurrentUser && (
                                <span className="text-xs px-2 py-0.5 bg-terminal-green/20 text-terminal-green rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 border-b border-terminal-green/10 text-terminal-green-muted text-sm hidden sm:table-cell">
                            {user.email}
                          </td>
                          <td className="p-4 border-b border-terminal-green/10 text-right">
                            <span className={`font-bold ${rank <= 3 ? getRankClass(rank) : 'text-terminal-green'}`}>
                              {user.score}
                            </span>
                            <span className="text-terminal-green-muted text-sm ml-1">pts</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-terminal-green/30 text-terminal-green-muted text-sm">
                {users.length} row(s) returned
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="terminal-card p-4 text-center">
                <div className="text-terminal-green-muted text-xs mb-2">CURRENT_CHAMPION</div>
                <div className="text-terminal-yellow font-bold text-lg terminal-glitch">
                  {users[0]?.name || 'NULL'}
                </div>
              </div>
              <div className="terminal-card p-4 text-center">
                <div className="text-terminal-green-muted text-xs mb-2">TOTAL_PLAYERS</div>
                <div className="text-terminal-green font-bold text-lg">
                  {users.length}
                </div>
              </div>
              <div className="terminal-card p-4 text-center">
                <div className="text-terminal-green-muted text-xs mb-2">TOP_SCORE</div>
                <div className="text-terminal-green font-bold text-lg">
                  {users[0]?.score || 0} <span className="text-sm text-terminal-green-muted">pts</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-terminal-green-muted text-xs">
          <pre>
{`================================================================================
                    LEADERBOARD UPDATED IN REAL-TIME
                         REFRESH TO SEE CHANGES
================================================================================`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
