import MoneyText from './MoneyText.jsx';

const TransactionTable = ({ transactions, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-ink/5 overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-ink/40 border-b border-ink/5">
          <th className="py-3 px-4 font-medium">Date</th>
          <th className="py-3 px-4 font-medium">Category</th>
          <th className="py-3 px-4 font-medium">Note</th>
          <th className="py-3 px-4 font-medium text-right">Amount</th>
          <th className="py-3 px-4"></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id} className="border-b border-ink/5 last:border-0 hover:bg-sand/60">
            <td className="py-3 px-4 text-ink/60">{new Date(t.date).toLocaleDateString()}</td>
            <td className="py-3 px-4">
              <span className="inline-block rounded-full bg-forest-50 text-forest-700 px-2 py-0.5 text-xs font-medium">
                {t.category}
              </span>
            </td>
            <td className="py-3 px-4 text-ink/50">{t.note || '—'}</td>
            <td className="py-3 px-4 text-right">
              <MoneyText value={t.type === 'income' ? t.amount : -t.amount} />
            </td>
            <td className="py-3 px-4 text-right whitespace-nowrap">
              <button onClick={() => onEdit(t)} className="text-ink/40 hover:text-forest-600 text-xs mr-3">Edit</button>
              <button onClick={() => onDelete(t._id)} className="text-ink/40 hover:text-coral text-xs">Delete</button>
            </td>
          </tr>
        ))}
        {transactions.length === 0 && (
          <tr>
            <td colSpan={5} className="py-10 text-center text-ink/30">No entries yet. Add your first transaction above.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default TransactionTable;
