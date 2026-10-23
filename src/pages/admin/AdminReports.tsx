import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export default function AdminReports() {
  const data = [
    { name: 'Birthday Cakes', value: 4000 },
    { name: 'Custom Cakes', value: 3000 },
    { name: 'Chocolates', value: 2000 },
    { name: 'Cookies', value: 2780 },
    { name: 'Gift Hampers', value: 1890 },
  ];

  const COLORS = ['#D97706', '#0284C7', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Financial Reports & Profit/Loss</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Sales by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
