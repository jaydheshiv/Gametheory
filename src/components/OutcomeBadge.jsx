import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

const OutcomeBadge = ({ type, text }) => {
  const configs = {
    success: {
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: <Shield size={14} />,
    },
    risk: {
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      icon: <AlertTriangle size={14} />,
    },
    efficiency: {
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      icon: <Zap size={14} />,
    },
    event: {
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      icon: <TrendingUp size={14} />,
    }
  };

  const config = configs[type] || configs.success;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-tight uppercase ${config.color}`}
    >
      {config.icon}
      {text}
    </motion.div>
  );
};

export default OutcomeBadge;
