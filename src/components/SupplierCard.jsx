import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShieldCheck, DollarSign, Award, ArrowUpRight, AlertCircle } from 'lucide-react';

const SupplierCard = ({ supplier, type }) => {
  const isPremium = type === 'A';
  const reliabilityPct = Math.round(supplier.reliability * 100);
  const reputationPct = Math.round(supplier.reputation * 100);
  const risky = supplier.reliability < 0.55;
  
  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01, borderColor: isPremium ? 'rgba(99, 102, 241, 0.45)' : 'rgba(245, 158, 11, 0.45)' }}
      className={`glass-pane p-8 relative overflow-hidden group border-2 ${isPremium ? 'border-indigo-500/10' : 'border-amber-500/10'}`}
    >
      {/* Background Accent Decorative */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 blur-3xl rounded-full opacity-10 transition-opacity group-hover:opacity-30 ${isPremium ? 'bg-indigo-500' : 'bg-amber-500'}`} />
      {risky && (
        <div className="absolute -left-12 -bottom-10 h-44 w-44 rounded-full blur-3xl bg-rose-500/20 risk-pulse" />
      )}

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${isPremium ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Package size={20} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPremium ? 'text-indigo-400' : 'text-amber-400'}`}>
              {isPremium ? 'Tier 1 Strategic' : 'Operational Efficiency'}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white">{supplier.name}</h3>
        </div>
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${isPremium ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400' : 'border-amber-500/20 bg-amber-500/5 text-amber-400'}`}>
          {isPremium ? <Award /> : <ArrowUpRight />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/50 shadow-inner">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
            <DollarSign size={12} /> Unit Cost
          </div>
          <p className="text-2xl font-black text-white">₹{supplier.cost}</p>
        </div>
        
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/50 shadow-inner">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
            <ShieldCheck size={12} /> Reliability
          </div>
          <p className={`text-2xl font-black ${supplier.reliability > 0.8 ? 'text-emerald-400' : supplier.reliability > 0.6 ? 'text-amber-400' : 'text-rose-400'}`}>
            {reliabilityPct}%
          </p>
          <div className="mt-3 h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-slate-800/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${reliabilityPct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className={`${supplier.reliability > 0.8 ? 'bg-emerald-500' : supplier.reliability > 0.6 ? 'bg-amber-500' : 'bg-rose-500'} h-full`}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <div className="flex justify-between items-end text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
          <span className="flex items-center gap-1">
            <AlertCircle size={10} /> Market Reputation Index
          </span>
          <span className="text-slate-300">{reputationPct}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${reputationPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${isPremium ? 'bg-gradient-to-r from-indigo-600 to-indigo-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`} 
          />
        </div>
        {supplier.reliability < 0.5 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2">
            <AlertCircle size={14} className="text-rose-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-300">
              Supplier instability detected
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SupplierCard;
