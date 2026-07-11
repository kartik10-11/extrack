import { useEffect, useState } from 'react';
import api from '../api.js';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionTable from '../components/TransactionTable.jsx';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ type: '', category: '', search: '' });

  const load = async () => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    const { data } = await api.get('/transactions', { params });
    setTransactions(data);
  };

  useEffect(() => { load(); }, [filters]);

  const handleSubmit = async (form) => {
    if (editing) {
      await api.put(`/transactions/${editing._id}`, form);
    } else {
      await api.post('/transactions', form);
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xl font-semibold mb-3">{editing ? 'Edit entry' : 'Add a transaction'}</p>
        <TransactionForm onSubmit={handleSubmit} initial={editing} onCancel={editing ? () => setEditing(null) : null} />
      </div>

      <div className="flex gap-2">
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          placeholder="Search note or category…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="rounded-lg border border-ink/10 px-3 py-2 text-sm flex-1"
        />
      </div>

      <TransactionTable transactions={transactions} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
};

export default Transactions;
