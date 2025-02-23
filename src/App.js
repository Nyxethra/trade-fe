import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ProfitChart from './components/ProfitChart';
import BotCard from './components/BotCard';
import StatsSummary from './components/StatsSummary';
import { botsData } from './mocks/botsData';

function App() {
  const [hoveredBot, setHoveredBot] = useState(null);
  
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Lấy thông tin từ ngày mới nhất của mỗi bot
  const latestBotsData = botsData.map(bot => {
    const latestStats = bot.daily_stats[0]; // Giả sử daily_stats được sắp xếp mới nhất đầu tiên
    return {
      id: bot.name,
      name: bot.name,
      performance: latestStats.profit_percent,
      winRate: `${latestStats.winrate}%`,
      balance: latestStats.balance,
      netProfit: latestStats.net_profit
    };
  });

  const totalProfit = latestBotsData.reduce((sum, bot) => sum + (bot.performance > 0 ? bot.performance : 0), 0).toFixed(1);
  const totalLoss = Math.abs(latestBotsData.reduce((sum, bot) => sum + (bot.performance < 0 ? bot.performance : 0), 0)).toFixed(1);
  const avgWinRate = (latestBotsData.reduce((sum, bot) => sum + parseFloat(bot.winRate), 0) / latestBotsData.length).toFixed(1);
  const profitableBots = latestBotsData.filter(bot => bot.performance > 0).length;

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
              <StatsSummary 
                totalProfit={totalProfit}
                totalLoss={totalLoss}
                avgWinRate={avgWinRate}
                profitableBots={`${profitableBots}/${latestBotsData.length}`}
              />
            </div>
            <div className="dashboard-container">
              <div className="chart-section">
                <ProfitChart 
                  botsData={latestBotsData} 
                  onBotHover={setHoveredBot}
                />
              </div>
              <div className="bots-list">
                {latestBotsData.map((bot, index) => (
                  <BotCard 
                    key={bot.id} 
                    bot={bot} 
                    index={index}
                    isHighlighted={hoveredBot === bot.name}
                  />
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
