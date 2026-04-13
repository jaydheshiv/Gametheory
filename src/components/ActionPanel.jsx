import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, Shuffle, Zap, Target, ScanSearch, AlertTriangle } from 'lucide-react';
import { analyzeStrategy } from '../logic/GameEngine';
import AnimatedCounter from './AnimatedCounter';

const MetricTile = ({ tone, label, value, icon }) => {
  const toneStyles =
    tone === 'profit'
      ? {
          tile: 'border-primary/35 shadow-[0_0_0_1px_rgba(0,255,102,0.12),0_18px_55px_rgba(0,255,102,0.06)]',
          label: 'text-white/85',
          value: 'text-primary',
        }
      : {
          tile: 'border-danger/35 shadow-[0_0_0_1px_rgba(255,0,60,0.10),0_18px_55px_rgba(255,0,60,0.05)]',
          label: 'text-white/85',
          value: 'text-danger',
        };

  return (
    <div
      className={`box-border w-[120px] h-[100px] rounded-xl bg-black/80 border backdrop-blur-md transition-all duration-300 ${toneStyles.tile}`}
    >
      <div className="h-full w-full flex flex-col items-center justify-center text-center px-4">
        <div className={`text-[11px] font-black uppercase tracking-[0.22em] drop-shadow ${toneStyles.label}`}>
          {label}
        </div>
        <motion.div
          key={`${label}-${String(value)}`}
          initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-2 flex items-center justify-center gap-2 font-mono tabular-nums text-[18px] font-black leading-none drop-shadow ${toneStyles.value}`}
        >
          {icon}
          <AnimatedCounter
            value={typeof value === 'number' ? value : Number(value)}
            format={(n) => `₹${n}`}
            duration={0.75}
            className="inline-block min-w-[6ch] text-center leading-none"
          />
        </motion.div>
      </div>
    </div>
  );
};

const ActionPanel = ({ onSelect, disabled, currentSuppliers, scannerActive: scannerActiveProp, onToggleScanner }) => {
  const [scannerActiveInternal, setScannerActiveInternal] = useState(false);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const scannerActive = useMemo(
    () => (typeof scannerActiveProp === 'boolean' ? scannerActiveProp : scannerActiveInternal),
    [scannerActiveProp, scannerActiveInternal]
  );

  const setScannerActive = (next) => {
    if (typeof onToggleScanner === 'function') {
      onToggleScanner(next);
      return;
    }
    setScannerActiveInternal(next);
  };

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

  const previewActionId = hoveredAction || selectedAction;
  const preview = useMemo(() => {
    if (!previewActionId) return null;
    return analyzeStrategy(previewActionId, currentSuppliers);
  }, [currentSuppliers, previewActionId]);

  return (
    <div className="glass-pane p-6 sm:p-8 border-slate-700/40 shadow-inner">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-2xl font-black flex items-center gap-3">
          <Target className="text-primary" size={28} /> Deploy Strategy
        </h3>
        
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {preview && (
              <motion.div
                key={previewActionId}
                initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
                transition={{ duration: 0.25 }}
                className="hidden lg:flex items-center gap-3 rounded-2xl border border-white/20 bg-black/70 px-4 py-3 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/85 drop-shadow">
                  Impact Preview
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-primary/90 drop-shadow">EV</span>
                  <span className="font-mono text-[15px] font-black text-primary drop-shadow">₹{preview.expectedProfit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-danger/90 drop-shadow">Worst</span>
                  <span className="font-mono text-[15px] font-black text-danger drop-shadow">₹{preview.worstCaseProfit}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setScannerActive(!scannerActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest transition-all duration-300 ${scannerActive ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_var(--primary-glow)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            <ScanSearch size={16} className={scannerActive ? "animate-pulse" : ""} />
            {scannerActive ? 'Scanner Active' : 'Run EV Analysis'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {actions.map((action) => {
          const analysis = scannerActive ? analyzeStrategy(action.id, currentSuppliers) : null;
          const isSelected = selectedAction === action.id;
          
          return (
            <motion.button
              key={action.id}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => {
                setSelectedAction(action.id);
                onSelect(action.id);
              }}
              disabled={disabled}
              className={`relative flex flex-col justify-between p-6 rounded-2xl border-2 bg-black/35 text-left transition-all duration-300 h-[260px] ${action.color} ${action.glow} ${isSelected ? 'ring-2 ring-primary/40 shadow-[0_0_45px_rgba(0,255,102,0.10)]' : ''} disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed group overflow-visible`}
            >
              {scannerActive && (
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDIgMkw0IDBMWTIgMloiIGZpbGw9IiMwMGZmNjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 mix-blend-screen pointer-events-none"></div>
              )}
              
              <div className="flex items-start gap-4 w-full z-10">
                <div className="p-4 bg-black rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-[#111]">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-lg mb-1 group-hover:text-white transition-colors truncate">
                    {action.name}
                  </h4>
                  <div className="h-[42px] overflow-hidden">
                    <p className="text-xs text-slate-500 font-medium group-hover:text-slate-400 transition-colors leading-relaxed mt-1">
                      {action.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Absolute metrics row (MANDATORY): identical position across all cards */}
              <div
                className={`absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 items-center justify-center transition-all duration-300 z-10 ${
                  scannerActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <MetricTile tone="profit" label="Expected Profit" value={analysis?.expectedProfit ?? 0} />
                <MetricTile tone="risk" label="Max Risk (Worst)" value={analysis?.worstCaseProfit ?? 0} icon={<AlertTriangle size={12} />} />
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

