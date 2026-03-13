import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import LoginForm from './components/LoginForm.jsx';
import StaffForm from './components/StaffForm.jsx';
import StaffTable from './components/StaffTable.jsx';
import Filters from './components/Filters.jsx';
import TopBar from './components/TopBar.jsx';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export default function App() {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: '',
    postId: '',
    hireStart: '',
    hireEnd: '',
    q: ''
  });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  const filterParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return params;
  }, [filters]);

  const loadMeta = async () => {
    const [depRes, postRes] = await Promise.all([
      api.get('/meta/departments'),
      api.get('/meta/posts')
    ]);
    setDepartments(depRes.data);
    setPosts(postRes.data);
  };

  const loadStaff = async () => {
    const res = await api.get('/staff', { params: filterParams });
    setStaff(res.data);
  };

  const loadMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (!user) return;
    loadMeta();
    loadStaff();
  }, [user, filterParams]);

  const handleLogin = async (values) => {
    try {
      setMessage('');
      const res = await api.post('/auth/login', values);
      setUser(res.data);
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const handleCreate = async (values) => {
    setMessage('');
    await api.post('/staff', values);
    setEditing(null);
    await loadStaff();
    setMessage('Staff member created.');
  };

  const handleUpdate = async (id, values) => {
    setMessage('');
    await api.put(`/staff/${id}`, values);
    setEditing(null);
    await loadStaff();
    setMessage('Staff member updated.');
  };

  const handleDelete = async (id) => {
    setMessage('');
    await api.delete(`/staff/${id}`);
    await loadStaff();
    setMessage('Staff member deleted.');
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <TopBar user={user} onLogout={handleLogout} />
      <main className="px-6 pb-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="card p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-display text-3xl text-slate-800">St. Luke HR Management</h1>
                <p className="text-sm text-slate-500">
                  Manage staff records, roles, and recruitment data in one place.
                </p>
              </div>
              <div className="badge">Session-based login active</div>
            </div>
          </section>

          {message && (
            <div className="card border-l-4 border-emerald-500 p-4 text-sm text-emerald-800">
              {message}
            </div>
          )}

          <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <StaffForm
              departments={departments}
              posts={posts}
              editing={editing}
              onCancel={() => setEditing(null)}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
            />
            <Filters
              departments={departments}
              posts={posts}
              filters={filters}
              onChange={setFilters}
            />
          </section>

          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-slate-800">Staff Directory</h2>
              <span className="text-sm text-slate-500">{staff.length} records</span>
            </div>
            <StaffTable
              staff={staff}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>
    </div>
  );
}