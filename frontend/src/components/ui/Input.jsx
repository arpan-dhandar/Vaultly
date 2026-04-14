import React from 'react';

export const Input = ({ icon: Icon, ...props }) => (
  <div className="relative group w-full">
    {Icon && (
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
    )}
    <input
      {...props}
      className={`w-full bg-black/40 border border-white/5 rounded-2xl py-4 ${Icon ? 'pl-12' : 'px-6'} pr-4 text-white outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 font-medium`}
    />
  </div>
);