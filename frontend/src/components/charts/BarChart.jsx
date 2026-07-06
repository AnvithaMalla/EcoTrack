import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const BarChart = ({ labels, datasets, options = {} }) => {
  const data = { labels, datasets };
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, grid: { color: 'rgba(148,163,184,0.16)' } },
    },
  };
  return <Bar data={data} options={{ ...defaultOptions, ...options }} />;
};
