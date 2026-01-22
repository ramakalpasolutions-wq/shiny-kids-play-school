'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple password check
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      // Store auth in sessionStorage
      sessionStorage.setItem('adminAuth', 'true');
      router.push('/admin');
    } else {
      setError('Invalid password!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDFA] flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-[#14B8A6] max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-4xl font-bold text-[#14B8A6] mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter password to access admin panel</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-800 font-bold mb-3 text-lg">
              🔑 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#14B8A6] text-white py-4 rounded-2xl hover:bg-[#0F766E] transition font-bold text-xl shadow-lg transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-[#14B8A6] hover:text-[#0F766E] font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
