import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, PlusCircle, Wallet, ChevronDown } from 'lucide-react';

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
    if (!form.description || !form.amount) {
      alert("Please enter both description and amount");
      return;
    }

    const newExpense = {
      description: form.description,
      category: form.category,
      amount: parseFloat(form.amount) 
    };

    try {
      await axios.post(API_URL, newExpense);
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
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
              <Wallet className="text-indigo-500" size={32} />
              Expense<span className="text-indigo-500">Flux</span>
            </h1>
            <p className="text-slate-500 mt-1">Manage your digital footprint</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 tracking-widest block">Balance</span>
              <div className="text-3xl font-black text-white tracking-tight">
                ₹{total.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-800 hidden md:block"></div>
            <div className="hidden md:block text-right">
              <span className="text-xs uppercase font-bold text-emerald-500 block">Status</span>
              <span className="text-sm font-medium text-slate-400">Synced</span>
            </div>
          </div>
        </header>

        {/* Input Form Section */}
        <form onSubmit={handleAdd} className="bg-slate-900/50 p-2 rounded-2xl mb-12 grid grid-cols-1 md:grid-cols-4 gap-2 border border-slate-800 backdrop-blur-sm">
          <input 
            type="text" 
            placeholder="Description" 
            className="bg-slate-900 text-white border-none p-4 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Amount (₹)" 
            className="bg-slate-900 text-white border-none p-4 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
            value={form.amount} 
            onChange={(e) => setForm({...form, amount: e.target.value})}
          />
          
          {/* Enhanced Category Selector */}
          <div className="relative group">
            <select 
              className="bg-slate-900 text-slate-300 border-none p-4 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer appearance-none transition-all pr-10"
              value={form.category} 
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              <option>Food</option>
              <option>Rent</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500 group-hover:text-indigo-400 transition-colors">
              <ChevronDown size={18} />
            </div>
          </div>

          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl flex items-center justify-center font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            <PlusCircle className="mr-2" size={20}/> Add
          </button>
        </form>

        {/* Table View Section */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="p-6 text-slate-500 text-xs font-black uppercase tracking-widest">Description</th>
                  <th className="p-6 text-slate-500 text-xs font-black uppercase tracking-widest">Category</th>
                  <th className="p-6 text-slate-500 text-xs font-black uppercase tracking-widest text-right">Amount</th>
                  <th className="p-6 text-slate-500 text-xs font-black uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="p-6 font-medium text-slate-200">{expense.description}</td>
                    <td className="p-6">
                      <span className="bg-slate-800 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-6 text-right text-white font-bold font-mono">
                      ₹{expense.amount != null ? Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "0.00"}
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => handleDelete(expense.id)} 
                        className="text-slate-600 hover:text-rose-400 transition-all p-2 rounded-xl hover:bg-rose-400/10"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expenses.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                <Wallet className="text-slate-600" size={24} />
              </div>
              <p className="text-slate-500 font-medium italic">No expenses recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;