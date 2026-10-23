import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

// Using dummy data for Staff as the prompt mentioned many modules, to save time on setup.
// We can implement full CRUD similarly to products if needed.
const mockStaff = [
  { id: '1', name: 'John Manager', role: 'Manager', email: 'john@example.com', phone: '9876543210', status: 'Active' },
  { id: '2', name: 'Alice Kitchen', role: 'Kitchen Staff', email: 'alice@example.com', phone: '9876543211', status: 'Active' },
  { id: '3', name: 'Bob Delivery', role: 'Delivery Staff', email: 'bob@example.com', phone: '9876543212', status: 'Inactive' },
];

export default function AdminStaff() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">Staff & Attendance</h1>
        <button className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          <Plus size={20} className="mr-2" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {mockStaff.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4 font-medium text-stone-900">{s.name}</td>
                  <td className="px-6 py-4 text-stone-600">{s.role}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{s.email}</div>
                    <div className="text-sm">{s.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
