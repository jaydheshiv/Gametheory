import React from 'react';

const StatCard = ({ title, value, icon, trend, progress }) => {
  return (
    <div className="glass-pane p-5 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800/80 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend !== undefined && trend !== 0 && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {trend > 0 ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className={`h-full transition-all duration-1000 ${progress > 50 ? 'bg-emerald-500' : progress > 20 ? 'bg-amber-500' : 'bg-rose-500'}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
