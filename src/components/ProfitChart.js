import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Bot 1', profit: 5 },
  { name: 'Bot 2', profit: -2 },
  { name: 'Bot 3', profit: 3 },
  { name: 'Bot 4', profit: -4 },
];

function ProfitChart() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            label={{ value: 'Profit/Loss (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Profit/Loss']}
          />
          <ReferenceLine y={0} stroke="#000" />
          <Bar 
            dataKey="profit" 
            fill={(data) => data.profit >= 0 ? '#4CAF50' : '#F44336'}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProfitChart; 