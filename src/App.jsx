import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_SUPPLIERS, calculateRoundOutcome, updateSupplierAI } from './logic/GameEngine';
import SupplierCard from './components/SupplierCard';
import ActionPanel from './components/ActionPanel';
import StatCard from './components/StatCard';
import ResultModal from './components/ResultModal';
import Dashboard from './components/Dashboard';
import TutorialPanel from './components/TutorialPanel';
import StrategyLab from './components/StrategyLab';
import { Activity, Shield, TrendingUp, Wallet, Package, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';
import { useLenisSmoothScroll } from './animations/useLenis';
import CursorFollower from './animations/CursorFollower';
import Magnetic from './animations/Magnetic';
import IntroOverlay from './animations/IntroOverlay';
import GsapReveal from './animations/GsapReveal';
import Tilt3D from './animations/Tilt3D';
import { useScrollMotionBridge } from './animations/useScrollMotion';
import HeroSection from './components/HeroSection';

const MAX_ROUNDS = 5;
const INITIAL_HEALTH = 100;

function App() {
  const lenisRef = useLenisSmoothScroll({ enabled: true });
  useScrollMotionBridge({ lenisRef, enabled: true });

  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const suppliersRef = useRef(null);
  const actionPanelRef = useRef(null);
  const dashboardRef = useRef(null);

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
  const [tutorialStep, setTutorialStep] = useState(0);
  const [highlightSection, setHighlightSection] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);

  const tutorialSteps = useMemo(() => (
    [
      {
        id: 'intro',
        title: 'Quick Start',
        body: 'This simulation runs in 5 rounds. Each round, review suppliers, optionally run EV analysis, then deploy a strategy.',
        target: 'header',
      },
      {
        id: 'stats',
        title: 'Read Your KPIs',
        body: 'These tiles show Equity Value, Brand Health, and your current cycle. Keep Health high to avoid early failure.',
        target: 'stats',
      },
      {
        id: 'suppliers',
        title: 'Compare Suppliers',
        body: 'Supplier A is usually more reliable; Supplier B is usually cheaper. Reputation and reliability can change over time.',
        target: 'suppliers',
      },
      {
        id: 'ev',
        title: 'Run EV Analysis (Optional)',
        body: 'Turn on the scanner to see expected profit and worst-case risk before you commit to a strategy.',
        target: 'action',
        action: 'enableScanner',
      },
      {
        id: 'choose',
        title: 'Deploy Strategy',
        body: 'Pick a strategy card. You’ll get a round report showing profit, costs, and stability outcomes.',
        target: 'action',
      },
      {
        id: 'dashboard',
        title: 'Track the Trend',
        body: 'After the first round, your dashboard shows performance trends and the game-theory matrix to support decisions.',
        target: 'dashboard',
      },
    ]
  ), []);

  useEffect(() => {
    localStorage.setItem('supply_chain_game_revamp_state', JSON.stringify(gameState));
  }, [gameState]);

  const focusTarget = (target) => {
    const map = {
      header: headerRef,
      stats: statsRef,
      suppliers: suppliersRef,
      action: actionPanelRef,
      dashboard: dashboardRef,
    };

    const ref = map[target];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightSection(target);
      window.clearTimeout(focusTarget._t);
      focusTarget._t = window.setTimeout(() => setHighlightSection(null), 1600);
    }
  };

  const openTutorial = (startAt = 0) => {
    setTutorialStep(startAt);
    setShowTutorial(true);
    const step = tutorialSteps[startAt];
    if (step?.target) focusTarget(step.target);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setGameState(prev => ({ ...prev, hasSeenTutorial: true }));
    setHighlightSection(null);
  };

  const goToTutorialStep = (next) => {
    const bounded = Math.max(0, Math.min(tutorialSteps.length - 1, next));
    setTutorialStep(bounded);
    const step = tutorialSteps[bounded];
    if (step?.action === 'enableScanner') setScannerActive(true);
    if (step?.target) focusTarget(step.target);
  };

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
    closeTutorial();
  };

  const progressPercent = ((gameState.round - 1) / MAX_ROUNDS) * 100;

  return (
    <div className="min-h-screen">
      <IntroOverlay />
      <CursorFollower />
      <TutorialPanel
        isOpen={showTutorial}
        onClose={markTutorialSeen}
        steps={tutorialSteps}
        stepIndex={tutorialStep}
        onNext={() => goToTutorialStep(tutorialStep + 1)}
        onPrev={() => goToTutorialStep(tutorialStep - 1)}
        onJump={(idx) => goToTutorialStep(idx)}
      />

      <GsapReveal className={`mb-10 ${highlightSection === 'header' ? 'guided-highlight' : ''}`}>
        <div ref={headerRef}>
          <HeroSection
            rightSlot={
              <div className="flex flex-col gap-2 items-end">
                <Magnetic as="div">
                  <button onClick={() => openTutorial(0)} className="btn-secondary flex items-center gap-2 px-4 py-2" data-cursor>
                    <HelpCircle size={18} /> Guide
                  </button>
                </Magnetic>
                <Magnetic as="div">
                  <button onClick={() => openTutorial(0)} className="btn-primary flex items-center gap-2 px-4 py-2" data-cursor>
                    Quick Start
                  </button>
                </Magnetic>
                <Magnetic as="div">
                  <button onClick={resetGame} className="btn-secondary flex items-center gap-2 px-4 py-2 hover:text-rose-400" data-cursor>
                    <RotateCcw size={18} /> Restart
                  </button>
                </Magnetic>
              </div>
            }
            kpiStrip={
              <div>
                <div className="flex justify-between items-end mb-2" data-reveal>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="text-indigo-500" size={20} />
                    <span className="font-bold text-slate-300">Phase Progress</span>
                  </div>
                  <span className="text-xs font-black text-slate-500 uppercase">Round {Math.min(gameState.round, MAX_ROUNDS)} of {MAX_ROUNDS}</span>
                </div>
                <div className="progress-bar-container" data-reveal>
                  <div className="progress-bar-fill" style={{ width: `${gameState.gameOver ? 100 : progressPercent}%` }}></div>
                </div>

                <div ref={statsRef} className={`mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 ${highlightSection === 'stats' ? 'guided-highlight' : ''}`}>
                  <div data-reveal>
                    <StatCard
                      title="Equity Value"
                      numericValue={gameState.totalProfit}
                      format={(n) => `₹${n.toLocaleString()}`}
                      icon={<Wallet className="text-emerald-500" />}
                      trend={gameState.history.length > 0 ? gameState.history[gameState.history.length-1].profit : 0}
                    />
                  </div>
                  <div data-reveal>
                    <StatCard
                      title="Brand Health"
                      numericValue={gameState.health}
                      format={(n) => `${n}%`}
                      icon={<Shield className={gameState.health > 40 ? "text-emerald-500" : "text-rose-500"} />}
                      progress={gameState.health}
                    />
                  </div>
                  <div data-reveal>
                    <StatCard
                      title="Market Cycle"
                      value={`0${Math.min(gameState.round, MAX_ROUNDS)} / 0${MAX_ROUNDS}`}
                      icon={<Activity className="text-indigo-500" />}
                    />
                  </div>
                  <div data-reveal>
                    <StatCard
                      title="Resilience Score"
                      value={gameState.health > 70 ? "OPTIMAL" : gameState.health > 30 ? "CAUTION" : "CRITICAL"}
                      icon={<Package className="text-amber-500" />}
                    />
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </GsapReveal>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <GsapReveal className="lg:col-span-6" start="top 85%">
          <div ref={suppliersRef} className={`${highlightSection === 'suppliers' ? 'guided-highlight' : ''}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.26em] text-white/60 mb-4" data-reveal>
              Supplier Modules
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-reveal>
                <Tilt3D className="rounded-[1.25rem]" maxTilt={10} scale={1.03}>
                  <SupplierCard supplier={gameState.suppliers.A} type="A" />
                </Tilt3D>
              </div>
              <div data-reveal>
                <Tilt3D className="rounded-[1.25rem]" maxTilt={10} scale={1.03}>
                  <SupplierCard supplier={gameState.suppliers.B} type="B" />
                </Tilt3D>
              </div>
            </div>
          </div>
        </GsapReveal>

        <GsapReveal className="lg:col-span-6" start="top 85%">
          <div ref={actionPanelRef} className={highlightSection === 'action' ? 'guided-highlight' : ''}>
            <ActionPanel
              onSelect={handleAction}
              disabled={gameState.gameOver}
              currentSuppliers={gameState.suppliers}
              scannerActive={scannerActive}
              onToggleScanner={setScannerActive}
            />
          </div>
        </GsapReveal>

        <GsapReveal className="lg:col-span-12" start="top 85%">
          <div ref={dashboardRef} className={`min-h-[500px] ${highlightSection === 'dashboard' ? 'guided-highlight' : ''}`}>
            <Dashboard
              history={gameState.history}
              isGameOver={gameState.gameOver}
              totalProfit={gameState.totalProfit}
              currentSuppliers={gameState.suppliers}
            />
          </div>
        </GsapReveal>

        <GsapReveal className="lg:col-span-12" start="top 85%">
          <StrategyLab currentSuppliers={gameState.suppliers} />
        </GsapReveal>
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
