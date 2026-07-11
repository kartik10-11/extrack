import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useCurrency } from '../context/CurrencyContext.jsx';

const COLORS = ['#1F4D3A', '#2F9E68', '#E0A030', '#D1495B', '#7A9E8E', '#A3C9B5', '#C2C2C2'];

export const CategoryPieChart = ({ data }) => {
  const { currency } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => `${currency.symbol}${v.toLocaleString(currency.locale, { minimumFractionDigits: 2 })}`} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const IncomeExpenseBarChart = ({ data }) => {
  const { currency } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#14201910" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `${currency.symbol}${v.toLocaleString(currency.locale, { minimumFractionDigits: 2 })}`} />
        <Bar dataKey="income" fill="#2F9E68" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="#D1495B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TrendLineChart = ({ data }) => {
  const { currency } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#14201910" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `${currency.symbol}${v.toLocaleString(currency.locale, { minimumFractionDigits: 2 })}`} />
        <Line type="monotone" dataKey="net" stroke="#1F4D3A" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};