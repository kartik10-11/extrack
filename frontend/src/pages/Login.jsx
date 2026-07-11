import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-700">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <p className="font-display text-2xl font-semibold mb-1">Ledger</p>
        <p className="text-ink/50 text-sm mb-6">Sign in to your budget tracker</p>
        {error && <p className="text-coral text-sm mb-3">{error}</p>}
        <label className="text-sm block mb-3">
          <span className="text-ink/50 block mb-1">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-ink/10 px-3 py-2" />
        </label>
        <label className="text-sm block mb-5">
          <span className="text-ink/50 block mb-1">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-ink/10 px-3 py-2" />
        </label>
        <button type="submit" className="w-full bg-forest-600 text-white rounded-lg py-2.5 font-medium">Sign in</button>
        <p className="text-sm text-ink/50 text-center mt-4">
          No account? <Link to="/register" className="text-forest-600 font-medium">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
