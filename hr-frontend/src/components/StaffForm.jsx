import { useEffect, useState } from 'react';

const emptyForm = {
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  email: '',
  phone: '',
  address: '',
  postId: '',
  hireDate: '',
  salary: '',
  status: ''
};

export default function StaffForm({ departments, posts, editing, onCancel, onCreate, onUpdate }) {
  const [form, setForm] = useState(emptyForm);
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    if (editing) {
      setForm({
        firstName: editing.FirstName || '',
        lastName: editing.LastName || '',
        gender: editing.Gender || '',
        dob: editing.DOB ? editing.DOB.slice(0, 10) : '',
        email: editing.Email || '',
        phone: editing.Phone || '',
        address: editing.Address || '',
        postId: editing.PostID || '',
        hireDate: editing.HireDate ? editing.HireDate.slice(0, 10) : '',
        salary: editing.Salary || '',
        status: editing.Status || ''
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      onUpdate(editing.EmployeeID, form);
    } else {
      onCreate(form);
    }
  };

  return (
    <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-slate-800">{editing ? 'Edit Staff' : 'Add New Staff'}</h2>
          <p className="text-sm text-slate-500">Capture personal, role, and recruitment details.</p>
        </div>
        {editing && (
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="firstName">First Name</label>
          <input className="input mt-1" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="lastName">Last Name</label>
          <input className="input mt-1" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="gender">Gender</label>
          <select className="input mt-1" id="gender" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="dob">Date of Birth</label>
          <input className="input mt-1" id="dob" name="dob" type="date" value={form.dob} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="input mt-1" id="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input className="input mt-1" id="phone" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="address">Address</label>
          <input className="input mt-1" id="address" name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="postId">Post/Role</label>
          <select className="input mt-1" id="postId" name="postId" value={form.postId} onChange={handleChange}>
            <option value="">Select post</option>
            {filteredPosts.map((post) => (
              <option key={post.PostID} value={post.PostID}>
                {post.PostTitle}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="hireDate">Hire Date</label>
          <input className="input mt-1" id="hireDate" name="hireDate" type="date" value={form.hireDate} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="salary">Salary</label>
          <input className="input mt-1" id="salary" name="salary" type="number" value={form.salary} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <input className="input mt-1" id="status" name="status" value={form.status} onChange={handleChange} />
        </div>
      </div>

      <button className="btn btn-primary w-full" type="submit">
        {editing ? 'Update Staff' : 'Save Staff'}
      </button>
    </form>
  );
}