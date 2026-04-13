import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, AlertCircle } from 'lucide-react';
import PayoffMatrix from './PayoffMatrix';

const Dashboard = ({ history, isGameOver, totalProfit, currentSuppliers }) => {
  const chartData = history.map((h, i) => ({
    round: `R${i + 1}`,
    profit: h.profit,
    cumulative: history.slice(0, i + 1).reduce((acc, curr) => acc + curr.profit, 0),
  }));

  if (history.length === 0) {
    return (
      <div className="glass-pane p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-slate-800 rounded-full mb-4">
          <BarChart2 size={48} className="text-slate-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">Awaiting Data</h3>
        <p className="text-slate-400 text-sm">Play the first round to see your analytics dashboard live.</p>
        {currentSuppliers && <div className="mt-8 w-full"><PayoffMatrix currentSuppliers={currentSuppliers} /></div>}
      </div>
    );
  }

  return (
    <div className="glass-pane p-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BarChart2 className="text-secondary" /> Performance Trend
        </h3>
        {isGameOver && (
          <span className="text-xs bg-danger/20 text-danger px-2 py-1 rounded font-bold uppercase">
            Final Stats
          </span>
        )}
      </div>

      <div className="min-h-[200px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
            <XAxis 
              dataKey="round" 
              stroke="#444" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#444" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--secondary)' }}
            />
            <Area 
              type="monotone" 
              dataKey="cumulative" 
              stroke="var(--secondary)" 
              fillOpacity={1} 
              fill="url(#colorProfit)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4 mb-8">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Recent Activity</h4>
        {history.slice(-3).reverse().map((round, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${round.profit > 0 ? 'bg-primary' : 'bg-danger'}`} />
              <div>
                <p className="text-sm font-bold">{round.strategy}</p>
                <p className="text-xs text-slate-500">Round {history.length - i}</p>
              </div>
            </div>
            <p className={`text-sm font-bold ${round.profit > 0 ? 'text-primary' : 'text-danger'}`}>
              ₹{round.profit}
            </p>
          </div>
        ))}
      </div>

      {currentSuppliers && !isGameOver && (
        <PayoffMatrix currentSuppliers={currentSuppliers} />
      )}
    </div>
  );
};

export default Dashboard;
