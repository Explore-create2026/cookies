import { Plus, Search } from 'lucide-react';

export default function AdminExpenses() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">Expenses</h1>
        <button className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          <Plus size={20} className="mr-2" /> Add Expense
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden text-center py-12">
        <p className="text-stone-500 mb-2">No expenses recorded yet.</p>
        <p className="text-sm text-stone-400">Click "Add Expense" to record your first business expense.</p>
      </div>
    </div>
  );
}
