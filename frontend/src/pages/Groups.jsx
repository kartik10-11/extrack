import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');

  const load = () => api.get('/groups').then((res) => setGroups(res.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/groups', { name, members: [] });
    setName('');
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex gap-3 bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
        <input placeholder="New group name, e.g. Goa Trip" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-ink/10 px-3 py-2 text-sm flex-1" />
        <button type="submit" className="px-5 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white">Create group</button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {groups.map((g) => (
          <Link key={g._id} to={`/groups/${g._id}`} className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5 hover:border-forest-400">
            <p className="font-display font-semibold">{g.name}</p>
            <p className="text-ink/40 text-sm mt-1">{g.members.length + 1} members</p>
          </Link>
        ))}
        {groups.length === 0 && <p className="text-ink/40 text-sm">No groups yet — create one to split shared expenses.</p>}
      </div>
    </div>
  );
};

export default Groups;
