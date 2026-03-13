import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [values, setValues] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onLogin(values);
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="card w-full max-w-lg p-8">
      <h1 className="font-display text-3xl text-slate-800">HRMS Access</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in with your staff credentials to manage hospital staff records.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="username">Username</label>
          <input
            className="input mt-1"
            id="username"
            name="username"
            value={values.username}
            onChange={handleChange}
            placeholder="admin"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            className="input mt-1"
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}