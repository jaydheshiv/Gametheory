import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Package, ShieldCheck, Zap, ArrowRight, X } from 'lucide-react';

const TutorialPanel = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 text-white"
        >
          <motion.div 
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            className="glass-pane max-w-2xl w-full p-10 relative border-emerald-500/20"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <X />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <BookOpen className="text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold">How to Play</h2>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-400 border border-slate-700">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Select Your Strategy</h3>
                  <p className="text-slate-400">Choose between Suppliers A (Reliable) and B (Economical). Higher cost usually means lower risk of disruption.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-400 border border-slate-700">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Manage Disruptions</h3>
                  <p className="text-slate-400">Every 5 rounds matter. Random events like strikes or pandemics can cripple high-risk strategies. Diversify to stay safe.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-400 border border-slate-700">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Supplier AI Behavior</h3>
                  <p className="text-slate-400 italic">Hidden Mechanic: Suppliers react to you! If you always squeeze for the lowest price, reliability will drop. Loyalty builds stronger links.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-slate-900"><ShieldCheck size={20} /></div>
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center border-4 border-slate-900"><Zap size={20} /></div>
                  </div>
                  <div>
                    <h4 className="font-bold">Victory Condition</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Survive 5 rounds with maximum profit</p>
                  </div>
                </div>
                <button onClick={onClose} className="btn-primary flex items-center gap-2">
                  Got it! <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialPanel;
