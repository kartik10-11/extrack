import { useCurrency } from '../context/CurrencyContext.jsx';

const MoneyText = ({ value, className = '' }) => {
  const { currency } = useCurrency();
  const isNegative = value < 0;
  const color = value > 0 ? 'text-forest-400' : value < 0 ? 'text-coral' : 'text-ink/60';
  const formatted = Math.abs(value).toLocaleString(currency.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return (
    <span className={`font-mono tabular ${color} ${className}`}>
      {isNegative ? '−' : ''}{currency.symbol}{formatted}
    </span>
  );
};

export default MoneyText;