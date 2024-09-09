
import { useState, useEffect } from 'react';

const BacktestRunner = () => {
  const [strategies, setStrategies] = useState<string[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      const response = await fetch('/api/strategies');
      const data = await response.json();
      setStrategies(data);
    };
    fetchStrategies();
  }, []);

  const handleRunBacktest = async () => {
    if (!selectedStrategy) return;
    // Logic to run the selected strategy for backtesting
    console.log(`Running backtest for strategy: ${selectedStrategy}`);
  };

  return (
    <div>
      <h1>Backtest Strategy Runner</h1>
      <select onChange={(e) => setSelectedStrategy(e.target.value)} value={selectedStrategy || ''}>
        <option value="" disabled>Select a strategy</option>
        {strategies.map((strategy) => (
          <option key={strategy} value={strategy}>{strategy}</option>
        ))}
      </select>
      <button onClick={handleRunBacktest} disabled={!selectedStrategy}>
        Run Backtest
      </button>
    </div>
  );
};

export default BacktestRunner;
