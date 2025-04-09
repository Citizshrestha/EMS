import React from 'react';

const Header = () => {
  
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
        />
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">Admin User</p>
          <p className="text-sm text-gray-500">Admin</p>
        </div>
      </div>
    </header>
  );
};

export default Header;