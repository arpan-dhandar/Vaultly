import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, PlusCircle, Wallet, ChevronDown, LogOut, User } from 'lucide-react';
import api from '../api/axiosConfig';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Food' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) { console.error("Fetch failed", err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    try {
      await api.post("/expenses", { ...form, amount: parseFloat(form.amount) });
      setForm({ description: '', amount: '', category: 'Food' });
      fetchExpenses();
    } catch (err) { console.error("Add failed", err); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (err) { console.error("Delete failed", err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  const total = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8 text-slate-200 relative">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
              <Wallet className="text-indigo-500" size={32} />
              Expense<span className="text-indigo-500">Vault</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium">Synced with {user?.email}</p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/50 border border-white/5 px-6 py-3 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">Balance</span>
              <div className="text-2xl font-black text-white">₹{total.toLocaleString('en-IN')}</div>
            </div>
            <button onClick={handleLogout} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:text-rose-500 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <motion.form 
          onSubmit={handleAdd} 
          className="bg-slate-900/30 p-2 rounded-2xl mb-12 grid grid-cols-1 md:grid-cols-4 gap-2 border border-white/5 backdrop-blur-sm"
        >
          <input 
            type="text" placeholder="Description" 
            className="bg-black/40 text-white p-4 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500/50"
            value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
          />
          <input 
            type="number" placeholder="Amount" 
            className="bg-black/40 text-white p-4 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500/50"
            value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})}
          />
          <div className="relative">
            <select 
              className="bg-black/40 text-slate-300 p-4 rounded-xl w-full appearance-none outline-none"
              value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
            >
              <option>Food</option><option>Rent</option><option>Travel</option><option>Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-4 text-slate-600" size={16} />
          </div>
          <button type="submit" className="bg-white text-black font-black p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 shadow-lg">
            <PlusCircle size={18}/> Add
          </button>
        </motion.form>

        <div className="bg-slate-900/20 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">Expense</th>
                <th className="p-6 text-slate-500 text-[10px] font-black uppercase tracking-widest text-right">Amount</th>
                <th className="p-6 text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='popLayout'>
                {expenses.map((expense) => (
                  <motion.tr 
                    key={expense.id} layout
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-white/5 transition-colors border-b border-white/5"
                  >
                    <td className="p-6">
                      <div className="font-semibold text-slate-200">{expense.description}</div>
                      <div className="text-[10px] text-indigo-400 font-bold uppercase">{expense.category}</div>
                    </td>
                    <td className="p-6 text-right text-white font-black font-mono">₹{Number(expense.amount).toLocaleString('en-IN')}</td>
                    <td className="p-6 text-center">
                      <button onClick={() => handleDelete(expense.id)} className="text-slate-600 hover:text-rose-500 transition-all">
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;