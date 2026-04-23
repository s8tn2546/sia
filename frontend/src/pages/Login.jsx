import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green/50 via-white to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/sia-logo.png" alt="SIA" className="w-10 h-10 object-contain" />
            <span className="font-display font-semibold text-2xl text-text-primary">
              SIA
            </span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-medium p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input focus:border-primary focus:ring-2 focus:ring-primary/10"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input focus:border-primary focus:ring-2 focus:ring-primary/10"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-hover">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border bg-bg-secondary rounded-xl p-4">
            <p className="text-xs font-medium text-text-secondary mb-2">Demo Credentials:</p>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>Email: <code className="bg-white px-2 py-1 rounded">demo@sia.local</code></li>
              <li>Password: <code className="bg-white px-2 py-1 rounded">Demo@123</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
