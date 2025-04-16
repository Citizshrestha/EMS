import React from 'react';

const EmpStatsCard = () => {
  return (
    <div className="flex flex-wrap space-x-8 gap-8">
      <div
        className="bg-red-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <h2 className="font-bold text-5xl mb-2">1</h2>
        <span className="text-lg font-medium">New Task</span>
      </div>
      <div
        className="bg-emerald-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <h2 className="font-bold text-5xl mb-2">3</h2>
        <span className="text-lg font-medium">Completed Task</span>
      </div>
      <div
        className="bg-blue-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <h2 className="font-bold text-5xl mb-2">0</h2>
        <span className="text-lg font-medium">Accepted Task</span>
      </div>
      <div
        className="bg-yellow-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <h2 className="font-bold text-5xl mb-2">1</h2>
        <span className="text-lg font-medium">Failed Task</span>
      </div>
    </div>
  );
};

export default EmpStatsCard;