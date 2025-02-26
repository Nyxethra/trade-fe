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
  const [selectedDate, setSelectedDate] = useState(new Date('2025-02-09')); // dùng ngày mặc định để review.

  // Format date for display
  const formattedDate = selectedDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle date navigation
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Get stats for selected date and previous day
  const getDateIndex = (date) => {
    return botsData[0].daily_stats.findIndex(stat =>
      new Date(stat.date).toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
  };

  const selectedDateIndex = getDateIndex(selectedDate);
  const yesterdayDate = new Date(selectedDate);
  yesterdayDate.setDate(selectedDate.getDate() - 1);
  const previousDateIndex = getDateIndex(yesterdayDate);

  // Get selected date and previous date stats
  const selectedDateStats = botsData.map(bot => ({
    name: bot.name,
    performance: bot.daily_stats[selectedDateIndex]?.profit_percent || 0,
    net_profit: bot.daily_stats[selectedDateIndex]?.net_profit || 0,
    balance: bot.daily_stats[selectedDateIndex]?.balance || 0
  }));

  const previousDateStats = botsData.map(bot => ({
    name: bot.name,
    performance: bot.daily_stats[previousDateIndex]?.profit_percent || 0,
    net_profit: bot.daily_stats[previousDateIndex]?.net_profit || 0,
    balance: bot.daily_stats[previousDateIndex]?.balance || 0
  }));

  // Calculate metrics for selected date
  const selectedNetProfit = selectedDateStats.reduce((sum, bot) => sum + bot.performance, 0).toFixed(1);
  const previousNetProfit = previousDateStats.reduce((sum, bot) => sum + bot.performance, 0).toFixed(1);
  const netProfitChange = (selectedNetProfit - previousNetProfit).toFixed(1);

  // Calculate today's net profit amount
  const todayNetProfitAmount = selectedDateStats.reduce((sum, bot) => sum + bot.net_profit, 0);

  // Find top and bottom performers
  const topPerformer = selectedDateStats.reduce((best, current) =>
    current.performance > best.performance ? current : best
  );

  const bottomPerformer = selectedDateStats.reduce((worst, current) =>
    current.performance < worst.performance ? current : worst
  );

  // Calculate profitable bots
  const profitableBotsToday = selectedDateStats.filter(bot => bot.performance > 0).length;
  const profitableBotsYesterday = previousDateStats.filter(bot => bot.performance > 0).length;
  const profitableBotsChange = profitableBotsToday - profitableBotsYesterday;

  // Calculate trading volume (total balance)
  const tradingVolume = selectedDateStats.reduce((sum, bot) => sum + bot.balance, 0);

  // Latest data for bot cards
  const latestBotsData = selectedDateStats.map(bot => ({
    id: bot.name,
    name: bot.name,
    performance: bot.performance,
    winRate: `${botsData.find(b => b.name === bot.name).daily_stats[selectedDateIndex]?.winrate || 0}%`,
    balance: bot.balance,
    netProfit: bot.net_profit
  }));

  // Prepare weekly data
  const weeklyData = Array.from({ length: 7 }).map((_, index) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(selectedDate.getDate() - index);
    
    return {
      date: currentDate.toISOString().split('T')[0],
      bots: botsData.map(bot => {
        const dailyStat = bot.daily_stats.find(stat => 
          new Date(stat.date).toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
        );
        return {
          name: bot.name,
          performance: dailyStat ? dailyStat.profit_percent : 0
        };
      })
    };
  });

  // Calculate weekly metrics for each bot
  const weeklyBotsData = botsData.map(bot => {
    const weeklyStats = weeklyData.map(day => {
      const botStat = day.bots.find(b => b.name === bot.name);
      const dailyStat = bot.daily_stats.find(stat => 
        new Date(stat.date).toISOString().split('T')[0] === day.date
      );
      return {
        profit_percent: botStat ? botStat.performance : 0,
        winrate: dailyStat ? dailyStat.winrate : 0,
        net_profit: dailyStat ? dailyStat.net_profit : 0,
        balance: dailyStat ? dailyStat.balance : 0
      };
    });

    // Calculate average daily performance
    const avgPerformance = (weeklyStats.reduce((sum, day) => sum + day.profit_percent, 0) / 7).toFixed(1);
    const avgWinRate = (weeklyStats.reduce((sum, day) => sum + day.winrate, 0) / 7).toFixed(2);
    const totalNetProfit = weeklyStats.reduce((sum, day) => sum + day.net_profit, 0);
    const avgBalance = Math.round(weeklyStats.reduce((sum, day) => sum + day.balance, 0) / 7);

    return {
      id: bot.name,
      name: bot.name,
      performance: avgPerformance,
      winRate: `${avgWinRate}%`,
      balance: weeklyStats[0].balance,
      avgBalance: avgBalance,
      netProfit: totalNetProfit
    };
  });

  // Calculate weekly summary metrics
  const weeklyNetProfit = weeklyBotsData.reduce((sum, bot) => sum + bot.netProfit, 0);

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

  // Calculate weekly total profit percent
  const weeklyTotalProfitPercent = weeklyBotsData.reduce((sum, bot) => 
    sum + parseFloat(bot.performance), 0).toFixed(2);

  // Prepare monthly data
  const monthlyData = Array.from({ length: 30 }).map((_, index) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(selectedDate.getDate() - index);
    
    return {
      date: currentDate.toISOString().split('T')[0],
      bots: botsData.map(bot => {
        const dailyStat = bot.daily_stats.find(stat => 
          new Date(stat.date).toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
        );
        return {
          name: bot.name,
          performance: dailyStat ? dailyStat.profit_percent : 0,
          net_profit: dailyStat ? dailyStat.net_profit : 0,
          balance: dailyStat ? dailyStat.balance : 0,
          winrate: dailyStat ? dailyStat.winrate : 0
        };
      })
    };
  });

  // Calculate monthly metrics for each bot
  const monthlyBotsData = botsData.map(bot => {
    const monthlyStats = monthlyData.map(day => {
      const botStat = day.bots.find(b => b.name === bot.name);
      return {
        profit_percent: botStat ? botStat.performance : 0,
        winrate: botStat ? botStat.winrate : 0,
        net_profit: botStat ? botStat.net_profit : 0,
        balance: botStat ? botStat.balance : 0
      };
    });

    // Calculate average daily performance for the month
    const avgPerformance = (monthlyStats.reduce((sum, day) => sum + day.profit_percent, 0) / monthlyStats.length).toFixed(1);
    const avgWinRate = (monthlyStats.reduce((sum, day) => sum + day.winrate, 0) / monthlyStats.length).toFixed(2);
    const totalNetProfit = monthlyStats.reduce((sum, day) => sum + day.net_profit, 0);
    const avgBalance = Math.round(monthlyStats.reduce((sum, day) => sum + day.balance, 0) / monthlyStats.length);

    return {
      id: bot.name,
      name: bot.name,
      performance: avgPerformance,
      winRate: `${avgWinRate}%`,
      balance: monthlyStats[0].balance,  // Balance hiện tại (ngày mới nhất)
      avgBalance: avgBalance,            // Balance trung bình của 30 ngày
      netProfit: totalNetProfit
    };
  });

  // Calculate monthly summary metrics
  const monthlyNetProfit = monthlyBotsData.reduce((sum, bot) => sum + bot.netProfit, 0);

  const topMonthlyPerformer = monthlyBotsData.reduce((best, current) =>
    parseFloat(current.performance) > parseFloat(best.performance) ? current : best
  );
  const bottomMonthlyPerformer = monthlyBotsData.reduce((worst, current) =>
    parseFloat(current.performance) < parseFloat(worst.performance) ? current : worst
  );

  // Calculate average profitable bots per day for the month
  const profitableBotsPerDayMonthly = monthlyData.map(day =>
    day.bots.filter(bot => bot.performance > 0).length
  );
  const avgProfitableBotsPerDayMonthly = Math.round(
    profitableBotsPerDayMonthly.reduce((sum, count) => sum + count, 0) / 30
  );

  // Calculate monthly total profit percent
  const monthlyTotalProfitPercent = monthlyBotsData.reduce((sum, bot) => 
    sum + parseFloat(bot.performance), 0).toFixed(2);

  return (
    <div className="App">
      <TopBar />
      <div className="content">
        <div className="main-boxes">
          <div className="dashboard-header">
            <h1>Bot Profit Monitor</h1>
            <p>Track • Analyze • Optimize</p>
          </div>
          <div className="dashboard-section">
            <div className="header-section">
              <div>
                <h1>Daily Trading Summary</h1>
                <div className="subtitle-with-controls">
                  <div className="subtitle">
                    Profit Overview •
                    <div className="date-controls">
                      <button
                        className="date-nav-btn"
                        onClick={() => changeDate(-1)}
                        title="Previous day"
                        disabled={selectedDate <= new Date('2025-01-28')}
                      >
                        ←
                      </button>
                      <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="date-picker"
                        min="2025-01-28"
                        max="2025-02-26"
                      />
                      <button
                        className="date-nav-btn"
                        onClick={() => changeDate(1)}
                        title="Next day"
                        disabled={selectedDate >= new Date('2025-02-26')}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <StatsSummary
                todayNetProfit={selectedNetProfit}
                todayNetProfitChange={netProfitChange}
                topPerformer={topPerformer.name}
                topPerformanceValue={topPerformer.performance.toFixed(1)}
                bottomPerformer={bottomPerformer.name}
                bottomPerformanceValue={bottomPerformer.performance.toFixed(1)}
                profitableBots={profitableBotsToday}
                totalBots={botsData.length}
                profitableBotsChange={profitableBotsChange}
                todayNetProfitAmount={todayNetProfitAmount}
              />
            </div>
            <div className="dashboard-container">
              <div className="chart-section">
                <ProfitChart
                  botsData={latestBotsData}
                  onBotHover={setHoveredBot}
                  type="daily"
                  weeklyData={weeklyData}
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
                    selectedDate={selectedDate.toISOString().split('T')[0]}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="dashboard-section">
            <div className="header-section">
              <div>
                <h1>Weekly Profit Analysis</h1>
                <p className="subtitle">
                  Last 7 days overview • {new Date(weeklyData[6].date).toLocaleDateString('en-US')} - {new Date(weeklyData[0].date).toLocaleDateString('en-US')}
                </p>
              </div>
              <WeeklyStatsSummary
                weeklyNetProfit={weeklyNetProfit}
                totalProfitPercent={weeklyTotalProfitPercent}
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
          <div className="dashboard-section">
            <div className="header-section">
              <div>
                <h1>Monthly Profit Analysis</h1>
                <p className="subtitle">
                  Last 30 days overview • {new Date(monthlyData[29].date).toLocaleDateString('en-US')} - {new Date(monthlyData[0].date).toLocaleDateString('en-US')}
                </p>
              </div>
              <WeeklyStatsSummary
                weeklyNetProfit={monthlyNetProfit}
                totalProfitPercent={monthlyTotalProfitPercent}
                topPerformer={topMonthlyPerformer.name}
                topPerformanceValue={topMonthlyPerformer.performance}
                bottomPerformer={bottomMonthlyPerformer.name}
                bottomPerformanceValue={bottomMonthlyPerformer.performance}
                profitableBots={avgProfitableBotsPerDayMonthly}
                totalBots={botsData.length}
              />
            </div>
            <div className="dashboard-container">
              <div className="chart-section">
                <ProfitChart
                  botsData={monthlyBotsData}
                  onBotHover={setHoveredBot}
                  type="monthly"
                />
              </div>
              <div className="bots-list">
                {monthlyBotsData.map((bot, index) => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    index={index}
                    isHighlighted={hoveredBot === bot.name}
                    type="monthly"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <QuickOverview botsData={botsData} />
    </div>
  );
}

export default App;
