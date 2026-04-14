import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  PlusCircle, 
  Wallet, 
  ChevronDown, 
  LogOut, 
  PieChart, 
  Activity, 
  IndianRupee 
} from 'lucide-react';
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
  
  const availableCategories = ['Food', 'Travel', 'Rent', 'Shopping', 'Other'];
  const activeCategories = [...new Set(expenses.map(e => e.category))];

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-12 text-slate-200 selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Wallet className="text-white" size={28} />
              </div>
              ExpenseVault
            </h1>
            <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
              <Activity size={14} className="text-indigo-500 animate-pulse" />
              Vault active for {user?.name || 'User'}
            </p>
          </motion.div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-[#0f0f0f] border border-white/5 px-8 py-3 rounded-2xl flex flex-col items-end flex-grow md:flex-grow-0 shadow-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Total Outflow</span>
              <span className="text-2xl font-black text-white tracking-tight flex items-center gap-1">
                <IndianRupee size={20} className="text-indigo-400" />
                {total.toLocaleString('en-IN')}
              </span>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-4 bg-[#0f0f0f] border border-white/5 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 transition-all shadow-xl group"
            >
              <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.form 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              onSubmit={handleAdd} 
              className="bg-[#0f0f0f] p-3 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col md:flex-row gap-3"
            >
              <input 
                className="flex-[2] bg-black/40 text-white p-4 rounded-2xl outline-none border border-transparent focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                placeholder="Description" 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
              <input 
                type="number" 
                className="flex-1 bg-black/40 text-white p-4 rounded-2xl outline-none border border-transparent focus:border-indigo-500/50 transition-all"
                placeholder="Amount" 
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
              />
              <div className="relative flex-1 group">
                <select 
                  className="w-full bg-black/40 text-slate-300 p-4 rounded-2xl outline-none appearance-none cursor-pointer border border-transparent focus:border-indigo-500/50 transition-all"
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  {availableCategories.map(cat => (
                    <option key={cat} className="bg-[#111] text-white" value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-indigo-400 pointer-events-none transition-colors" size={16} />
              </div>
              <button className="bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg">
                <PlusCircle size={18} /> Add
              </button>
            </motion.form>

            <div className="bg-[#0f0f0f] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="p-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">Transaction</th>
                    <th className="p-6 text-slate-500 text-[10px] font-black uppercase tracking-widest text-right">Amount</th>
                    <th className="p-6 text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode='popLayout'>
                    {expenses.map((exp, index) => (
                      <motion.tr 
                        key={exp.id} 
                        layout 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: index * 0.05 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-white/[0.01] transition-all group"
                      >
                        <td className="p-6">
                          <div className="font-bold text-white tracking-tight">{exp.description}</div>
                          <div className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter mt-1">
                            <span className="bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">
                              {exp.category}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 text-right text-white font-black font-mono text-lg tracking-tight">
                          ₹{Number(exp.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-6 text-center">
                          <button 
                            onClick={() => handleDelete(exp.id)} 
                            className="text-slate-700 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-500/10 active:scale-90"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {expenses.length === 0 && (
                <div className="p-24 text-center">
                   <div className="text-slate-700 text-sm font-medium italic">Your vault is empty.</div>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-10" />
              
              <div className="flex items-center gap-3 mb-8">
                <PieChart size={20} className="text-indigo-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">Category Split</h3>
              </div>
              
              <div className="space-y-6">
                {activeCategories.length > 0 ? activeCategories.map(cat => {
                  const catTotal = expenses.filter(e => e.category === cat).reduce((a, b) => a + (Number(b.amount) || 0), 0);
                  const percentage = ((catTotal / total) * 100).toFixed(0);
                  return (
                    <div key={cat} className="space-y-3">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                        <span>{cat}</span>
                        <span className="text-white">₹{catTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400" 
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-slate-600 text-xs text-center py-4 italic">No data yet.</p>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;