'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('ACCESS DENIED: Invalid credentials');
    } else {
      router.push('/');
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
║     SYSTEM AUTHENTICATION     ║
╚═══════════════════════════════╝`}
          </pre>
          <div className="mt-4 text-terminal-green-muted text-sm">
            <span className="terminal-cursor">Establishing secure connection</span>
          </div>
        </div>

        {/* Login Terminal */}
        <div className="terminal-card p-6 sm:p-8">
          <div className="mb-6">
            <div className="text-terminal-green text-sm mb-2">
              <span className="terminal-prompt">login --user</span>
            </div>
            <div className="text-terminal-green-muted text-xs">
              Enter your credentials to access the system
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoComplete="current-password"
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
                  <span className="terminal-loading">AUTHENTICATING</span>
                ) : (
                  '[AUTHENTICATE]'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-terminal-green/30">
            <div className="text-center">
              <div className="text-terminal-green-muted text-sm mb-2">
                New to the system?
              </div>
              <Link href="/register" className="text-terminal-green hover:text-terminal-green-dark transition-colors text-sm font-bold">
                &gt; CREATE_NEW_ACCOUNT
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

        {/* System Info */}
        <div className="mt-8 text-center text-terminal-green-muted text-xs">
          <pre>
{`================================================================================
                         SECURE CONNECTION ESTABLISHED
                              TLS 1.3 | AES-256
================================================================================`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
