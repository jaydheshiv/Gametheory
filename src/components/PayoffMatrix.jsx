import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getPayoffMatrix } from '../logic/GameEngine';
import { Network, Crown, AlertOctagon } from 'lucide-react';

const PayoffMatrix = ({ currentSuppliers }) => {
  const matrix = getPayoffMatrix(currentSuppliers);
  const [hovered, setHovered] = useState(null);

  // Find dominant strategy based on pure EV
  let maxEv = -Infinity;
  let dominantStrategy = null;
  matrix.forEach(m => {
    if (m.ev > maxEv) {
      maxEv = m.ev;
      dominantStrategy = m.strategy;
    }
  });

  return (
    <div className="bg-black/40 border border-slate-700/50 rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Network className="text-secondary" size={20} />
        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300">Game Theory Matrix</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Strats</th>
              <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Expected (EV)</th>
              <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Minimax Risk</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, idx) => {
              const isDominant = row.strategy === dominantStrategy;
              const isHovered = hovered === row.strategy;
              return (
                <tr
                  key={idx}
                  onMouseEnter={() => setHovered(row.strategy)}
                  onMouseLeave={() => setHovered(null)}
                  className={`border-b border-slate-800/50 transition-colors ${isDominant ? 'bg-primary/5' : 'hover:bg-white/5'} ${isHovered ? 'bg-white/5' : ''}`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2 font-bold text-slate-300">
                      {isDominant && <Crown size={14} className="text-warning" />}
                      {row.strategy}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <motion.span
                      layout
                      className={`font-mono font-bold ${isDominant ? 'text-primary' : 'text-slate-400'}`}
                      animate={isHovered ? { y: -1, scale: 1.03 } : { y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      ₹{row.ev}
                    </motion.span>
                  </td>
                  <td className="p-3 text-center">
                    <motion.span
                      layout
                      className="font-mono text-danger opacity-80 flex items-center justify-center gap-1"
                      animate={isHovered ? { y: -1, scale: 1.03 } : { y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AlertOctagon size={12} /> ₹{row.minimax}
                    </motion.span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
        <p className="text-xs text-secondary/80 leading-relaxed font-mono">
          <span className="font-bold text-secondary">NASH EQUILIBRIUM:</span> Based on stochastic supplier reliability, <strong className="text-white">{dominantStrategy}</strong> represents the dominant baseline strategy maximizing utility.
        </p>
      </div>
    </div>
  );
};

export default PayoffMatrix;
