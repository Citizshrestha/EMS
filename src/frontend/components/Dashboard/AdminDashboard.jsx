import React from 'react';
import Header from '@frontend/components/common/Header';
import StatsCard from '@frontend/components/dashboard/StatsCard';
import ChartSection from '@frontend/components/dashboard/ChartSection';
import CreateTask from './CreateTask';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col h-screen"> 
      <Header />
      <main className="flex-1 overflow-y-auto p-6"> 
        <StatsCard />
        <div className="mt-6">
          <ChartSection />
        </div>
        <div className="mt-6">
          <CreateTask />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
