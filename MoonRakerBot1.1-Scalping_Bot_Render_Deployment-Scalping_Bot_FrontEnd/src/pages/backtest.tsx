
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';  // Assuming a line chart is used based on previous setup

const Backtest = () => {
  const [strategies, setStrategies] = useState<string[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null); // Placeholder for the actual chart data format

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
    console.log(`Running backtest for strategy: ${selectedStrategy}`);

    // Assuming a function exists to fetch and set the chart data based on the selected strategy
    const chartResponse = await fetch(`/api/backtest?strategy=${selectedStrategy}`); // Example API endpoint for running backtest
    const result = await chartResponse.json();
    setChartData(result.chartData); // Adjust based on actual data structure
  };

  const chartOptions = {
    // Add chart options here to match existing functionality
    responsive: true,
    scales: {
      x: { type: 'linear', position: 'bottom' },
      y: { beginAtZero: true }
    }
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
      {chartData && <Line data={chartData} options={chartOptions} />}
    </div>
  );
};

export default Backtest;
