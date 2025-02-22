import React from 'react';
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
import { Line } from 'react-chartjs-2';

// Đăng ký các components cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProfitChart = ({ botsData, timeRange }) => {
  // Lọc dữ liệu theo khoảng thời gian
  const filterDataByTimeRange = (bot) => {
    const startDate = new Date(timeRange.startDate);
    const endDate = new Date(timeRange.endDate);
    
    return bot.dailyData.filter(day => {
      const date = new Date(day.timestamp);
      return date >= startDate && date <= endDate;
    });
  };

  // Tổng hợp dữ liệu của tất cả bot theo ngày
  const aggregateDataByDate = () => {
    const dateMap = new Map();

    botsData.forEach(bot => {
      const filteredData = filterDataByTimeRange(bot);
      filteredData.forEach(day => {
        const date = new Date(day.timestamp).toISOString().split('T')[0];
        if (!dateMap.has(date)) {
          dateMap.set(date, {
            totalPerformance: 0,
            count: 0
          });
        }
        const data = dateMap.get(date);
        data.totalPerformance += day.performance;
        data.count += 1;
      });
    });

    // Chuyển đổi Map thành mảng và sắp xếp theo ngày
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        averagePerformance: data.totalPerformance / data.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const aggregatedData = aggregateDataByDate();

  const data = {
    labels: aggregatedData.map(item => 
      new Date(item.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    ),
    datasets: [
      {
        label: 'Lợi nhuận trung bình',
        data: aggregatedData.map(item => item.averagePerformance),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
          label: (context) => `Lợi nhuận: ${context.parsed.y.toFixed(2)}%`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Thời gian'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Lợi nhuận (%)'
        },
        suggestedMin: -10,
        suggestedMax: 10
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default ProfitChart; 