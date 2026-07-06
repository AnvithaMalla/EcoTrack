import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ labels, datasets, options = {} }) => {
  const data = { labels, datasets };
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: { legend: { display: false } },
  };
  return <Doughnut data={data} options={{ ...defaultOptions, ...options }} />;
};
