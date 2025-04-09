// import React from 'react'

import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import StatsCard from "../Dashboard/StatsCard";
import ChartSection from "./ChartSection";
import EmployeeList from "../Employees/EmployeeList";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar/>

    {/* Main Content */}
        <div className="flex-1 flex flex-col">
           <Header/>

           {/*  Main content area */}
           <main className="p-6">
              <StatsCard/>
              <div className="grid grids-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <ChartSection/>
                 <EmployeeList/>
              </div>
           </main>
        </div>
    </div>

   
  )
}

export default AdminDashboard;
