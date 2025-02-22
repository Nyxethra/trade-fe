import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeFrameSelector = ({ selectedTimeFrame, onTimeFrameChange }) => (
  <div className="timeframe-selector">
    <button 
      className={selectedTimeFrame === 'day' ? 'active' : ''} 
      onClick={() => onTimeFrameChange('day')}
    >
      Ngày
    </button>
    <button 
      className={selectedTimeFrame === 'week' ? 'active' : ''} 
      onClick={() => onTimeFrameChange('week')}
    >
      Tuần
    </button>
    <button 
      className={selectedTimeFrame === 'month' ? 'active' : ''} 
      onClick={() => onTimeFrameChange('month')}
    >
      Tháng
    </button>
  </div>
);

const BacktestResults = () => {
  const [backtestData, setBacktestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('day');
  const [selectedStrategy, setSelectedStrategy] = useState('BOT1BothAllPhaseStrategy');

  useEffect(() => {
    const fetchBacktestData = async () => {
      try {
        const response = await fetch(`/data/backtest-result-2025-02-21_18-41-59&strategy=${selectedStrategy}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Loaded data:", data);
        setBacktestData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(`Không thể tải dữ liệu backtest: ${err.message}`);
        setLoading(false);
      }
    };

    fetchBacktestData();
  }, [selectedStrategy]);

  const aggregateDataByTimeFrame = (data, frame) => {
    if (!data || !Array.isArray(data)) return [];

    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.time);
      let key;

      switch (frame) {
        case 'week':
          // Lấy ngày đầu tuần (Thứ 2)
          const dayOfWeek = date.getDay();
          const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          key = new Date(date.setDate(diff)).toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default: // day
          key = date.toISOString().split('T')[0];
      }

      if (!acc[key]) {
        acc[key] = {
          profits: [],
          trades: 0
        };
      }

      acc[key].profits.push(Number(item.profit) || 0);
      acc[key].trades++;

      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, data]) => ({
      date,
      averageProfit: data.profits.reduce((a, b) => a + b, 0) / data.profits.length,
      totalTrades: data.trades
    }));
  };

  const formatChartData = () => {
    if (!backtestData || !backtestData.data || !Array.isArray(backtestData.data)) {
      return {
        labels: [],
        datasets: [{
          label: 'Lợi nhuận trung bình',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    }

    const aggregatedData = aggregateDataByTimeFrame(backtestData.data, timeFrame);
    
    return {
      labels: aggregatedData.map(item => {
        const date = new Date(item.date);
        switch (timeFrame) {
          case 'week':
            return `Tuần ${Math.ceil(date.getDate() / 7)} - ${date.toLocaleDateString('vi-VN', { month: 'short' })}`;
          case 'month':
            return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
          default:
            return date.toLocaleDateString('vi-VN');
        }
      }),
      datasets: [
        {
          label: 'Lợi nhuận trung bình',
          data: aggregatedData.map(item => item.averageProfit),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  const calculateStats = () => {
    if (!backtestData || !backtestData.data || !Array.isArray(backtestData.data)) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        winRate: '0.00',
        totalProfit: '0.00',
        averageProfit: '0.00'
      };
    }

    const aggregatedData = aggregateDataByTimeFrame(backtestData.data, timeFrame);
    const totalTrades = aggregatedData.reduce((sum, item) => sum + item.totalTrades, 0);
    const averageProfit = aggregatedData.reduce((sum, item) => sum + item.averageProfit, 0) / aggregatedData.length;

    return {
      totalTrades,
      averageProfit: averageProfit.toFixed(2),
      timeFrameLabel: timeFrame === 'day' ? 'ngày' : timeFrame === 'week' ? 'tuần' : 'tháng'
    };
  };

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Đang tải dữ liệu backtest...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <p>🚫 {error}</p>
      <button onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  );

  const stats = calculateStats();

  return (
    <div className="backtest-results">
      <div className="controls">
        <TimeFrameSelector 
          selectedTimeFrame={timeFrame} 
          onTimeFrameChange={setTimeFrame}
        />
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <h3>Tổng số giao dịch</h3>
          <p>{stats.totalTrades}</p>
        </div>
        <div className="stat-box">
          <h3>Lợi nhuận trung bình/{stats.timeFrameLabel}</h3>
          <p>{stats.averageProfit}%</p>
        </div>
      </div>
      
      <div className="chart-container">
        <Line 
          data={formatChartData()} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: `Biểu đồ lợi nhuận trung bình theo ${stats.timeFrameLabel}`
              },
              tooltip: {
                callbacks: {
                  label: (context) => `Lợi nhuận: ${context.parsed.y.toFixed(2)}%`
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Thời gian'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Lợi nhuận (%)'
                }
              }
            }
          }} 
        />
      </div>
    </div>
  );
};

export default BacktestResults; 