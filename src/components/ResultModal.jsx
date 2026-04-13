import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, DollarSign, Brain, ArrowRight } from 'lucide-react';
import OutcomeBadge from './OutcomeBadge';

const ResultModal = ({ result, onClose, isGameOver }) => {
  const { strategy, event, results, profit, totalCost, totalLoss, revenue, insight } = result;
  
  const hasFailure = results.some(r => r.failed);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[80] p-4 sm:p-6">
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="glass-pane max-w-2xl w-full p-8 sm:p-10 border-slate-700/50 shadow-2xl relative overflow-hidden"
      >
        {/* Visual Glow Background */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[120px] rounded-full opacity-20 ${profit > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div className="flex gap-2 mb-3">
              {profit > 120 && <OutcomeBadge type="success" text="High Efficiency" />}
              {event && <OutcomeBadge type="event" text="Market Event" />}
              {totalLoss > 0 && <OutcomeBadge type="risk" text="Supply Disruption" />}
            </div>
            <h2 className="text-4xl font-bold flex items-center gap-3">
              {profit > 0 ? (
                <CheckCircle2 className="text-emerald-500" size={36} />
              ) : (
                <XCircle className="text-rose-500" size={36} />
              )}
              {profit > 140 ? 'Exceptional Margins' : profit > 0 ? 'Round Secured' : 'Operational Crisis'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <XCircle size={28} className="text-slate-500" />
          </button>
        </div>

        {/* Strategic Insight Selection */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl mb-8 flex items-start gap-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Brain className="text-indigo-400" size={24} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">Strategic Insight</h4>
            <p className="text-slate-200 text-lg leading-snug font-medium italic">"{insight}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
            <div className="flex justify-between text-slate-500 text-sm mb-2 font-semibold">
              <span>Gross Revenue</span>
              <span className="text-emerald-400">₹{revenue}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm mb-4 font-semibold">
              <span>Operating Costs</span>
              <span className="text-rose-400">- ₹{totalCost}</span>
            </div>
            <div className="h-px bg-slate-800 mb-4" />
            <div className="flex justify-between items-end">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">Net Round Profit</span>
              <span className={`text-3xl font-black ${profit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{profit}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-center">
             <h4 className="text-xs uppercase text-slate-500 font-bold mb-3 tracking-widest">Risk Analysis</h4>
             <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl">
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${r.failed ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {r.failed ? 'FAILURE' : 'STABLE'}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {isGameOver ? 'Finalize Business Report' : 'Proceed to Next Round'}
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
};

export default ResultModal;
