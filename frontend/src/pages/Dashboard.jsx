import { useEffect, useMemo, useState } from 'react';
import api from '../api.js';
import MoneyText from '../components/MoneyText.jsx';
import { CategoryPieChart, IncomeExpenseBarChart, TrendLineChart } from '../components/Charts.jsx';

const monthKey = (d) => new Date(d).toISOString().slice(0, 7);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get('/transactions').then((res) => setTransactions(res.data));
  }, []);

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  const byCategory = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const byMonth = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = monthKey(t.date);
      if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).map((m) => ({ ...m, net: m.income - m.expense }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-ink/40 text-sm font-medium">Net balance</p>
        <MoneyText value={stats.net} className="text-4xl font-semibold" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
          <p className="text-ink/40 text-sm mb-1">Total income</p>
          <MoneyText value={stats.income} className="text-xl font-semibold" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
          <p className="text-ink/40 text-sm mb-1">Total expenses</p>
          <MoneyText value={-stats.expense} className="text-xl font-semibold" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
          <p className="text-ink/40 text-sm mb-1">Entries logged</p>
          <p className="text-xl font-semibold font-mono">{transactions.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
          <p className="font-display font-semibold mb-2">Spending by category</p>
          {byCategory.length ? <CategoryPieChart data={byCategory} /> : <EmptyChart />}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
          <p className="font-display font-semibold mb-2">Income vs expenses</p>
          {byMonth.length ? <IncomeExpenseBarChart data={byMonth} /> : <EmptyChart />}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
        <p className="font-display font-semibold mb-2">Net trend over time</p>
        {byMonth.length ? <TrendLineChart data={byMonth} /> : <EmptyChart />}
      </div>
    </div>
  );
};

const EmptyChart = () => (
  <div className="h-52 flex items-center justify-center text-ink/30 text-sm">Add some transactions to see this chart</div>
);

export default Dashboard;
