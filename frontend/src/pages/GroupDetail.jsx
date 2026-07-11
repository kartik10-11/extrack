import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';
import MoneyText from '../components/MoneyText.jsx';

const GroupDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [editingMemberName, setEditingMemberName] = useState('');
  const [expense, setExpense] = useState({
    description: '', amount: '', paidBy: 'me', splitType: 'equal'
  });
  const [settle, setSettle] = useState({ from: '', to: 'me', amount: '' });

  const load = () => api.get(`/groups/${id}`).then((res) => setData(res.data));

  useEffect(() => { load(); }, [id]);

  if (!data) return <p className="text-ink/40 p-8">Loading…</p>;

  const { group, expenses, balances } = data;
  const memberNames = ['me', ...group.members.map((m) => m.name)];

  const addMember = async (e) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    await api.post(`/groups/${id}/members`, { name: memberName });
    setMemberName('');
    load();
  };

  const startEdit = (member) => {
    setEditingMember(member._id);
    setEditingMemberName(member.name);
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setEditingMemberName('');
  };

  const saveEdit = async (memberId) => {
    if (!editingMemberName.trim()) return;
    try {
      await api.put(`/groups/${id}/members/${memberId}`, { name: editingMemberName });
      setEditingMember(null);
      setEditingMemberName('');
      load();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const removeMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/groups/${id}/members/${memberId}`);
      load();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
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
    await api.post(`/groups/${id}/settlements`, {
      ...settle, amount: Number(settle.amount)
    });
    setSettle({ from: '', to: 'me', amount: '' });
    load();
  };

  return (
    <div className="space-y-6">

      {/* Group title */}
      <p className="font-display text-2xl font-semibold">{group.name}</p>

      {/* Balances */}
      <div className="grid grid-cols-3 gap-4">
        {memberNames.map((m) => (
          <div key={m} className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
            <p className="font-medium capitalize">{m}</p>
            <MoneyText value={balances[m] || 0} className="text-lg" />
            <p className="text-xs text-ink/40 mt-1">
              {(balances[m] || 0) >= 0 ? 'is owed' : 'owes the group'}
            </p>
          </div>
        ))}
      </div>

      {/* Members section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
        <p className="font-display font-semibold mb-4">Members</p>

        {/* You (owner) */}
        <div className="flex items-center justify-between py-2 border-b border-ink/5">
          <span className="text-sm font-medium">me (you)</span>
          <span className="text-xs bg-forest-50 text-forest-700 px-2 py-0.5 rounded-full">Owner</span>
        </div>

        {/* Other members */}
        {group.members.length === 0 && (
          <p className="text-ink/30 text-sm py-3">No members added yet.</p>
        )}

        {group.members.map((member) => (
          <div key={member._id} className="py-2 border-b border-ink/5 last:border-0">
            {editingMember === member._id ? (
              /* Edit mode */
              <div className="flex gap-2 items-center">
                <input
                  value={editingMemberName}
                  onChange={(e) => setEditingMemberName(e.target.value)}
                  className="rounded-lg border border-ink/10 px-3 py-1.5 text-sm flex-1"
                  autoFocus
                />
                <button
                  onClick={() => saveEdit(member._id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-forest-600 text-white"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1.5 text-xs rounded-lg border border-ink/10 text-ink/50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              /* View mode */
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{member.name}</span>
                <div className="flex gap-4">
                  <button
                    onClick={() => startEdit(member)}
                    className="text-xs text-forest-600 hover:text-forest-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeMember(member._id)}
                    className="text-xs text-coral hover:text-red-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add member */}
        <form onSubmit={addMember} className="flex gap-2 mt-4">
          <input
            placeholder="Add member name..."
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="rounded-lg border border-ink/10 px-3 py-2 text-sm flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white"
          >
            Add
          </button>
        </form>
      </div>

      {/* Add expense */}
      <form onSubmit={addExpense} className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5 space-y-3">
        <p className="font-display font-semibold">Add Expense</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="What was it for?"
            value={expense.description}
            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            className="rounded-lg border border-ink/10 px-3 py-2 text-sm col-span-2"
          />
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-mono"
          />
          <select
            value={expense.paidBy}
            onChange={(e) => setExpense({ ...expense, paidBy: e.target.value })}
            className="rounded-lg border border-ink/10 px-3 py-2 text-sm"
          >
            {memberNames.map((m) => (
              <option key={m} value={m}>{m} paid</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white"
        >
          Add expense (split equally)
        </button>
      </form>

      {/* Expenses list */}
      <div className="bg-white rounded-2xl shadow-sm border border-ink/5">
        <p className="font-display font-semibold px-5 pt-4 pb-2">Expenses</p>
        <div className="divide-y divide-ink/5">
          {expenses.map((e) => (
            <div key={e._id} className="flex justify-between items-center px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{e.description}</p>
                <p className="text-ink/40 text-xs">
                  {e.paidBy} paid · {new Date(e.date).toLocaleDateString()}
                </p>
              </div>
              <MoneyText value={e.amount} />
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="px-5 py-6 text-ink/30 text-sm">No shared expenses yet.</p>
          )}
        </div>
      </div>

      {/* Record settlement */}
      <form onSubmit={recordSettlement} className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5 space-y-3">
        <p className="font-display font-semibold">Record Settlement</p>
        <div className="grid grid-cols-3 gap-3">
          <select
            value={settle.from}
            onChange={(e) => setSettle({ ...settle, from: e.target.value })}
            className="rounded-lg border border-ink/10 px-3 py-2 text-sm"
          >
            <option value="">Who paid back…</option>
            {memberNames.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={settle.to}
            onChange={(e) => setSettle({ ...settle, to: e.target.value })}
            className="rounded-lg border border-ink/10 px-3 py-2 text-sm"
          >
            {memberNames.map((m) => (
              <option key={m} value={m}>…to {m}</option>
            ))}
          </select>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={settle.amount}
            onChange={(e) => setSettle({ ...settle, amount: e.target.value })}
            className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-mono"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white"
        >
          Record settlement
        </button>
      </form>

    </div>
  );
};

export default GroupDetail;