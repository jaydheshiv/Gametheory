import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_SUPPLIERS, calculateRoundOutcome, updateSupplierAI } from './logic/GameEngine';
import SupplierCard from './components/SupplierCard';
import ActionPanel from './components/ActionPanel';
import StatCard from './components/StatCard';
import ResultModal from './components/ResultModal';
import Dashboard from './components/Dashboard';
import TutorialPanel from './components/TutorialPanel';
import { Activity, Shield, TrendingUp, Wallet, Package, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';

const MAX_ROUNDS = 5;
const INITIAL_HEALTH = 100;

function App() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('supply_chain_game_revamp_state');
    return saved ? JSON.parse(saved) : {
      round: 1,
      health: INITIAL_HEALTH,
      totalProfit: 0,
      history: [],
      suppliers: INITIAL_SUPPLIERS,
      gameOver: false,
      hasSeenTutorial: false,
    };
  });

  const [activeResult, setActiveResult] = useState(null);
  const [showTutorial, setShowTutorial] = useState(!gameState.hasSeenTutorial);

  useEffect(() => {
    localStorage.setItem('supply_chain_game_revamp_state', JSON.stringify(gameState));
  }, [gameState]);

  const handleAction = (strategy) => {
    if (gameState.gameOver) return;

    const result = calculateRoundOutcome(strategy, gameState.suppliers, gameState.round);
    const newSuppliers = updateSupplierAI(gameState.suppliers, [...gameState.history, result]);
    
    const nextState = {
      ...gameState,
      round: gameState.round + 1,
      health: Math.min(100, Math.max(0, gameState.health + result.healthImpact)),
      totalProfit: gameState.totalProfit + result.profit,
      history: [...gameState.history, result],
      suppliers: newSuppliers,
    };

    if (nextState.round > MAX_ROUNDS || nextState.health <= 0) {
      nextState.gameOver = true;
    }

    setGameState(nextState);
    setActiveResult(result);
  };

  const resetGame = () => {
    setGameState({
      round: 1,
      health: INITIAL_HEALTH,
      totalProfit: 0,
      history: [],
      suppliers: INITIAL_SUPPLIERS,
      gameOver: false,
      hasSeenTutorial: true,
    });
    setActiveResult(null);
    localStorage.removeItem('supply_chain_game_revamp_state');
  };

  const markTutorialSeen = () => {
    setShowTutorial(false);
    setGameState(prev => ({ ...prev, hasSeenTutorial: true }));
  };

  const progressPercent = ((gameState.round - 1) / MAX_ROUNDS) * 100;

  return (
    <div className="min-h-screen">
      <TutorialPanel isOpen={showTutorial} onClose={markTutorialSeen} />
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 transition-all duration-500 hover:border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 glow-active"></div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500/80">Active Simulation v0.2</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-1">
            Logistics <span className="text-emerald-500">Command</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Supply Chain Strategy & Risk Engine</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button onClick={() => setShowTutorial(true)} className="btn-secondary flex items-center gap-2 px-4 py-2">
            <HelpCircle size={18} /> Guide
          </button>
          <button onClick={resetGame} className="btn-secondary flex items-center gap-2 px-4 py-2 hover:text-rose-400">
            <RotateCcw size={18} /> Restart
          </button>
        </div>
      </header>

      {/* Progress Section */}
      <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2">
            <ChevronRight className="text-indigo-500" size={20} />
            <span className="font-bold text-slate-300">Phase Progress</span>
          </div>
          <span className="text-xs font-black text-slate-500 uppercase">Round {Math.min(gameState.round, MAX_ROUNDS)} of {MAX_ROUNDS}</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${gameState.gameOver ? 100 : progressPercent}%` }}></div>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Stats Grid */}
        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Equity Value" 
            value={`₹${gameState.totalProfit.toLocaleString()}`} 
            icon={<Wallet className="text-emerald-500" />}
            trend={gameState.history.length > 0 ? gameState.history[gameState.history.length-1].profit : 0}
          />
          <StatCard 
            title="Brand Health" 
            value={`${gameState.health}%`} 
            icon={<Shield className={gameState.health > 40 ? "text-emerald-500" : "text-rose-500"} />}
            progress={gameState.health}
          />
          <StatCard 
            title="Market Cycle" 
            value={`0${Math.min(gameState.round, MAX_ROUNDS)} / 0${MAX_ROUNDS}`} 
            icon={<Activity className="text-indigo-500" />}
          />
          <StatCard 
            title="Resilience Score" 
            value={gameState.health > 70 ? "OPTIMAL" : gameState.health > 30 ? "CAUTION" : "CRITICAL"} 
            icon={<Package className="text-amber-500" />}
          />
        </div>

        {/* Suppliers & Action Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SupplierCard supplier={gameState.suppliers.A} type="A" />
            <SupplierCard supplier={gameState.suppliers.B} type="B" />
          </div>
          
          <ActionPanel 
            onSelect={handleAction} 
            disabled={gameState.gameOver}
            currentSuppliers={gameState.suppliers}
          />
        </div>

        {/* Dashboard/Analytics Side Panel */}
        <div className="lg:col-span-4 min-h-[500px]">
          <Dashboard 
            history={gameState.history} 
            isGameOver={gameState.gameOver} 
            totalProfit={gameState.totalProfit} 
            currentSuppliers={gameState.suppliers}
          />
        </div>
      </main>

      <AnimatePresence>
        {activeResult && (
          <ResultModal 
            result={activeResult} 
            onClose={() => setActiveResult(null)} 
            isGameOver={gameState.gameOver}
            finalStats={gameState}
          />
        )}
      </AnimatePresence>
      
      {gameState.gameOver && !activeResult && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[90] p-6"
        >
           <motion.div 
             initial={{ scale: 0.9, y: 30 }}
             animate={{ scale: 1, y: 0 }}
             className="glass-pane p-12 max-w-2xl w-full text-center border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
           >
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/40">
                <TrendingUp size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter">SIMULATION COMPLETE</h2>
              <div className="inline-block bg-slate-800 px-6 py-2 rounded-full text-slate-400 font-bold uppercase tracking-widest text-sm mb-10">
                Performance Portfolio Evaluated
              </div>
              
              <div className="text-slate-400 mb-10 text-xl">
                Final Capital Accumulation: 
                <span className="text-emerald-400 font-black ml-2 text-4xl block mt-2">₹{gameState.totalProfit.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-12 text-left">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Health Profile</h4>
                  <p className={`text-4xl font-black ${gameState.health > 40 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {gameState.health}%
                  </p>
                </div>
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Cycle Survival</h4>
                  <p className="text-4xl font-black text-indigo-400">
                    {gameState.history.length < MAX_ROUNDS && gameState.health <= 0 ? gameState.history.length : MAX_ROUNDS} <span className="text-lg opacity-50">/ {MAX_ROUNDS}</span>
                  </p>
                </div>
              </div>

              <div className="mb-12 text-left bg-indigo-500/5 p-8 rounded-3xl border border-indigo-500/10">
                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                   <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                   POST-GAME STRATEGY AUDIT (What-If)
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Relative to a **Diversification Protocol**, your decisions led to a 
                  <span className={`mx-2 font-black ${gameState.totalProfit > (MAX_ROUNDS * 120) ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.abs(Math.round(((gameState.totalProfit / (MAX_ROUNDS * 120)) - 1) * 100))}%
                  </span> 
                  {gameState.totalProfit > (MAX_ROUNDS * 120) ? 'surplus' : 'deviation'} in potential equity. 
                  <br/>
                  <span className="text-slate-500 text-sm mt-4 block">
                    Strategic Note: Your survivability index was {gameState.health > 70 ? 'Superior' : 'Sub-Optimal'}.
                  </span>
                </p>
              </div>

              <button onClick={resetGame} className="btn-primary w-full text-xl py-6 font-black tracking-widest">
                START NEW SIMULATION
              </button>
           </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
