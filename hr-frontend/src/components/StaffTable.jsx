export default function StaffTable({ staff, onEdit, onDelete }) {
  return (
    <div className="mt-6 overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-widest text-slate-400">
          <tr>
            <th className="pb-3">Name</th>
            <th className="pb-3">Department</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Hire Date</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {staff.map((item) => (
            <tr key={item.EmployeeID} className="text-slate-700">
              <td className="py-3">
                <div className="font-semibold">{item.FirstName} {item.LastName}</div>
                <div className="text-xs text-slate-400">{item.Email || 'No email'}</div>
              </td>
              <td className="py-3">{item.DepName || 'Unassigned'}</td>
              <td className="py-3">{item.PostTitle || 'Unassigned'}</td>
              <td className="py-3">{item.HireDate ? item.HireDate.slice(0, 10) : '—'}</td>
              <td className="py-3">{item.Status || 'Active'}</td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button className="btn btn-ghost" onClick={() => onEdit(item)}>Edit</button>
                  <button className="btn btn-ghost text-rose-600" onClick={() => onDelete(item.EmployeeID)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {staff.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-400">No staff records match these filters.</p>
      )}
    </div>
  );
}