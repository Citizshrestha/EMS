import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {FiHome,FiLogOut, FiBarChart2, FiSettings, FiUsers } from 'react-icons/fi'
import { supabase } from '../../services/supabaseClient';

const Sidebar = () => {
     const navigate = useNavigate();
    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut();

        if (error){
            console.error("Logout error: ",error.message)
            alert('Logout failed: ' + error.message);
        } else{
            console.log("Logout Successfully")
            navigate('/')
        }

    }
  return (
    <div className='w-64 bg-[#60A5FA] text-white flex flex-col p-4'>
        {/* Logo */}
        <div className="mb-8">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=40&h=40&fit=crop"
          alt="Logo"
          className="w-10 h-10 rounded-md" 
          />
        </div>

        {/* Navigation */}
         <nav className="flex-1">
            <ul className="space-y-4">
                <li>
                    <Link to="/admin-dashboard"
                    className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded">
                        <FiHome />
                        <span>Dashboard</span>
                    </Link>
                   
                </li>
                <li>
                <Link to="/employee-dashboard"
                    className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded">
                        <FiUsers />
                        <span>Employees</span>
                    </Link>
                </li>

                <li>
                <Link to="/reports"
                    className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded">
                        <FiBarChart2 />
                        <span>Reports</span>
                    </Link>
                </li>

                <li>
                <Link to="/settings"
                    className="flex items-center space-x-2 hover:bg-blue-400 p-2 rounded">
                        <FiSettings />
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>
         </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
        className='mt-auto flex items-center space-x-2 bg-[#da5c5c] p-2 rounded hover:bg-red-500'>
            <FiLogOut />
            <span>Logout</span>
        </button>


    </div>
  )
}

export default Sidebar;
