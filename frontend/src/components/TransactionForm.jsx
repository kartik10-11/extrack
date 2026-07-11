import { useState } from 'react';

const defaultCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Salary', 'Other'];

const TransactionForm = ({ onSubmit, initial, onCancel }) => {
  const [form, setForm] = useState(
    initial || { type: 'expense', amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), note: '' }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
      <div className="col-span-2 flex gap-2">
        {['expense', 'income'].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setForm({ ...form, type: t })}
            className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize border ${
              form.type === t ? 'bg-forest-600 text-white border-forest-600' : 'border-ink/10 text-ink/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <label className="text-sm col-span-1">
        <span className="text-ink/50 block mb-1">Amount</span>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full rounded-lg border border-ink/10 px-3 py-2 font-mono"
          placeholder="0.00"
        />
      </label>
      <label className="text-sm col-span-1">
        <span className="text-ink/50 block mb-1">Date</span>
        <input
          required
          type="date"
          name="date"
          value={form.date?.slice ? form.date.slice(0, 10) : form.date}
          onChange={handleChange}
          className="w-full rounded-lg border border-ink/10 px-3 py-2"
        />
      </label>
      <label className="text-sm col-span-1">
        <span className="text-ink/50 block mb-1">Category</span>
        <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-ink/10 px-3 py-2">
          {defaultCategories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="text-sm col-span-1">
        <span className="text-ink/50 block mb-1">Note (optional)</span>
        <input name="note" value={form.note} onChange={handleChange} className="w-full rounded-lg border border-ink/10 px-3 py-2" placeholder="e.g. weekly groceries" />
      </label>
      <div className="col-span-2 flex gap-2 justify-end mt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-ink/50">
            Cancel
          </button>
        )}
        <button type="submit" className="px-5 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white">
          {initial ? 'Save changes' : 'Add entry'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
