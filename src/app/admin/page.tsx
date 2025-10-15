'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  flag: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'users'>('challenges');
  const [isCreating, setIsCreating] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<string | null>(null);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    flag: '',
    points: 100,
  });

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    fetchChallenges();
    fetchUsers();
  }, []);

  const fetchChallenges = async () => {
    const res = await fetch('/api/challenges');
    if (res.ok) {
      const data = await res.json();
      setChallenges(data);
    }
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleCreateChallenge = async () => {
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newChallenge),
    });

    if (res.ok) {
      setNewChallenge({ title: '', description: '', flag: '', points: 100 });
      setIsCreating(false);
      fetchChallenges();
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-terminal-green font-mono relative">
      {/* Matrix background effect */}
      <div className="matrix-bg"></div>
      
      {/* Terminal Header */}
      <nav className="relative z-10 border-b border-terminal-green/30 bg-terminal-bg-alt/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <pre className="text-terminal-red text-sm hidden sm:block">
{`╔═══════════════════╗
║  ADMIN TERMINAL   ║
╚═══════════════════╝`}
              </pre>
              <span className="text-terminal-red terminal-text-bright text-xl font-bold sm:hidden">
                ADMIN_TERMINAL
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/" className="terminal-button px-3 py-1">
                [← MAIN]
              </Link>
              <Link href="/leaderboard" className="terminal-button px-3 py-1">
                [SCORES]
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 terminal-fade-in">
          <pre className="text-terminal-red text-xs sm:text-sm inline-block">
{`================================================================================
                         ADMINISTRATIVE CONTROL PANEL
                            ROOT ACCESS GRANTED
================================================================================`}
          </pre>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="terminal-border inline-flex p-1">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 text-sm font-bold transition-all ${
                activeTab === 'challenges'
                  ? 'bg-terminal-green text-terminal-bg'
                  : 'text-terminal-green-muted hover:text-terminal-green'
              }`}
            >
              [CHALLENGES]
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-terminal-green text-terminal-bg'
                  : 'text-terminal-green-muted hover:text-terminal-green'
              }`}
            >
              [USERS]
            </button>
          </div>
        </div>

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div>
            {/* Create Challenge Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setIsCreating(true)}
                className="terminal-button-primary px-4 py-2 text-sm font-bold"
              >
                [+ NEW_CHALLENGE]
              </button>
            </div>

            {/* Create Challenge Form */}
            {isCreating && (
              <div className="terminal-card p-6">
                <div className="text-terminal-green font-bold mb-4">
                  <span className="terminal-prompt">create_challenge --interactive</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  <div>
                    <label className="block text-terminal-green-muted text-sm mb-2">TITLE:</label>
                    <input
                      type="text"
                      value={newChallenge.title}
                      onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                      className="w-full terminal-input text-sm"
                      placeholder="Challenge title"
                    />
                  </div>
                  <div>
                    <label className="block text-terminal-green-muted text-sm mb-2">POINTS:</label>
                    <input
                      type="number"
                      value={newChallenge.points}
                      onChange={(e) => setNewChallenge({ ...newChallenge, points: parseInt(e.target.value) })}
                      className="w-full terminal-input text-sm"
                      placeholder="100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-terminal-green-muted text-sm mb-2">DESCRIPTION:</label>
                    <textarea
                      value={newChallenge.description}
                      onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                      className="w-full terminal-input text-sm resize-none"
                      rows={3}
                      placeholder="Challenge description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-terminal-green-muted text-sm mb-2">FLAG:</label>
                    <input
                      type="text"
                      value={newChallenge.flag}
                      onChange={(e) => setNewChallenge({ ...newChallenge, flag: e.target.value })}
                      className="w-full terminal-input text-sm"
                      placeholder="CTF{example_flag}"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="terminal-button px-3 py-1 text-sm"
                  >
                    [CANCEL]
                  </button>
                  <button
                    onClick={handleCreateChallenge}
                    className="terminal-button-primary px-3 py-1 text-sm"
                  >
                    [CREATE]
                  </button>
                </div>
              </div>
            )}

            {/* Challenges List */}
            <div className="space-y-4 mt-4">
              {challenges.length === 0 ? (
                <div className="terminal-card p-8 text-center">
                  <div className="text-terminal-green-muted">No challenges found in database</div>
                </div>
              ) : (
                challenges.map((challenge, index) => (
                  <div key={challenge.id} className="terminal-card p-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-terminal-green font-bold mb-2">
                          CHALLENGE_{index + 1}: {challenge.title}
                        </div>
                        <div className="text-terminal-green-muted text-sm mb-3 pl-4">
                          &gt; {challenge.description}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs">
                          <span className="text-terminal-amber">
                            FLAG: {challenge.flag}
                          </span>
                          <span className="text-terminal-cyan">
                            POINTS: {challenge.points}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button className="terminal-button px-2 py-1 text-xs">
                          [EDIT]
                        </button>
                        <button className="terminal-button px-2 py-1 text-xs hover:border-terminal-red hover:text-terminal-red">
                          [DELETE]
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="terminal-card overflow-hidden">
            <div className="p-4 border-b border-terminal-green/30">
              <div className="text-terminal-green text-sm">
                <span className="terminal-prompt">SELECT * FROM users;</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="terminal-table w-full">
                <thead>
                  <tr className="text-terminal-green text-sm">
                    <th className="text-left p-4 border-b border-terminal-green/30">USERNAME</th>
                    <th className="text-left p-4 border-b border-terminal-green/30 hidden sm:table-cell">EMAIL</th>
                    <th className="text-left p-4 border-b border-terminal-green/30">ROLE</th>
                    <th className="text-left p-4 border-b border-terminal-green/30 hidden md:table-cell">JOINED</th>
                    <th className="text-right p-4 border-b border-terminal-green/30">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-terminal-green/5 transition-colors">
                      <td className="p-4 border-b border-terminal-green/10">
                        <div className="text-terminal-green font-medium">{user.name}</div>
                      </td>
                      <td className="p-4 border-b border-terminal-green/10 text-terminal-green-muted text-sm hidden sm:table-cell">
                        {user.email}
                      </td>
                      <td className="p-4 border-b border-terminal-green/10">
                        <span className={`px-2 py-1 text-xs font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-terminal-red/20 text-terminal-red border border-terminal-red'
                            : 'bg-terminal-green/20 text-terminal-green border border-terminal-green'
                        }`}>
                          [{user.role}]
                        </span>
                      </td>
                      <td className="p-4 border-b border-terminal-green/10 text-terminal-green-muted text-sm hidden md:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-terminal-green/10 text-right">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="terminal-input px-2 py-1 text-xs"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-terminal-green/30 text-terminal-green-muted text-sm">
              {users.length} user(s) found
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-terminal-green-muted text-xs">
          <pre>
{`================================================================================
                    ADMIN ACCESS | HANDLE WITH CARE
                         ALL ACTIONS ARE LOGGED
================================================================================`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
