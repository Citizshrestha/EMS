import React from 'react';
import Header from '@frontend/components/common/Header';
import StatsCard from '@frontend/components/dashboard/StatsCard';
import ChartSection from '@frontend/components/dashboard/ChartSection';
import CreateTask from './CreateTask';

const AdminDashboard = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="p-6 flex-1 overflow-y-auto ">
        <StatsCard />
        <div className="grid h-[70px] grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ChartSection />
          <CreateTask />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;