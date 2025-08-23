'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Shield, Zap, Crown } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        // Redirect to generator page after successful login
        setTimeout(() => {
          router.push('/generator');
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-login', {
        method: 'DELETE',
      });
      setIsLoggedIn(false);
      setPassword('');
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Access Granted</h1>
          <p className="text-[#ECFEFF]/70 mb-4">Redirecting to Generator page...</p>
          <button
            onClick={handleLogout}
            className="btn-secondary px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#164E63]/20 border border-[#164E63]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#164E63]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
          <p className="text-[#ECFEFF]/70">Enter admin password to access all features</p>
        </div>

        <div className="pf-block p-8">
          <span className="pf-corner tl"></span>
          <span className="pf-corner tr"></span>
          <span className="pf-corner bl"></span>
          <span className="pf-corner br"></span>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#ECFEFF]/80 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full btn-notched py-3 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ECFEFF] mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333]">
            <div className="text-center text-sm text-[#ECFEFF]/60">
              <p className="mb-2">Admin access provides:</p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#164E63]" />
                  <span>All Pages</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#164E63]" />
                  <span>Full Features</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#164E63]" />
                  <span>Bypass Gates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
