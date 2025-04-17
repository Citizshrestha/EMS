import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi"; // Import close icon

const EmpProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  if (!employee) {
    return <div className="p-4 text-center text-gray-600">No employee data available.</div>;
  }

  const { avatarurl, name, role, email } = employee;

  const handleClose = () => {
    if (role === 'admin'){
      navigate('/employees')
    } else {
      navigate('/employee-dashboard')
    }
  };

  return (
    <div className="relative max-w-md mt-40 mx-auto bg-gradient-to-br from-gray-100 to-gray-300 shadow-xl rounded-lg overflow-hidden">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2 shadow-md"
        aria-label="Close"
      >
        <FiX size={20} />
      </button>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-40 flex items-center justify-center">
        <img
          src={avatarurl || "https://via.placeholder.com/150"}
          alt={`${name}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* Profile Details */}
      <div className="p-6 bg-white rounded-b-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{name}</h2>
        <p className="text-center text-gray-500 text-sm">{role}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between border-b py-2">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-800">{email}</span>
          </div>
          <div className="flex items-center justify-between border-b py-2">
            <span className="text-gray-600 font-medium">Role:</span>
            <span className="text-gray-800">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;