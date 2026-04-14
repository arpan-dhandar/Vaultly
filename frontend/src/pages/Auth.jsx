import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api/axiosConfig';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, formData);
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-slate-200 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">
            {isLogin ? 'ExpenseVault' : 'Join the Vault'}
          </h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && <p className="text-rose-500 text-xs text-center font-medium bg-rose-500/10 py-2 rounded-lg">{error}</p>}
          
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <button disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mt-4 shadow-xl active:scale-95">
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-sm text-slate-500 hover:text-white transition-colors"
        >
          {isLogin ? "Need an account? Create one" : "Already registered? Log in"}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;