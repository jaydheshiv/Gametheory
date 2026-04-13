import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, Shuffle, Zap, Target, ScanSearch, AlertTriangle } from 'lucide-react';
import { analyzeStrategy } from '../logic/GameEngine';

const ActionPanel = ({ onSelect, disabled, currentSuppliers }) => {
  const [scannerActive, setScannerActive] = useState(false);

  const actions = [
    { 
      id: 'A', 
      name: 'Tier 1 Partnership', 
      desc: 'Focus on reliability and long-term stability.', 
      icon: <User className="text-secondary" />,
      color: 'hover:border-secondary/50 hover:bg-secondary/5 border-slate-800',
      glow: 'group-hover:shadow-[0_0_20px_var(--secondary-glow)]'
    },
    { 
      id: 'B', 
      name: 'Economy Protocol', 
      desc: 'Prioritize margins. Beware of potential failures.', 
      icon: <User className="text-warning" />,
      color: 'hover:border-warning/50 hover:bg-warning/5 border-slate-800',
      glow: 'group-hover:shadow-[0_0_20px_rgba(255,170,0,0.2)]'
    },
    { 
      id: 'DIVERSIFY', 
      name: 'Hedge Diversification', 
      desc: 'Distribute volume (50/50) to mitigate risk.', 
      icon: <Shuffle className="text-primary" />,
      color: 'hover:border-primary/50 hover:bg-primary/5 border-slate-800',
      glow: 'group-hover:shadow-[0_0_20px_var(--primary-glow)]'
    },
    { 
      id: 'CHEAPEST', 
      name: 'Lean Cost Optimization', 
      desc: 'Automated toggle to the lowest unit cost.', 
      icon: <Zap className="text-danger" />,
      color: 'hover:border-danger/50 hover:bg-danger/5 border-slate-800',
      glow: 'group-hover:shadow-[0_0_20px_rgba(255,0,60,0.2)]'
    },
  ];

  return (
    <div className="glass-pane p-10 border-slate-700/40 shadow-inner">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-2xl font-black flex items-center gap-3">
          <Target className="text-primary" size={28} /> Deploy Strategy
        </h3>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setScannerActive(!scannerActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest transition-all duration-300 ${scannerActive ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_var(--primary-glow)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            <ScanSearch size={16} className={scannerActive ? "animate-pulse" : ""} />
            {scannerActive ? 'Scanner Active' : 'Run EV Analysis'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => {
          const analysis = scannerActive ? analyzeStrategy(action.id, currentSuppliers) : null;
          
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(action.id)}
              disabled={disabled}
              className={`flex flex-col p-6 rounded-2xl border-2 bg-[#050505]/60 text-left transition-all duration-300 ${action.color} ${action.glow} disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed group relative overflow-hidden`}
            >
              {scannerActive && (
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDIgMkw0IDBMWTIgMloiIGZpbGw9IiMwMGZmNjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 mix-blend-screen pointer-events-none"></div>
              )}
              
              <div className="flex items-start gap-4 w-full z-10">
                <div className="p-4 bg-black rounded-xl group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-[#111]">
                  {action.icon}
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-lg mb-1 group-hover:text-white transition-colors">{action.name}</h4>
                  
                  <AnimatePresence mode="wait">
                    {!scannerActive ? (
                      <motion.p 
                        key="desc"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-xs text-slate-500 font-medium group-hover:text-slate-400 transition-colors leading-relaxed mt-1"
                      >
                        {action.desc}
                      </motion.p>
                    ) : (
                      <motion.div 
                        key="stats"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-3 grid grid-cols-2 gap-2"
                      >
                        <div className="bg-black/50 border border-primary/20 rounded p-2">
                          <span className="block text-[8px] uppercase tracking-widest text-primary/60 mb-1">Expected Profit</span>
                          <span className="text-sm font-bold text-primary">₹{analysis.expectedProfit}</span>
                        </div>
                        <div className="bg-black/50 border border-danger/20 rounded p-2">
                          <span className="block text-[8px] uppercase tracking-widest text-danger/60 mb-1">Max Risk (Worst)</span>
                          <span className="text-sm font-bold flex items-center gap-1 text-danger">
                            <AlertTriangle size={10} /> ₹{analysis.worstCaseProfit}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
      
      {disabled && (
        <div className="mt-6 p-4 bg-danger/5 border border-danger/20 rounded-2xl text-center">
          <p className="text-xs font-bold text-danger/60 uppercase tracking-widest">Simulation sequence suspended</p>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;

