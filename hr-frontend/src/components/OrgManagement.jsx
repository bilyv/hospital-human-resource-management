import { useState } from 'react';

export default function OrgManagement({ departments, onAddDepartment, onAddPost }) {
  const [depName, setDepName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedDepId, setSelectedDepId] = useState('');

  const handleDepSubmit = (e) => {
    e.preventDefault();
    if (!depName.trim()) return;
    onAddDepartment(depName.trim());
    setDepName('');
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !selectedDepId) return;
    onAddPost(postTitle.trim(), selectedDepId);
    setPostTitle('');
  };

  const noDepartments = departments.length === 0;
  const noDepSelected = !selectedDepId;

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      {/* Department Section */}
      <div className="card p-6 space-y-4">
        <div>
          <h2 className="font-display text-2xl text-slate-800">Departments</h2>
          <p className="text-sm text-slate-500">Add the organisational departments first. Posts can only be created inside a department.</p>
        </div>

        <form onSubmit={handleDepSubmit} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. Administration, Nursing…"
            value={depName}
            onChange={(e) => setDepName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!depName.trim()}>Add</button>
        </form>

        {noDepartments ? (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ⚠ No departments yet. Add one above before creating posts or staff.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {departments.map((d) => (
              <span key={d.DepId} className="badge bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                {d.DepName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Section */}
      <div className="card p-6 space-y-4">
        <div>
          <h2 className="font-display text-2xl text-slate-800">Posts</h2>
          <p className="text-sm text-slate-500">
            Select a department first, then add a post. Staff can only be assigned to an existing post.
          </p>
        </div>

        {noDepartments ? (
          <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            ℹ You must create at least one department before adding posts.
          </p>
        ) : (
          <form onSubmit={handlePostSubmit} className="space-y-3">
            <div>
              <label className="label mb-1 block">1. Select Department</label>
              <select
                className="input"
                value={selectedDepId}
                onChange={(e) => setSelectedDepId(e.target.value)}
              >
                <option value="">— Choose a department —</option>
                {departments.map((d) => (
                  <option key={d.DepId} value={d.DepId}>{d.DepName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label mb-1 block">2. Post Title</label>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder={noDepSelected ? 'Select a department first' : 'e.g. Head Nurse, Lab Tech…'}
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  disabled={noDepSelected}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={noDepSelected || !postTitle.trim()}
                >
                  Add Post
                </button>
              </div>
              {noDepSelected && (
                <p className="text-xs text-amber-600 mt-1">⚠ Select a department above to enable this field.</p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

