// The app's signature visual detail: every amount renders in a tabular
// monospace "ledger" style, colored by sign, so money always reads like money.
const MoneyText = ({ value, className = '' }) => {
  const isNegative = value < 0;
  const color = value > 0 ? 'text-forest-400' : value < 0 ? 'text-coral' : 'text-ink/60';
  const formatted = Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return (
    <span className={`font-mono tabular ${color} ${className}`}>
      {isNegative ? '\u2212' : ''}${formatted}
    </span>
  );
};

export default MoneyText;
