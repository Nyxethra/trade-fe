import React from 'react';

function BotCard({ bot }) {
  const { name, type, colorName, performance, trades, winRate } = bot;
  const isProfit = performance >= 0;

  return (
    <div className={`bot-card ${isProfit ? 'profit' : 'loss'}`}>
      <div className="bot-name">{name} ({colorName})</div>
      <div className="bot-type">{type}</div>
      <div className="bot-stats">
        <div>
          <div className={`stat-value ${isProfit ? 'profit' : 'loss'}`}>
            {isProfit ? '+' : ''}{performance}%
          </div>
          <div className="stat-label">Performance</div>
        </div>
        <div>
          <div className="stat-value">{trades}</div>
          <div className="stat-label">Total Trades</div>
        </div>
        <div>
          <div className="stat-value">{winRate}</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>
    </div>
  );
}

export default BotCard; 