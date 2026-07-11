import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/groups', label: 'Groups' }
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { currency, currencies, changeCurrency } = useCurrency();

  return (
    <aside className="w-60 shrink-0 bg-forest-700 text-sand flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6">
        <p className="font-display text-xl font-semibold tracking-tight">Extrack</p>
        <p className="text-xs text-sand/50 mt-1">Personal Budget Tracker</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-forest-600 text-white'
                  : 'text-sand/70 hover:bg-forest-600/60 hover:text-white'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-sand/10">
        <p className="text-xs text-sand/40 mb-2 px-1">Currency</p>
        <select
          value={currency.code}
          onChange={(e) => changeCurrency(e.target.value)}
          className="w-full rounded-lg bg-forest-600 text-sand text-sm px-3 py-2 border border-sand/10 cursor-pointer"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code} — {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="px-6 py-5 border-t border-sand/10">
        <p className="text-sm font-medium truncate">{user?.name}</p>
        <button onClick={logout} className="text-xs text-sand/50 hover:text-coral mt-1">
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;