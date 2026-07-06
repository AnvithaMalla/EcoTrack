import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export const LineChart = ({ labels, datasets, options = {} }) => {
  const data = { labels, datasets };
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, labels: { usePointStyle: true } } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(148,163,184,0.16)' } },
    },
  };
  return <Line data={data} options={{ ...defaultOptions, ...options }} />;
};
