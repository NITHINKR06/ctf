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
  const [terminalInput, setTerminalInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const res = await fetch('/api/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    };

    fetchChallenges();
    
    // Hide welcome message after 3 seconds
    setTimeout(() => setShowWelcome(false), 3000);
  }, []);

  const handleFlagSubmit = async (challengeId: string) => {
    const flag = flags[challengeId];
    if (!flag) {
      setSubmissionStatus({ ...submissionStatus, [challengeId]: '[ERROR] No flag provided' });
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
      setSubmissionStatus({ ...submissionStatus, [challengeId]: '[SUCCESS] Flag accepted! +' + challenges.find(c => c.id === challengeId)?.points + ' points' });
      setSolvedChallenges([...solvedChallenges, challengeId]);
      setFlags({ ...flags, [challengeId]: '' });
    } else {
      setSubmissionStatus({ ...submissionStatus, [challengeId]: '[FAILED] Invalid flag. Access denied.' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-terminal-green font-mono relative">
      {/* Matrix background effect */}
      <div className="matrix-bg"></div>
      
      {/* Scanline effect is applied via CSS */}
      
      {/* Terminal Header */}
      <nav className="relative z-10 border-b border-terminal-green/30 bg-terminal-bg-alt/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <pre className="text-terminal-green text-sm hidden sm:block">
{`╔═══════════════╗
║ CTF TERMINAL  ║
╚═══════════════╝`}
              </pre>
              <span className="text-terminal-green terminal-text-bright text-xl font-bold sm:hidden">
                CTF_TERMINAL
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              {session ? (
                <>
                  <span className="terminal-text-muted hidden sm:inline">
                    user@{session.user?.name?.toLowerCase().replace(/\s/g, '_')}
                  </span>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="terminal-button px-3 py-1">
                      [ADMIN]
                    </Link>
                  )}
                  <Link href="/leaderboard" className="terminal-button px-3 py-1">
                    [SCORES]
                  </Link>
                  <button
                    onClick={() => router.push('/api/auth/signout')}
                    className="terminal-button px-3 py-1"
                  >
                    [LOGOUT]
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="terminal-button px-3 py-1">
                    [LOGIN]
                  </Link>
                  <Link href="/register" className="terminal-button-primary px-3 py-1">
                    [REGISTER]
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 terminal-fade-in">
            <pre className="text-terminal-green text-xs sm:text-sm overflow-x-auto">
{`================================================================================
 ██████╗████████╗███████╗    ██████╗ ██╗      █████╗ ████████╗███████╗ ██████╗ ██████╗ ███╗   ███╗
██╔════╝╚══██╔══╝██╔════╝    ██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗████╗ ████║
██║        ██║   █████╗      ██████╔╝██║     ███████║   ██║   █████╗  ██║   ██║██████╔╝██╔████╔██║
██║        ██║   ██╔══╝      ██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║
╚██████╗   ██║   ██║         ██║     ███████╗██║  ██║   ██║   ██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║
 ╚═════╝   ╚═╝   ╚═╝         ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
================================================================================`}
            </pre>
          </div>
        )}

        {/* System Status */}
        <div className="mb-6 terminal-card p-4">
          <div className="text-terminal-green-muted text-sm mb-2">
            <span className="terminal-prompt">system_status</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-terminal-green-muted">CHALLENGES_LOADED: </span>
              <span className="text-terminal-green terminal-text-bright">{challenges.length}</span>
            </div>
            <div>
              <span className="text-terminal-green-muted">SOLVED_BY_USER: </span>
              <span className="text-terminal-green terminal-text-bright">{solvedChallenges.length}</span>
            </div>
            <div>
              <span className="text-terminal-green-muted">COMPLETION_RATE: </span>
              <span className="text-terminal-green terminal-text-bright">
                {challenges.length > 0 ? Math.round((solvedChallenges.length / challenges.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="mb-6">
          <div className="terminal-card p-4">
            <div className="text-terminal-green-muted text-sm mb-4">
              <span className="terminal-prompt">list_challenges --active</span>
            </div>
            
            {!session ? (
              <div className="text-center py-8">
                <pre className="text-terminal-amber text-sm mb-4">
{`╔════════════════════════════════════════╗
║     AUTHENTICATION REQUIRED            ║
║                                        ║
║     Please login to access challenges  ║
╚════════════════════════════════════════╝`}
                </pre>
                <Link href="/login" className="terminal-button-primary px-6 py-2 inline-block">
                  [AUTHENTICATE]
                </Link>
              </div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-8">
                <pre className="text-terminal-green-muted text-sm">
{`╔════════════════════════════════════════╗
║     NO ACTIVE CHALLENGES               ║
║                                        ║
║     Waiting for new challenges...      ║
╚════════════════════════════════════════╝`}
                </pre>
              </div>
            ) : (
              <div className="space-y-4">
                {challenges.map((challenge, index) => {
                  const isSolved = solvedChallenges.includes(challenge.id);
                  return (
                    <div
                      key={challenge.id}
                      className={`terminal-border p-4 mb-4 ${isSolved ? 'border-terminal-green' : ''} terminal-fade-in`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-terminal-green-muted text-sm">CHALLENGE_{index + 1}:</span>
                            <span className="text-terminal-green font-bold">
                              {challenge.title}
                            </span>
                            {isSolved && (
                              <span className="text-terminal-green terminal-success text-sm">
                                [SOLVED]
                              </span>
                            )}
                          </div>
                          <div className="text-terminal-green-muted text-sm mb-3 pl-4">
                            &gt; {challenge.description}
                          </div>
                        </div>
                        <div className="text-terminal-amber font-bold text-sm">
                          [{challenge.points} PTS]
                        </div>
                      </div>
                      
                      {!isSolved && (
                        <div className="space-y-2 mt-3">
                          <div className="flex gap-2 items-center max-w-lg">
                            <span className="text-terminal-green text-sm">$</span>
                            <input
                              type="text"
                              placeholder="Enter flag..."
                              value={flags[challenge.id] || ''}
                              onChange={(e) => setFlags({ ...flags, [challenge.id]: e.target.value })}
                              className="flex-1 terminal-input text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleFlagSubmit(challenge.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleFlagSubmit(challenge.id)}
                              className="terminal-button px-4 py-1 text-sm whitespace-nowrap"
                            >
                              [SUBMIT]
                            </button>
                          </div>
                          {submissionStatus[challenge.id] && (
                            <div className={`text-sm pl-4 ${
                              submissionStatus[challenge.id].includes('SUCCESS') 
                                ? 'terminal-success' 
                                : submissionStatus[challenge.id].includes('FAILED')
                                ? 'terminal-error'
                                : 'terminal-warning'
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
        </div>

        {/* Footer Terminal */}
        <div className="text-center text-terminal-green-muted text-xs">
          <pre>
{`================================================================================
                    SYSTEM READY | TYPE 'HELP' FOR COMMANDS
================================================================================`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
