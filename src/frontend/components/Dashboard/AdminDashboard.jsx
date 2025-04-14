import React from 'react';
import Sidebar from '@frontend/components/common/Sidebar';
import Header from '@frontend/components/common/Header';
import StatsCard from '@frontend/components/dashboard/StatsCard';
import ChartSection from '@frontend/components/dashboard/ChartSection';
import CreateTask from './CreateTask';

const AdminDashboard = () => {
  return (

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          <StatsCard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ChartSection />
            <CreateTask/>
          </div>
        </main>
      </div>
  );
};

export default AdminDashboard;