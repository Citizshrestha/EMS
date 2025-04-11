
import Sidebar from '@frontend/components/common/Sidebar';
import Header from '@frontend/components/common/Header';



const AdminDashboard = () => {
  


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
             
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;