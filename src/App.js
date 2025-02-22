import React from 'react';
import MultiStrategyBacktestResults from './components/MultiStrategyBacktestResults';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Phân tích hiệu suất Bot giao dịch</h1>
      </header>
      <main className="app-main">
        <MultiStrategyBacktestResults />
      </main>
    </div>
  );
}

export default App;
