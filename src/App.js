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

  // Get today's and yesterday's stats
  const todayStats = botsData.map(bot => ({
    name: bot.name,
    performance: bot.daily_stats[0].profit_percent
  }));

  const yesterdayStats = botsData.map(bot => ({
    name: bot.name,
    performance: bot.daily_stats[1].profit_percent
  }));

  // Calculate today's metrics
  const todayNetProfit = todayStats.reduce((sum, bot) => sum + bot.performance, 0).toFixed(1);
  const yesterdayNetProfit = yesterdayStats.reduce((sum, bot) => sum + bot.performance, 0).toFixed(1);
  const netProfitChange = (todayNetProfit - yesterdayNetProfit).toFixed(1);

  // Find top and bottom performers
  const topPerformer = todayStats.reduce((best, current) => 
    current.performance > best.performance ? current : best
  );

  const bottomPerformer = todayStats.reduce((worst, current) => 
    current.performance < worst.performance ? current : worst
  );

  // Calculate profitable bots
  const profitableBotsToday = todayStats.filter(bot => bot.performance > 0).length;
  const profitableBotsYesterday = yesterdayStats.filter(bot => bot.performance > 0).length;
  const profitableBotsChange = profitableBotsToday - profitableBotsYesterday;

  // Latest data for bot cards
  const latestBotsData = botsData.map(bot => {
    const latestStats = bot.daily_stats[0];
    return {
      id: bot.name,
      name: bot.name,
      performance: latestStats.profit_percent,
      winRate: `${latestStats.winrate}%`,
      balance: latestStats.balance,
      netProfit: latestStats.net_profit
    };
  });

  return (
    <div className="App">
      <TopBar />
      <div className="content">
        <div className="main-boxes">
          <div className="box">
            <div className="header-section">
              <div>
                <h1>Daily Trading Summary</h1>
                <p className="subtitle">
                  Performance overview • {date}
                </p>
              </div>
              <StatsSummary 
                todayNetProfit={todayNetProfit}
                todayNetProfitChange={netProfitChange}
                topPerformer={topPerformer.name}
                topPerformanceValue={topPerformer.performance.toFixed(1)}
                bottomPerformer={bottomPerformer.name}
                bottomPerformanceValue={bottomPerformer.performance.toFixed(1)}
                profitableBots={profitableBotsToday}
                totalBots={botsData.length}
                profitableBotsChange={profitableBotsChange}
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
