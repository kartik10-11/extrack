import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Groups load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await api.post('/groups', { name, members: [] });
      setName('');
      if (res.data?._id) {
        navigate(`/groups/${res.data._id}`);
      } else {
        load();
      }
    } catch (err) {
      console.error('Create group error:', err);
    }
  };

  const handleClick = (group) => {
    if (group?._id) {
      navigate(`/groups/${group._id}`);
    }
  };

  if (loading) return <p className="text-ink/40">Loading groups...</p>;

  return (
    <div className="space-y-6">
      <p className="font-display text-xl font-semibold">Groups</p>

      <form onSubmit={handleCreate} className="flex gap-3 bg-white rounded-2xl p-5 shadow-sm border border-ink/5">
        <input
          placeholder="New group name, e.g. Goa Trip"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-ink/10 px-3 py-2 text-sm flex-1"
        />
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium rounded-lg bg-forest-600 text-white"
        >
          Create group
        </button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {groups.map((g) => (
          g?._id ? (
            <div
              key={g._id}
              onClick={() => handleClick(g)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-ink/5 hover:border-forest-400 cursor-pointer"
            >
              <p className="font-display font-semibold">{g.name}</p>
              <p className="text-ink/40 text-sm mt-1">
                {(g.members?.length || 0) + 1} members
              </p>
            </div>
          ) : null
        ))}
        {groups.length === 0 && (
          <p className="text-ink/40 text-sm col-span-3">
            No groups yet — create one to split shared expenses.
          </p>
        )}
      </div>
    </div>
  );
};

export default Groups;