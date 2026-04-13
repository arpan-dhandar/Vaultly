import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, PlusCircle } from 'lucide-react';

const API_URL = "http://localhost:8080/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Food' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error("Backend connection failed.", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    // 1. Validate inputs
    if (!form.description || !form.amount) {
      alert("Please enter both description and amount");
      return;
    }

    // 2. Prepare clean data (convert amount to a real number)
    const newExpense = {
      description: form.description,
      category: form.category,
      amount: parseFloat(form.amount) 
    };

    try {
      await axios.post(API_URL, newExpense);
      // 3. Reset form and refresh list
      setForm({ description: '', amount: '', category: 'Food' });
      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  const total = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900">Expense Tracker</h1>
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl border-b-4 border-indigo-800">
            <span className="text-xs uppercase font-bold opacity-80 block">Total Balance</span>
            <div className="text-2xl font-black tracking-wide">₹{total.toLocaleString('en-IN')}</div>
          </div>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-100">
          <input 
            type="text" 
            placeholder="Description" 
            className="border-2 border-gray-100 p-2.5 rounded-xl w-full focus:border-indigo-500 focus:ring-0 outline-none transition-all"
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Amount (₹)" 
            className="border-2 border-gray-100 p-2.5 rounded-xl w-full focus:border-indigo-500 focus:ring-0 outline-none transition-all"
            value={form.amount} 
            onChange={(e) => setForm({...form, amount: e.target.value})}
          />
          <select 
            className="border-2 border-gray-100 p-2.5 rounded-xl w-full focus:border-indigo-500 outline-none cursor-pointer"
            value={form.category} 
            onChange={(e) => setForm({...form, category: e.target.value})}
          >
            <option>Food</option>
            <option>Rent</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Other</option>
          </select>
          <button type="submit" className="bg-emerald-500 text-white p-2.5 rounded-xl flex items-center justify-center font-bold hover:bg-emerald-600 transition-transform active:scale-95 shadow-md">
            <PlusCircle className="mr-2" size={20}/> Add Item
          </button>
        </form>

        {/* Table View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="p-5">Description</th>
                <th className="p-5">Category</th>
                <th className="p-5 text-right">Amount</th>
                <th className="p-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-indigo-50/50 transition-colors group">
                  <td className="p-5 font-semibold text-gray-700">{expense.description}</td>
                  <td className="p-5">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-5 text-right text-gray-900 font-bold font-mono">
                    ₹{expense.amount != null ? Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "0.00"}
                  </td>
                  <td className="p-5 text-center">
                    <button onClick={() => handleDelete(expense.id)} className="text-gray-300 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50">
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && <div className="p-16 text-center text-gray-300 italic">Your expense list is empty.</div>}
        </div>
      </div>
    </div>
  );
}

export default App;