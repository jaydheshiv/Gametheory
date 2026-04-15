import React, { useMemo, useState } from 'react';
import {
  STRATEGIES,
  analyzeStrategy,
  getPayoffMatrix,
  sweepAllFiveRoundPlans,
  buildNashAnalysis,
} from '../logic/GameEngine';

const StrategyLab = ({ currentSuppliers }) => {
  const [showSweep, setShowSweep] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const evRows = useMemo(() => {
    return STRATEGIES.map((strategy) => ({
      strategy,
      ...analyzeStrategy(strategy, currentSuppliers),
    }));
  }, [currentSuppliers]);

  const matrixRows = useMemo(() => getPayoffMatrix(currentSuppliers), [currentSuppliers]);
  const nash = useMemo(() => buildNashAnalysis(currentSuppliers), [currentSuppliers]);
  const planRows = useMemo(() => (showSweep ? sweepAllFiveRoundPlans() : []), [showSweep]);

  return (
    <div className="glass-pane p-6 sm:p-8 mt-8 border-slate-700/40 shadow-inner">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h3 className="text-2xl font-black">Strategy Lab</h3>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          EV / Matrix / Nash / 5-Round Sweep
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          type="button"
          onClick={() => setShowSweep((v) => !v)}
          className="btn-primary px-4 py-2"
        >
          {showSweep ? 'Hide 5-Round Outputs' : 'Run All 5-Round Option Outputs'}
        </button>

        <button
          type="button"
          onClick={() => setShowExplain((v) => !v)}
          className="btn-secondary px-4 py-2"
        >
          {showExplain ? 'Hide EV/Matrix/Nash Details' : 'Show How EV, Payoff Matrix, and Nash Work'}
        </button>
      </div>

      {showExplain && (
        <div className="space-y-8">
          <section>
            <h4 className="text-lg font-black mb-2">How EV Works</h4>
            <p className="text-sm text-slate-300 mb-4">
              Expected Profit = Revenue - Total Cost - Expected Loss. Expected Loss is failure probability multiplied
              by disruption penalty across selected suppliers.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-black/70">
                  <tr>
                    <th className="text-left p-3 uppercase text-[10px] tracking-widest text-slate-500">Strategy</th>
                    <th className="text-left p-3 uppercase text-[10px] tracking-widest text-slate-500">Expected Profit</th>
                    <th className="text-left p-3 uppercase text-[10px] tracking-widest text-slate-500">Worst Case</th>
                  </tr>
                </thead>
                <tbody>
                  {evRows.map((row) => (
                    <tr key={row.strategy} className="border-t border-slate-900">
                      <td className="p-3 font-bold text-slate-300">{row.strategy}</td>
                      <td className="p-3 font-mono text-primary">Rs {row.expectedProfit}</td>
                      <td className="p-3 font-mono text-danger">Rs {row.worstCaseProfit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-black mb-2">How Payoff Matrix Works</h4>
            <p className="text-sm text-slate-300 mb-4">
              Each row is a strategy with EV and minimax payoff. EV captures long-run reward, minimax captures downside.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-black/70">
                  <tr>
                    <th className="text-left p-3 uppercase text-[10px] tracking-widest text-slate-500">Strategy</th>
                    <th className="text-left p-3 uppercase text-[10px] tracking-widest text-slate-500">EV</th>
                    <th className="text-left p-3 uppercase text-[10px] tracking-widest text-slate-500">Minimax Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.map((row) => (
                    <tr key={row.strategy} className="border-t border-slate-900">
                      <td className="p-3 font-bold text-slate-300">{row.strategy}</td>
                      <td className="p-3 font-mono text-primary">Rs {row.ev}</td>
                      <td className="p-3 font-mono text-danger">Rs {row.minimax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-black mb-2">How Nash Equilibrium Is Calculated</h4>
            <p className="text-sm text-slate-300 mb-4">
              A 2-player strategic-form game is built from EV payoffs with a shared-supplier congestion penalty.
              Pure Nash equilibria are strategy pairs where each side is a best response to the other.
            </p>

            {nash.equilibria.length === 0 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
                No pure-strategy Nash equilibrium found for the current supplier state.
              </div>
            ) : (
              <div className="space-y-2">
                {nash.equilibria.map((eq, idx) => (
                  <div key={`${eq.player}-${eq.opponent}-${idx}`} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                    Equilibrium {idx + 1}: Player = {eq.player}, Opponent = {eq.opponent}, Payoffs = ({eq.payoff.p1}, {eq.payoff.p2})
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {showSweep && (
        <section className="mt-8">
          <h4 className="text-lg font-black mb-2">All 5-Round Option Outputs</h4>
          <p className="text-sm text-slate-300 mb-4">
            Exhaustive strategy sweep across 4 options for 5 rounds (4^5 = 1024 plans), averaged across deterministic seeds.
          </p>

          <div className="max-h-[430px] overflow-auto rounded-xl border border-slate-800 custom-scrollbar">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-black">
                <tr>
                  <th className="text-left p-3 uppercase tracking-widest text-[10px] text-slate-500">Plan</th>
                  <th className="text-left p-3 uppercase tracking-widest text-[10px] text-slate-500">Avg Profit</th>
                  <th className="text-left p-3 uppercase tracking-widest text-[10px] text-slate-500">Avg Health</th>
                  <th className="text-left p-3 uppercase tracking-widest text-[10px] text-slate-500">Survival</th>
                </tr>
              </thead>
              <tbody>
                {planRows.map((row) => (
                  <tr key={row.plan} className="border-t border-slate-900">
                    <td className="p-3 text-slate-300">{row.plan}</td>
                    <td className="p-3 font-mono text-primary">Rs {row.avgProfit}</td>
                    <td className="p-3 font-mono text-slate-300">{row.avgHealth}</td>
                    <td className="p-3 font-mono text-slate-300">{row.survivalRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default StrategyLab;
