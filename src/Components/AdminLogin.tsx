import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../Apis/Admin-Api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = { userName: username, password };
      const response = await adminLogin(credentials);

      if ((response as any)?.success === true) {
        // Save tokens to localStorage
        const { accessToken, refreshToken } = response as any;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        navigate('admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Title with gradient */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            BookMyCuts
          </span>
        </h1>

        <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg 
                         text-white placeholder-slate-400 focus:outline-none 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg 
                         text-white placeholder-slate-400 focus:outline-none 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-950/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-700 hover:to-purple-700 
                       text-white font-medium rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                       focus:ring-offset-slate-900
                       transition-all duration-300 transform hover:scale-[1.02]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}