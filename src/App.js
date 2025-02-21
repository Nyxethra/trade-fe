import React from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ProfitChart from './components/ProfitChart';
import BotCard from './components/BotCard';

const botsData = [
  {
    id: 1,
    name: 'Bot Alpha',
    type: 'Trend Following',
    colorName: 'Emerald',
    performance: 5,
    trades: 120,
    winRate: '65%'
  },
  {
    id: 2,
    name: 'Bot Beta',
    type: 'Mean Reversion',
    colorName: 'Ruby',
    performance: -2,
    trades: 85,
    winRate: '48%'
  },
  {
    id: 3,
    name: 'Bot Gamma',
    type: 'Breakout Trading',
    colorName: 'Sapphire',
    performance: 3.5,
    trades: 95,
    winRate: '58%'
  },
  {
    id: 4,
    name: 'Bot Delta',
    type: 'Scalping',
    colorName: 'Amber',
    performance: -1.5,
    trades: 150,
    winRate: '52%'
  }
];

function App() {
  return (
    <div className="App">
      <TopBar />
      <div className="content">
        <h1>Trading Bots Performance</h1>
        <p className="subtitle">Real-time performance analysis of trading bots</p>
        <div className="dashboard-container">
          <div className="chart-section">
            <ProfitChart />
          </div>
          <div className="bots-list">
            {botsData.map(bot => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
