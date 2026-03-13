export default function TopBar({ user, onLogout }) {
  return (
    <header className="px-6 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-teal/10 text-teal flex items-center justify-center font-display text-lg">
            SL
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Hospital HR</p>
            <p className="text-sm font-semibold text-slate-700">Welcome, {user.username}</p>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}