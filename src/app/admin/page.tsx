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
              <h1 className="text-2xl font-bold text-gradient neon-text">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="px-4 py-2 glass text-white rounded-lg hover:bg-white/10 transition-colors">
                ← Back to Platform
              </Link>
              <Link href="/leaderboard" className="px-4 py-2 bg-gradient-secondary text-white rounded-lg hover:opacity-90 transition-opacity">
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-gradient">Control Center</span>
          </h2>
          <p className="text-xl text-gray-400">Manage challenges and users</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'challenges'
                  ? 'bg-gradient-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Challenges
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Users
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
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="text-xl">➕</span>
                Create Challenge
              </button>
            </div>

            {/* Create Challenge Form */}
            {isCreating && (
              <div className="glass rounded-xl p-6 mb-6 border-gradient">
                <h3 className="text-xl font-bold text-white mb-4">New Challenge</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={newChallenge.title}
                      onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                      className="w-full px-4 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Challenge title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
                    <input
                      type="number"
                      value={newChallenge.points}
                      onChange={(e) => setNewChallenge({ ...newChallenge, points: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newChallenge.description}
                      onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                      className="w-full px-4 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Challenge description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Flag</label>
                    <input
                      type="text"
                      value={newChallenge.flag}
                      onChange={(e) => setNewChallenge({ ...newChallenge, flag: e.target.value })}
                      className="w-full px-4 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="CTF{example_flag}"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 glass text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateChallenge}
                    className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {/* Challenges List */}
            <div className="grid grid-cols-1 gap-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="glass rounded-xl p-6 border-gradient card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{challenge.title}</h4>
                      <p className="text-gray-400 mb-3">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-purple-400">
                          <span className="text-gray-500">Flag:</span> {challenge.flag}
                        </span>
                        <span className="text-cyan-400">
                          <span className="text-gray-500">Points:</span> {challenge.points}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
                        ✏️
                      </button>
                      <button className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold mr-3">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-white font-medium">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="px-3 py-1 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
