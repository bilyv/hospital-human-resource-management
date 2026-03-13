export default function Filters({ departments, posts, filters, onChange }) {
  const handleChange = (event) => {
    onChange((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleReset = () => {
    onChange({ departmentId: '', postId: '', hireStart: '', hireEnd: '', q: '' });
  };

  return (
    <div className="card p-6 space-y-4">
      <div>
        <h2 className="font-display text-2xl text-slate-800">Filters</h2>
        <p className="text-sm text-slate-500">Find staff by department, role, or hire interval.</p>
      </div>
      <div>
        <label className="label" htmlFor="departmentId">Department</label>
        <select className="input mt-1" id="departmentId" name="departmentId" value={filters.departmentId} onChange={handleChange}>
          <option value="">All departments</option>
          {departments.map((dep) => (
            <option key={dep.DepId} value={dep.DepId}>{dep.DepName}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="postId">Role</label>
        <select className="input mt-1" id="postId" name="postId" value={filters.postId} onChange={handleChange}>
          <option value="">All roles</option>
          {posts.map((post) => (
            <option key={post.PostID} value={post.PostID}>{post.PostTitle}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="hireStart">Hire Date From</label>
        <input className="input mt-1" id="hireStart" name="hireStart" type="date" value={filters.hireStart} onChange={handleChange} />
      </div>
      <div>
        <label className="label" htmlFor="hireEnd">Hire Date To</label>
        <input className="input mt-1" id="hireEnd" name="hireEnd" type="date" value={filters.hireEnd} onChange={handleChange} />
      </div>
      <div>
        <label className="label" htmlFor="q">Search</label>
        <input className="input mt-1" id="q" name="q" placeholder="Name or email" value={filters.q} onChange={handleChange} />
      </div>
      <button className="btn btn-ghost w-full" type="button" onClick={handleReset}>
        Reset filters
      </button>
    </div>
  );
}