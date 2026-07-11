import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-700">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <p className="font-display text-2xl font-semibold mb-1">Extrack</p>
        <p className="text-ink/50 text-sm mb-6">Create your account</p>
        {error && <p className="text-coral text-sm mb-3">{error}</p>}
        <label className="text-sm block mb-3">
          <span className="text-ink/50 block mb-1">Name</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-ink/10 px-3 py-2" />
        </label>
        <label className="text-sm block mb-3">
          <span className="text-ink/50 block mb-1">Email</span>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-ink/10 px-3 py-2" />
        </label>
        <label className="text-sm block mb-5">
          <span className="text-ink/50 block mb-1">Password</span>
          <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-ink/10 px-3 py-2" />
        </label>
        <button type="submit" className="w-full bg-forest-600 text-white rounded-lg py-2.5 font-medium">Create account</button>
        <p className="text-sm text-ink/50 text-center mt-4">
          Already have an account? <Link to="/login" className="text-forest-600 font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
