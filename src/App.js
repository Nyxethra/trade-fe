import React from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ProfitChart from './components/ProfitChart';

function App() {
  return (
    <div className="App">
      <TopBar />
      <div className="content">
        <h1>Trading Bots Performance</h1>
        <div className="chart-container">
          <ProfitChart />
        </div>
      </div>
    </div>
  );
}

export default App;
