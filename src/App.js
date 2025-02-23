import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ProfitChart from './components/ProfitChart';
import BotCard from './components/BotCard';
import StatsSummary from './components/StatsSummary';
import WeeklyStatsSummary from './components/WeeklyStatsSummary';
import QuickOverview from './components/QuickOverview';
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
    performance: bot.daily_stats[0].profit_percent,
    net_profit: bot.daily_stats[0].net_profit,
    balance: bot.daily_stats[0].balance
  }));

  const yesterdayStats = botsData.map(bot => ({
    name: bot.name,
    performance: bot.daily_stats[1].profit_percent,
    net_profit: bot.daily_stats[1].net_profit,
    balance: bot.daily_stats[1].balance
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

  // Calculate trading volume (total balance)
  const tradingVolume = todayStats.reduce((sum, bot) => sum + bot.balance, 0);
  const formattedVolume = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(tradingVolume);

  // Determine market sentiment
  const marketSentiment = profitableBotsToday > botsData.length / 2 ? "Bullish" : "Bearish";

  // Get alerts based on performance
  const alerts = [
    topPerformer.performance > 5 ? 
      `🔥 ${topPerformer.name} vừa đạt lợi nhuận ${topPerformer.performance}% trong 24h qua` : null,
    profitableBotsToday > profitableBotsYesterday ?
      `📈 Số lượng bot có lợi nhuận tăng ${profitableBotsChange} so với hôm qua` : null,
    bottomPerformer.performance < -5 ?
      `⚠️ ${bottomPerformer.name} đang giảm ${Math.abs(bottomPerformer.performance)}% trong 24h qua` : null
  ].filter(Boolean);

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

  // Prepare weekly data
  const weeklyData = Array.from({ length: 7 }).map((_, index) => ({
    date: botsData[0].daily_stats[index].date,
    bots: botsData.map(bot => ({
      name: bot.name,
      performance: bot.daily_stats[index].profit_percent
    }))
  }));

  // Calculate weekly metrics for each bot
  const weeklyBotsData = botsData.map(bot => {
    const weeklyStats = bot.daily_stats.slice(0, 7);
    
    // Calculate average daily performance
    const avgPerformance = (weeklyStats.reduce((sum, day) => sum + day.profit_percent, 0) / 7).toFixed(1);
    const avgWinRate = (weeklyStats.reduce((sum, day) => sum + day.winrate, 0) / 7).toFixed(2);
    const totalNetProfit = weeklyStats.reduce((sum, day) => sum + day.net_profit, 0);
    
    return {
      id: bot.name,
      name: bot.name,
      performance: avgPerformance,
      winRate: `${avgWinRate}%`,
      balance: weeklyStats[0].balance,
      netProfit: totalNetProfit
    };
  });

  // Calculate weekly summary metrics
  const weeklyNetProfit = botsData.reduce((sum, bot) => {
    const weeklyStats = bot.daily_stats.slice(0, 7);
    return sum + weeklyStats.reduce((daySum, day) => daySum + day.net_profit, 0);
  }, 0);
  
  const topWeeklyPerformer = weeklyBotsData.reduce((best, current) => 
    parseFloat(current.performance) > parseFloat(best.performance) ? current : best
  );
  const bottomWeeklyPerformer = weeklyBotsData.reduce((worst, current) => 
    parseFloat(current.performance) < parseFloat(worst.performance) ? current : worst
  );

  // Calculate average profitable bots per day
  const profitableBotsPerDay = weeklyData.map(day => 
    day.bots.filter(bot => bot.performance > 0).length
  );
  const avgProfitableBotsPerDay = Math.round(
    profitableBotsPerDay.reduce((sum, count) => sum + count, 0) / 7
  );

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="App">
      <TopBar />
      <div className="content">
        <div className="main-boxes">
          <div className="dashboard-header">
            <h1>Bot Performance Monitor</h1>
            <p>Track • Analyze • Optimize</p>
          </div>
          <div className="dashboard-section">
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
                  type="daily"
                />
              </div>
              <div className="bots-list">
                {latestBotsData.map((bot, index) => (
                  <BotCard 
                    key={bot.id} 
                    bot={bot} 
                    index={index}
                    isHighlighted={hoveredBot === bot.name}
                    type="daily"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="dashboard-section">
            <div className="header-section">
              <div>
                <h1>Weekly Performance Analysis</h1>
                <p className="subtitle">
                  Last 7 days overview • {new Date(weeklyData[6].date).toLocaleDateString('vi-VN')} - {new Date(weeklyData[0].date).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <WeeklyStatsSummary 
                weeklyNetProfit={weeklyNetProfit}
                topPerformer={topWeeklyPerformer.name}
                topPerformanceValue={topWeeklyPerformer.performance}
                bottomPerformer={bottomWeeklyPerformer.name}
                bottomPerformanceValue={bottomWeeklyPerformer.performance}
                profitableBots={avgProfitableBotsPerDay}
                totalBots={botsData.length}
              />
            </div>
            <div className="dashboard-container">
              <div className="chart-section">
                <ProfitChart 
                  botsData={weeklyBotsData} 
                  onBotHover={setHoveredBot}
                  type="weekly"
                />
              </div>
              <div className="bots-list">
                {weeklyBotsData.map((bot, index) => (
                  <BotCard 
                    key={bot.id} 
                    bot={bot} 
                    index={index}
                    isHighlighted={hoveredBot === bot.name}
                    type="weekly"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
