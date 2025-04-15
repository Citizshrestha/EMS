import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ChartSection = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [5, 10, 15, 20, 25],
        borderColor: '#60A5FA',
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow min-h-[1000px]">
      <h3 className="text-lg font-semibold mb-4">Employee Activity</h3>
      <div className="h-full w-full min-h-[500px] bg-gray-200 flex items-center justify-center">
        <Line data={data} options={{ maintainAspectRatio: false }} />
        <p className="text-gray-500">Chart Placeholder (e.g., Line Chart)</p>
      </div>
    </div>
  );
};
export default ChartSection;