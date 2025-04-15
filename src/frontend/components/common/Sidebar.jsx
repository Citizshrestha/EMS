// src/components/common/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiLogOut, FiBarChart2, FiSettings, FiUsers } from 'react-icons/fi';
import { auth } from '@backend/services/supabaseClient';
import { fetchUserProfile } from '@utils/userProfile';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = async () => {
      try {
        const { data: { user }, error: userError } = await auth.getUser();
        if (userError || !user) {
          navigate('/');
          return;
        }

        const data = await fetchUserProfile();
        if (data && data.role) {
          setUserRole(data.role);
          console.log('User role:', data.role);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    userData();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await auth.signOut();

    if (error) {
      console.error("Logout error: ", error.message);
      alert('Logout failed: ' + error.message);
    } else {
      console.log("Logout Successfully");
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="w-64 min-h-[100vh] bg-[#60A5FA] text-white flex flex-col p-4">
        <div className="mb-8">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=40&h=40&fit=crop"
            alt="Logo"
            className="w-10 h-10 rounded-md"
          />
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-64 min-h-[100vh] bg-[#60A5FA] text-white flex flex-col p-4">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=40&h=40&fit=crop"
          alt="Logo"
          className="w-10 h-10 rounded-md"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link
              to={userRole === 'admin' ? '/admin-dashboard' : '/employee-dashboard'}
              className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded"
              onClick={() => console.log('Navigating to Dashboard')}
            >
              <FiHome />
              <span>Dashboard</span>
            </Link>
          </li>

          {userRole === 'admin' ? (
            <li>
              <Link
                to="/employees"
                className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded"
                onClick={() => console.log('Navigating to Employees')}
              >
                <FiUsers />
                <span>Employees</span>
              </Link>
            </li>
          ) : (
            <span></span>
          )}

          <li>
            <Link
              to="/report"
              className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded"
              onClick={() => console.log('Navigating to Report')}
            >
              <FiBarChart2 />
              <span>Reports</span>
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded"
              onClick={() => console.log('Navigating to Settings')}
            >
              <FiSettings />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mb-8 flex items-center space-x-2 bg-red-400 p-2 rounded hover:bg-red-500"
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;