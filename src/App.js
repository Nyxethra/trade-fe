import React from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ProfitChart from './components/ProfitChart';
import BotCard from './components/BotCard';

// Tạo dữ liệu mẫu cho 30 bot
const generateBotsData = () => {
  const strategies = [
    'Trend Following', 'Mean Reversion', 'Breakout Trading', 'Scalping',
    'Grid Trading', 'Arbitrage', 'Market Making', 'Momentum Trading',
    'Statistical Arbitrage', 'Pattern Recognition'
  ];

  const colors = [
    { name: 'Emerald', code: '#10b981' },
    { name: 'Ruby', code: '#ef4444' },
    { name: 'Sapphire', code: '#3b82f6' },
    { name: 'Amber', code: '#f59e0b' },
    { name: 'Violet', code: '#8b5cf6' },
    { name: 'Cyan', code: '#06b6d4' },
    { name: 'Rose', code: '#f43f5e' },
    { name: 'Lime', code: '#84cc16' },
    { name: 'Indigo', code: '#6366f1' },
    { name: 'Orange', code: '#f97316' }
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const strategyIndex = i % strategies.length;
    const colorIndex = i % colors.length;
    const performance = (Math.random() * 14 - 7).toFixed(1); // Random từ -7% đến +7%
    const trades = Math.floor(Math.random() * (200 - 50) + 50); // Random từ 50-200 trades
    const winRate = (Math.random() * (70 - 45) + 45).toFixed(1); // Random từ 45-70%

    return {
      id: i + 1,
      name: `Bot ${String.fromCharCode(65 + i)}`, // A, B, C, ...
      type: strategies[strategyIndex],
      colorName: colors[colorIndex].name,
      colorCode: colors[colorIndex].code,
      performance: Number(performance),
      trades: trades,
      winRate: `${winRate}%`,
      description: `${strategies[strategyIndex]} strategy with custom parameters`
    };
  });
};

const botsData = generateBotsData();

function App() {
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalProfit = botsData.reduce((sum, bot) => sum + (bot.performance > 0 ? bot.performance : 0), 0).toFixed(1);
  const totalLoss = Math.abs(botsData.reduce((sum, bot) => sum + (bot.performance < 0 ? bot.performance : 0), 0)).toFixed(1);
  const avgWinRate = (botsData.reduce((sum, bot) => sum + parseFloat(bot.winRate), 0) / botsData.length).toFixed(1);
  const profitableBots = botsData.filter(bot => bot.performance > 0).length;

  return (
    <div className="App">
      <TopBar />
      <div className="content">
        <div className="main-boxes">
          <div className="box">
            <div className="header-section">
              <div>
                <h1>Trading Bots Performance</h1>
                <p className="subtitle">
                  Daily performance analysis • {date}
                </p>
              </div>
              <div className="stats-summary">
                <div className="summary-item profit">
                  <span className="summary-value">+{totalProfit}%</span>
                  <span className="summary-label">Total Profit</span>
                </div>
                <div className="summary-item loss">
                  <span className="summary-value">-{totalLoss}%</span>
                  <span className="summary-label">Total Loss</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">{avgWinRate}%</span>
                  <span className="summary-label">Avg Win Rate</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">{profitableBots}/30</span>
                  <span className="summary-label">Profitable Bots</span>
                </div>
              </div>
            </div>
            <div className="dashboard-container">
              <div className="chart-section">
                <ProfitChart botsData={botsData} />
              </div>
              <div className="bots-list">
                {botsData.map(bot => (
                  <BotCard key={bot.id} bot={bot} />
                ))}
              </div>
            </div>
          </div>
          <div className="box box-empty">
            Box 2 - Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
