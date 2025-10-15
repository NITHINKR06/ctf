'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('ERROR: Password mismatch detected');
      return;
    }

    if (password.length < 6) {
      setError('ERROR: Password must be >= 6 characters');
      return;
    }

    setIsLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    setIsLoading(false);

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(`ERROR: ${data.message || 'Registration failed'}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-terminal-green font-mono flex items-center justify-center relative px-4">
      {/* Matrix background effect */}
      <div className="matrix-bg"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* ASCII Art Header */}
        <div className="text-center mb-8 terminal-fade-in">
          <pre className="text-terminal-green text-xs sm:text-sm inline-block">
{`╔═══════════════════════════════╗
║      USER REGISTRATION        ║
╚═══════════════════════════════╝`}
          </pre>
          <div className="mt-4 text-terminal-green-muted text-sm">
            <span className="terminal-cursor">Initialize new user profile</span>
          </div>
        </div>

        {/* Registration Terminal */}
        <div className="terminal-card p-6 sm:p-8">
          <div className="mb-6">
            <div className="text-terminal-green text-sm mb-2">
              <span className="terminal-prompt">useradd --interactive</span>
            </div>
            <div className="text-terminal-green-muted text-xs">
              Create your account to join the system
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-terminal-green-muted text-sm mb-2">
                USERNAME:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-green">$</span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="terminal-input w-full pl-8"
                  placeholder="hacker_name"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-terminal-green-muted text-sm mb-2">
                EMAIL_ADDRESS:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-green">$</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="terminal-input w-full pl-8"
                  placeholder="user@system.net"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-terminal-green-muted text-sm mb-2">
                PASSWORD:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-green">$</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="terminal-input w-full pl-8"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <div className="text-terminal-green-muted text-xs mt-1 pl-4">
                MIN_LENGTH: 6 characters
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-terminal-green-muted text-sm mb-2">
                CONFIRM_PASSWORD:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-green">$</span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="terminal-input w-full pl-8"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && (
              <div className="terminal-border border-terminal-red p-3">
                <p className="terminal-error text-sm flex items-center gap-2">
                  <span>[!]</span> {error}
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full terminal-button-primary py-2 text-sm font-bold tracking-wider"
              >
                {isLoading ? (
                  <span className="terminal-loading">CREATING ACCOUNT</span>
                ) : (
                  '[CREATE_ACCOUNT]'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-terminal-green/30">
            <div className="text-center">
              <div className="text-terminal-green-muted text-sm mb-2">
                Already have an account?
              </div>
              <Link href="/login" className="text-terminal-green hover:text-terminal-green-dark transition-colors text-sm font-bold">
                &gt; LOGIN_TO_SYSTEM
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-terminal-green-muted hover:text-terminal-green transition-colors text-sm">
            &lt; RETURN_TO_MAIN
          </Link>
        </div>

        {/* System Requirements */}
        <div className="mt-8 text-center text-terminal-green-muted text-xs">
          <pre>
{`================================================================================
                        SYSTEM REQUIREMENTS MET
                    Storage: OK | Memory: OK | CPU: OK
================================================================================`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
