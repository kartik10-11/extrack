import { createContext, useContext, useState } from 'react';

const currencies = [
  { code: 'INR', symbol: '₹', locale: 'en-IN', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', locale: 'en-US', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', locale: 'de-DE', label: 'Euro' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', label: 'UAE Dirham' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP', label: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', locale: 'en-CA', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU', label: 'Australian Dollar' },
  { code: 'SGD', symbol: 'S$', locale: 'en-SG', label: 'Singapore Dollar' },
  { code: 'CNY', symbol: '¥', locale: 'zh-CN', label: 'Chinese Yuan' },
];

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return currencies.find(c => c.code === saved) || currencies[0];
  });

  const changeCurrency = (code) => {
    const selected = currencies.find(c => c.code === code);
    if (selected) {
      setCurrency(selected);
      localStorage.setItem('currency', code);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencies, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);