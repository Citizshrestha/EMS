
import Header from '@frontend/components/common/Header';
import EmpStatsCard from '../Employees/EmpStatsCard';
import TaskList from '../Employees/TaskList';



const AdminDashboard = () => {
  


  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="mt-4">
          <EmpStatsCard/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
             <TaskList/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;