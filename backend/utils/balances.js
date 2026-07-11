// Computes each member's net balance within a group from its expenses
// and settlements — the same logic apps like Splitwise use.
//
// Positive balance  => the group owes this member money.
// Negative balance => this member owes the group money.
export const computeBalances = (members, expenses, settlements) => {
  const balances = {};
  members.forEach((m) => (balances[m] = 0));

  expenses.forEach((exp) => {
    // Whoever paid is owed the full amount back...
    balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount;
    // ...minus everyone's individual share of it (including their own).
    exp.splits.forEach((s) => {
      balances[s.member] = (balances[s.member] || 0) - s.share;
    });
  });

  settlements.forEach((s) => {
    // "from" paying "to" reduces what "from" owes and what "to" is owed.
    balances[s.from] = (balances[s.from] || 0) + s.amount;
    balances[s.to] = (balances[s.to] || 0) - s.amount;
  });

  return balances;
};
