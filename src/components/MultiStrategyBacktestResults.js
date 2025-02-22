import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './MultiStrategyBacktestResults.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'http://localhost:3001';

const BotCard = ({ name, type, performance, totalTrades, winRate }) => {
  const isProfit = parseFloat(performance) >= 0;

  return (
    <div className={`bot-card ${isProfit ? 'profit' : 'loss'}`}>
      <div className="bot-name">
        {name}
      </div>
      <div className="bot-type">
        {type}
      </div>
      <div className="bot-stats">
        <div className="stat-item">
          <div className={`stat-value ${isProfit ? 'profit' : 'loss'}`}>
            {performance}%
          </div>
          <div className="stat-label">Lợi nhuận</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalTrades}</div>
          <div className="stat-label">Tổng giao dịch</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{winRate}%</div>
          <div className="stat-label">Tỷ lệ thắng</div>
        </div>
      </div>
    </div>
  );
};

const MultiStrategyBacktestResults = () => {
  const [backtestData, setBacktestData] = useState({});
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isStatsVisible, setIsStatsVisible] = useState(true);

  useEffect(() => {
    const loadBacktestData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy danh sách các file JSON
        const response = await fetch(`${API_URL}/api/data`);
        if (!response.ok) throw new Error('Failed to fetch data files');
        const files = await response.json();

        const strategyData = {};
        const strategyNames = [];

        // Lấy nội dung của từng file
        for (const file of files) {
          try {
            const response = await fetch(`${API_URL}/api/data/${file}`);
            if (!response.ok) throw new Error(`Failed to fetch data for ${file}`);
            const data = await response.json();
            const strategyName = Object.keys(data.backtest_result.strategy)[0];

            strategyData[strategyName] = {
              ...data.backtest_result.strategy[strategyName],
              metadata: data.backtest_result.metadata[strategyName]
            };
            strategyNames.push(strategyName);
          } catch (error) {
            console.error(`Error loading data for ${file}:`, error);
          }
        }

        setBacktestData(strategyData);
        setStrategies(strategyNames);
        if (strategyNames.length > 0) {
          setSelectedStrategy(strategyNames[0]);
        }
      } catch (error) {
        console.error('Error loading backtest data:', error);
        setError('Failed to load backtest data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBacktestData();
  }, []);

  const calculateStats = (strategy) => {
    if (!strategy) return {};

    const trades = strategy.trades || [];
    const totalTrades = trades.length;
    const winningTrades = trades.filter(trade => trade.profit_ratio > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(2) : 0;

    // Tính tổng lợi nhuận từ profit_abs thay vì profit_ratio
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit_abs, 0).toFixed(2);

    // Tính toán thêm các chỉ số khác
    const averageProfit = totalTrades > 0 ? (totalProfit / totalTrades).toFixed(2) : 0;
    const maxDrawdown = strategy.max_drawdown_abs || 0;
    const averageDuration = strategy.duration_avg || "N/A";

    return {
      totalTrades,
      winningTrades,
      winRate,
      totalProfit,
      averageProfit,
      maxDrawdown,
      averageDuration
    };
  };

  const calculateProfitInRange = (trades, startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Lọc giao dịch trong khoảng thời gian
    const tradesInRange = trades.filter(trade => {
      const tradeDate = new Date(trade.close_date);
      return tradeDate >= start && tradeDate <= end;
    });

    // Tính tổng lợi nhuận và số lệnh
    const totalProfit = tradesInRange.reduce((sum, trade) => sum + trade.profit_ratio * 100, 0);
    const numberOfTrades = tradesInRange.length;

    // Tính tỷ lệ win
    const winningTrades = tradesInRange.filter(trade => trade.profit_ratio > 0).length;
    const winRate = numberOfTrades > 0 ? (winningTrades / numberOfTrades * 100) : 0;

    // Tính trung bình lợi nhuận trên mỗi lệnh
    const averageProfit = numberOfTrades > 0 ? totalProfit / numberOfTrades : 0;

    return {
      averageProfit: averageProfit.toFixed(2),
      numberOfTrades,
      winRate: winRate.toFixed(2)
    };
  };

  const formatChartData = (strategy) => {
    if (!strategy) return null;

    // Lấy dữ liệu theo timeframe đã chọn
    const periodicData = strategy.periodic_breakdown?.[selectedTimeframe] || [];

    // Chuyển đổi dữ liệu theo định dạng phù hợp
    const profitData = periodicData.map(item => ({
      date: item.date,
      profit: item.profit_abs || 0
    }));

    // Tính lợi nhuận tích lũy
    let cumulativeProfit = 0;
    const cumulativeData = profitData.map(item => {
      cumulativeProfit += item.profit;
      return {
        date: item.date,
        profit: cumulativeProfit
      };
    });

    return {
      labels: cumulativeData.map(item => item.date),
      datasets: [
        {
          label: 'Lợi nhuận tích lũy',
          data: cumulativeData.map(item => item.profit),
          type: 'line',
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.4,
          yAxisID: 'y',
          pointRadius: 2,
          pointHoverRadius: 5
        },
        {
          label: `Lợi nhuận ${selectedTimeframe === 'day' ? 'hàng ngày' : 'hàng tháng'}`,
          data: profitData.map(item => item.profit),
          type: 'bar',
          backgroundColor: (context) => {
            const value = context.raw;
            return value >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)';
          },
          borderColor: (context) => {
            const value = context.raw;
            return value >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)';
          },
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const renderTradeHistory = (strategy) => {
    if (!strategy || !strategy.trades) return null;

    const sortedTrades = [...strategy.trades].sort((a, b) =>
      new Date(b.close_date) - new Date(a.close_date)
    );

    return (
      <div className="trade-history">
        <h3>Lịch sử giao dịch</h3>
        <div className="trade-table-container">
          <table className="trade-table">
            <thead>
              <tr>
                <th>Thời gian mở</th>
                <th>Thời gian đóng</th>
                <th>Loại</th>
                <th>Giá mở</th>
                <th>Giá đóng</th>
                <th>Lợi nhuận (%)</th>
                <th>Lợi nhuận (USDT)</th>
                <th>Lý do đóng</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade, index) => (
                <tr key={index} className={trade.profit_ratio > 0 ? 'profit' : 'loss'}>
                  <td>{new Date(trade.open_date).toLocaleString()}</td>
                  <td>{new Date(trade.close_date).toLocaleString()}</td>
                  <td>{trade.is_short ? 'Short' : 'Long'}</td>
                  <td>{trade.open_rate.toFixed(2)}</td>
                  <td>{trade.close_rate.toFixed(2)}</td>
                  <td>{(trade.profit_ratio * 100).toFixed(2)}%</td>
                  <td>{trade.profit_abs.toFixed(2)}</td>
                  <td>{trade.exit_reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const formatComparisonChartData = () => {
    const colors = [
      'rgb(75, 192, 192)',   // Xanh lá
      'rgb(255, 99, 132)',   // Đỏ
      'rgb(255, 205, 86)',   // Vàng
      'rgb(54, 162, 235)',   // Xanh dương
      'rgb(153, 102, 255)',  // Tím
      'rgb(255, 159, 64)'    // Cam
    ];

    const data = {
      labels: strategies,
      datasets: [{
        label: dateRange.startDate && dateRange.endDate
          ? 'Lợi nhuận trung bình mỗi lệnh (%)'
          : 'Tổng lợi nhuận (%)',
        data: strategies.map(strategy => {
          if (dateRange.startDate && dateRange.endDate) {
            const result = calculateProfitInRange(
              backtestData[strategy]?.trades || [],
              dateRange.startDate,
              dateRange.endDate
            );
            return result.averageProfit;
          } else {
            const profitTotal = backtestData[strategy]?.profit_total || 0;
            return (profitTotal * 100).toFixed(2);
          }
        }),
        backgroundColor: colors.slice(0, strategies.length),
        borderColor: colors.slice(0, strategies.length),
        borderWidth: 1
      }]
    };

    // Thêm dataset hiển thị số lệnh và tỷ lệ win khi có chọn khoảng thời gian
    if (dateRange.startDate && dateRange.endDate) {
      // Dataset số lệnh
      data.datasets.push({
        label: 'Số lệnh giao dịch',
        data: strategies.map(strategy => {
          const result = calculateProfitInRange(
            backtestData[strategy]?.trades || [],
            dateRange.startDate,
            dateRange.endDate
          );
          return result.numberOfTrades;
        }),
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
        yAxisID: 'y1'
      });

      // Dataset tỷ lệ win
      data.datasets.push({
        label: 'Tỷ lệ Win (%)',
        data: strategies.map(strategy => {
          const result = calculateProfitInRange(
            backtestData[strategy]?.trades || [],
            dateRange.startDate,
            dateRange.endDate
          );
          return result.winRate;
        }),
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 1,
        yAxisID: 'y2'
      });
    }

    return data;
  };

  const calculateOverallStats = () => {
    const overallStats = {
      totalProfit: 0,
      totalTrades: 0,
      winningTrades: 0,
      totalProfitAbs: 0,
      maxDrawdown: 0
    };

    strategies.forEach(strategy => {
      const data = backtestData[strategy];
      const trades = data?.trades || [];

      // Tổng số giao dịch
      overallStats.totalTrades += trades.length;

      // Số giao dịch thắng
      overallStats.winningTrades += trades.filter(trade => trade.profit_ratio > 0).length;

      // Tổng lợi nhuận theo %
      overallStats.totalProfit += (data?.profit_total || 0) * 100;

      // Tổng lợi nhuận theo USDT
      overallStats.totalProfitAbs += trades.reduce((sum, trade) => sum + trade.profit_abs, 0);

      // Max drawdown
      overallStats.maxDrawdown += Math.abs(data?.max_drawdown_abs || 0);
    });

    // Tính các chỉ số trung bình
    const avgWinRate = overallStats.totalTrades > 0
      ? (overallStats.winningTrades / overallStats.totalTrades * 100).toFixed(2)
      : 0;

    const avgProfitPerTrade = overallStats.totalTrades > 0
      ? (overallStats.totalProfitAbs / overallStats.totalTrades).toFixed(2)
      : 0;

    return {
      ...overallStats,
      avgWinRate,
      avgProfitPerTrade,
      totalProfit: overallStats.totalProfit.toFixed(2),
      totalProfitAbs: overallStats.totalProfitAbs.toFixed(2),
      maxDrawdown: overallStats.maxDrawdown.toFixed(2)
    };
  };

  // Render bot cards
  const renderBotCards = () => {
    return strategies.map(strategy => {
      const data = backtestData[strategy];
      const stats = calculateStats(data);
      const profitTotal = data?.profit_total || 0;

      return (
        <BotCard
          key={strategy}
          name={strategy}
          type={data?.metadata?.strategy_type || "Trend Following"}
          performance={(profitTotal * 100).toFixed(2)}
          totalTrades={stats.totalTrades}
          winRate={stats.winRate}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  const stats = selectedStrategy ? calculateStats(backtestData[selectedStrategy]) : {};
  const chartData = selectedStrategy ? formatChartData(backtestData[selectedStrategy]) : null;

  return (
    <div className="backtest-results">
      <div className={`overall-stats ${isStatsVisible ? 'visible' : 'hidden'}`}>
        <div className="stats-header">
          <h2>Thống kê hệ thống</h2>
          <button
            className="toggle-stats-btn"
            onClick={() => setIsStatsVisible(!isStatsVisible)}
            title={isStatsVisible ? "Ẩn thống kê" : "Hiện thống kê"}
          >
            →
          </button>
        </div>
        <div className="stats-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Bot hoạt động</div>
              <div className="stat-value">{strategies.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Tổng lợi nhuận</div>
              <div>

                <div className={`stat-subtitle ${parseFloat(calculateOverallStats().totalProfitAbs) >= 0 ? 'profit' : 'loss'}`}>
                  {parseFloat(calculateOverallStats().totalProfitAbs) >= 0 ? '+' : ''}{calculateOverallStats().totalProfitAbs} USDT
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Tổng giao dịch</div>
              <div className="stat-value">{calculateOverallStats().totalTrades}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Tỷ lệ thắng TB</div>
              <div className="stat-value">{calculateOverallStats().avgWinRate}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Lợi nhuận/Giao dịch</div>
              <div className={`stat-value ${parseFloat(calculateOverallStats().avgProfitPerTrade) >= 0 ? 'profit' : 'loss'}`}>
                {parseFloat(calculateOverallStats().avgProfitPerTrade) >= 0 ? '+' : ''}{calculateOverallStats().avgProfitPerTrade} USDT
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Tổng Drawdown</div>
              <div className="stat-value loss">-{calculateOverallStats().maxDrawdown} USDT</div>
            </div>
          </div>
        </div>
      </div>

      <div className="comparison-section">
        <div className="comparison-chart">
          <h2>So sánh lợi nhuận các Bot</h2>
          <div className="date-range-selector">
            <div className="date-input">
              <label>Từ ngày:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  startDate: e.target.value
                }))}
              />
            </div>
            <div className="date-input">
              <label>Đến ngày:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  endDate: e.target.value
                }))}
              />
            </div>
          </div>
          <div className="chart-container">
            <Bar
              data={formatComparisonChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  },
                  title: {
                    display: true,
                    text: dateRange.startDate && dateRange.endDate
                      ? 'So sánh hiệu suất Bot trong khoảng thời gian'
                      : 'Tổng lợi nhuận (%)'
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        if (context.dataset.yAxisID === 'y1') {
                          return `${context.dataset.label}: ${context.parsed.y} lệnh`;
                        }
                        if (context.dataset.yAxisID === 'y2') {
                          return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Lợi nhuận (%)'
                    },
                    grid: {
                      color: (context) => context.tick.value === 0 ? '#000000' : '#e2e8f0',
                      lineWidth: (context) => context.tick.value === 0 ? 2 : 1
                    }
                  },
                  y1: dateRange.startDate && dateRange.endDate ? {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Số lệnh'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  } : null,
                  y2: dateRange.startDate && dateRange.endDate ? {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Tỷ lệ Win (%)',
                      color: 'rgb(52, 211, 153)'
                    },
                    grid: {
                      drawOnChartArea: false
                    },
                    ticks: {
                      color: 'rgb(52, 211, 153)'
                    }
                  } : null
                }
              }}
            />
          </div>
        </div>
        <div className="bots-list">
          {renderBotCards()}
        </div>
      </div>

      <div className="strategy-selector">
        <label htmlFor="strategy-select">Chọn chiến lược:</label>
        <select
          id="strategy-select"
          value={selectedStrategy || ''}
          onChange={(e) => setSelectedStrategy(e.target.value)}
        >
          {strategies.map(strategy => (
            <option key={strategy} value={strategy}>{strategy}</option>
          ))}
        </select>
      </div>

      {selectedStrategy && (
        <>
          <div className="strategy-info">
            <h2>{selectedStrategy}</h2>
            <p>Timeframe: {backtestData[selectedStrategy]?.metadata?.timeframe}</p>
            <p>Thời gian backtest: {
              new Date(backtestData[selectedStrategy]?.metadata?.backtest_start_ts * 1000).toLocaleDateString()
            } - {
                new Date(backtestData[selectedStrategy]?.metadata?.backtest_end_ts * 1000).toLocaleDateString()
              }</p>
          </div>

          <div className="stats-container">
            <div className="stat-box">
              <h3>Tổng số giao dịch</h3>
              <p>{stats.totalTrades}</p>
            </div>
            <div className="stat-box">
              <h3>Giao dịch thắng</h3>
              <p>{stats.winningTrades}</p>
            </div>
            <div className="stat-box">
              <h3>Tỷ lệ thắng</h3>
              <p>{stats.winRate}%</p>
            </div>
            <div className="stat-box">
              <h3>Tổng lợi nhuận</h3>
              <p>{stats.totalProfit} USDT</p>
            </div>
            <div className="stat-box">
              <h3>Lợi nhuận trung bình</h3>
              <p>{stats.averageProfit} USDT</p>
            </div>
            <div className="stat-box">
              <h3>Drawdown tối đa</h3>
              <p>{stats.maxDrawdown} USDT</p>
            </div>
            <div className="stat-box">
              <h3>Thời gian giao dịch TB</h3>
              <p>{stats.averageDuration}</p>
            </div>
          </div>

          <div className="timeframe-selector">
            <label>
              <input
                type="radio"
                value="day"
                checked={selectedTimeframe === 'day'}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              />
              Theo ngày
            </label>
            <label>
              <input
                type="radio"
                value="month"
                checked={selectedTimeframe === 'month'}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              />
              Theo tháng
            </label>
          </div>

          {chartData && (
            <div className="chart-container">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Biểu đồ lợi nhuận theo thời gian'
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)} USDT`
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Thời gian'
                      },
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Lợi nhuận tích lũy (USDT)'
                      },
                      grid: {
                        color: (context) => context.tick.value === 0 ? '#000000' : '#e2e8f0',
                        lineWidth: (context) => context.tick.value === 0 ? 2 : 1
                      },
                      beginAtZero: true
                    },
                    y1: {
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Lợi nhuận theo kỳ (USDT)'
                      },
                      grid: {
                        drawOnChartArea: false
                      },
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          )}

          {renderTradeHistory(backtestData[selectedStrategy])}
        </>
      )}
    </div>
  );
};

export default MultiStrategyBacktestResults; 