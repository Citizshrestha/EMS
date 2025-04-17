import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { useState, useEffect } from "react";
import { supabase } from "../../../backend/services/supabaseClient";
import { toast } from "react-toastify";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ChartSection = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        // fetch completed task
        const { count: completedCount, error: completedError } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed");

        if (completedError) {
          throw new Error(
            `Error  fetching completed tasks ${completedError.message}`
          );
        }

        // fetch pending and failed task
        const { count: pendingCount, error: pendingError } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .in("status", ["Pending", "Failed"]);

        if (pendingError) {
          throw new Error(
            `Error fetching pending tasks ${pendingError.message}`
          );
        }

        // fetch total tasks
        const { count: totalCount, error: totalError } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true });

        if (totalError)
          throw new Error(`Error fetching pending tasks ${totalError.message}`);

        const labels = ["Completed Tasks", "Pending Tasks", "Total Tasks"];
        const data = [completedCount || 0, pendingCount || 0, totalCount || 0];

        setChartData({
          labels,
          datasets: [
            {
              label: "Task Statistics",
              data,
              borderColor: "#60A5FA",
              backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
              fill: true,
            },
          ],
        });
      } catch (error) {
        toast.error(`Error fetching task data ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  return (
    <div className="bg-teal-700 h-[600px] p-4 rounded-lg shadow ">
      <h3 className="text-xl text-white text-center font-semibold mb-4">
        {chartData ? chartData.datasets[0].label : 'Loading...'}
      </h3>
      <div className=" w-full h-[500px] py-3 bg-red-100 flex flex-col items-center justify-center">
        {loading ? (
          <p className="text-gray-500">Loading Chart data...</p>
        ) : chartData ? (
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
};
export default ChartSection;
