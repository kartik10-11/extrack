import { useEffect, useMemo, useState } from 'react';
import api from '../api.js';
import BudgetCard from '../components/BudgetCard.jsx';

const currentMonth = new Date().toISOString().slice(0, 7);

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ category: 'Food', limit: '', month: currentMonth });

  const load = async () => {
    const [b, t] = await Promise.all([
      api.get('/budgets', { params: { month: currentMonth } }),
      api.get('/transactions')
    ]);
    setBudgets(b.data);
    setTransactions(t.data);
  };

  useEffect(() => { load(); }, []);

  const spentByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === 'expense' && t.date.slice(0, 7) === currentMonth)
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return map;
  }, [transactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/budgets', { ...form, limit: Number(form.limit) });
    setForm({ ...form, limit: '' });
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/budgets/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xl font-semibold mb-3">Set a monthly budget — {currentMonth}</p>
        <form onSubmit={handleSubmit} className="flex gap-3 bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
            {['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="number" min="0" step="0.01" required placeholder="Limit" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-mono flex-1" />
          <button type="submit" className="px-5 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white">Save</button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {budgets.map((b) => <BudgetCard key={b._id} budget={b} spent={spentByCategory[b.category] || 0} onDelete={handleDelete} />)}
        {budgets.length === 0 && <p className="text-ink/40 text-sm">No budgets set for this month yet.</p>}
      </div>
    </div>
  );
};

export default Budgets;
