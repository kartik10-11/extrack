import MoneyText from './MoneyText.jsx';

const BudgetCard = ({ budget, spent, onDelete }) => {
  const pct = budget.limit > 0 ? Math.min(100, Math.round((spent / budget.limit) * 100)) : 0;
  const over = spent > budget.limit;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-display font-semibold">{budget.category}</p>
          <p className="text-xs text-ink/40">{budget.month}</p>
        </div>
        <button onClick={() => onDelete(budget._id)} className="text-ink/30 hover:text-coral text-xs">Remove</button>
      </div>
      <div className="flex justify-between items-baseline mb-2">
        <MoneyText value={-spent} className="text-lg font-semibold" />
        <span className="text-ink/40 text-sm">of <MoneyText value={-budget.limit} className="text-sm" /></span>
      </div>
      <div className="h-2 rounded-full bg-ink/5 overflow-hidden">
        <div className={`h-full rounded-full ${over ? 'bg-coral' : pct > 80 ? 'bg-amber' : 'bg-forest-400'}`} style={{ width: `${pct}%` }} />
      </div>
      {over && <p className="text-xs text-coral mt-2">Over budget by {(spent - budget.limit).toFixed(2)}</p>}
    </div>
  );
};

export default BudgetCard;
