import React from 'react';
import './App.css';
import TopBar from './components/TopBar';

function App() {
  return (
    <div className="App">
      <TopBar />
      <div className="content">
        <h1>Welcome to Trade FE</h1>
        <p>Your awesome trading platform</p>
      </div>
    </div>
  );
}

export default App;
