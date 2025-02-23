import React from 'react';
import { BOT_COLORS } from '../constants/colors';

function BotCard({ bot, index, isHighlighted }) {
  const { name, performance, winRate, balance, netProfit } = bot;
  const isProfit = performance >= 0;
  const botColor = BOT_COLORS[index];

  return (
    <div 
      id={`bot-${name}`}
      className={`bot-card ${isHighlighted ? 'highlighted' : ''}`} 
      style={{ 
        transition: 'all 0.3s ease',
        '--bot-color': botColor // Pass color as CSS variable
      }}
    >
      <div className="bot-header">
        <h3>
          <span style={{ color: botColor }}>●</span> {name}
        </h3>
        <span className={`performance ${isProfit ? 'profit' : 'loss'}`}>
          {isProfit ? '+' : ''}{performance}%
        </span>
      </div>
      <div className="bot-stats">
        <div className="stat-item">
          <span className="label">
            <span role="img" aria-label="chart">📊</span> Win Rate
          </span>
          <span className="value" style={{ color: botColor }}>
            {winRate}
          </span>
        </div>
        <div className="stat-item">
          <span className="label">
            <span role="img" aria-label="money">💰</span> Balance
          </span>
          <span className="value">
            ${balance.toLocaleString()}
          </span>
        </div>
        <div className="stat-item">
          <span className="label">
            <span role="img" aria-label="chart">📈</span> Net Profit
          </span>
          <span className={`value ${netProfit >= 0 ? 'profit' : 'loss'}`}>
            {netProfit >= 0 ? '+$' : '-$'}{Math.abs(netProfit).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BotCard; 