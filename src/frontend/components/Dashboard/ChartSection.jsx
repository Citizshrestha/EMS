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
    <div className="bg-teal-700 h-[600px] p-4 rounded-lg shadow ">
      <h3 className="text-lg text-white font-semibold mb-4">Employee Activity</h3>
      <div className=" w-full h-[500px] py-3 bg-red-100 flex flex-col items-center justify-center">
        <Line data={data} options={{ maintainAspectRatio: false }} />
        <p className="text-black ">Chart Placeholder (e.g., Line Chart)</p>
      </div>
    </div>
  );
};
export default ChartSection;