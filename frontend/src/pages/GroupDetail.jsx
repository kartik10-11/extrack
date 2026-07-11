import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';
import MoneyText from '../components/MoneyText.jsx';

const GroupDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [expense, setExpense] = useState({ description: '', amount: '', paidBy: 'me', splitType: 'equal' });
  const [settle, setSettle] = useState({ from: '', to: 'me', amount: '' });

  const load = () => api.get(`/groups/${id}`).then((res) => setData(res.data));
  useEffect(() => { load(); }, [id]);

  if (!data) return <p className="text-ink/40">Loading…</p>;
  const { group, expenses, balances } = data;
  const memberNames = ['me', ...group.members.map((m) => m.name)];

  const addMember = async (e) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    await api.post(`/groups/${id}/members`, { name: memberName });
    setMemberName('');
    load();
  };

  const addExpense = async (e) => {
    e.preventDefault();
    const amount = Number(expense.amount);
    const share = amount / memberNames.length;
    const splits = memberNames.map((m) => ({ member: m, share }));
    await api.post(`/groups/${id}/expenses`, { ...expense, amount, splits });
    setExpense({ description: '', amount: '', paidBy: 'me', splitType: 'equal' });
    load();
  };

  const recordSettlement = async (e) => {
    e.preventDefault();
    await api.post(`/groups/${id}/settlements`, { ...settle, amount: Number(settle.amount) });
    setSettle({ from: '', to: 'me', amount: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <p className="font-display text-2xl font-semibold">{group.name}</p>

      <div className="grid grid-cols-3 gap-4">
        {memberNames.map((m) => (
          <div key={m} className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
            <p className="font-medium capitalize">{m}</p>
            <MoneyText value={balances[m] || 0} className="text-lg" />
            <p className="text-xs text-ink/40 mt-1">{(balances[m] || 0) >= 0 ? 'is owed' : 'owes the group'}</p>
          </div>
        ))}
      </div>

      <form onSubmit={addMember} className="flex gap-3 bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
        <input placeholder="Add a member's name" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="rounded-lg border border-ink/10 px-3 py-2 text-sm flex-1" />
        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white">Add member</button>
      </form>

      <form onSubmit={addExpense} className="grid grid-cols-4 gap-3 bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
        <input required placeholder="What was it for?" value={expense.description} onChange={(e) => setExpense({ ...expense, description: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm col-span-2" />
        <input required type="number" min="0" step="0.01" placeholder="Amount" value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-mono" />
        <select value={expense.paidBy} onChange={(e) => setExpense({ ...expense, paidBy: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
          {memberNames.map((m) => <option key={m} value={m}>{m} paid</option>)}
        </select>
        <button className="col-span-4 px-4 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white">Add expense (split equally)</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-ink/5 divide-y divide-ink/5">
        {expenses.map((e) => (
          <div key={e._id} className="flex justify-between items-center px-5 py-3 text-sm">
            <div>
              <p className="font-medium">{e.description}</p>
              <p className="text-ink/40 text-xs">{e.paidBy} paid · {new Date(e.date).toLocaleDateString()}</p>
            </div>
            <MoneyText value={e.amount} />
          </div>
        ))}
        {expenses.length === 0 && <p className="px-5 py-6 text-ink/30 text-sm">No shared expenses yet.</p>}
      </div>

      <form onSubmit={recordSettlement} className="grid grid-cols-4 gap-3 bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
        <select value={settle.from} onChange={(e) => setSettle({ ...settle, from: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
          <option value="">Who paid back…</option>
          {memberNames.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={settle.to} onChange={(e) => setSettle({ ...settle, to: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
          {memberNames.map((m) => <option key={m} value={m}>…to {m}</option>)}
        </select>
        <input required type="number" min="0" step="0.01" placeholder="Amount" value={settle.amount} onChange={(e) => setSettle({ ...settle, amount: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-mono" />
        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white">Record settlement</button>
      </form>
    </div>
  );
};

export default GroupDetail;
