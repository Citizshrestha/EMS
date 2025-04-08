import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const EmployeeList = () => {
  const employees = [
    { id: 1, name: 'John Doe', role: 'Developer', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', role: 'Designer', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', role: 'Manager', email: 'bob@example.com' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Employee List</h3>
        <button className="bg-[#FF6B6B] text-white px-4 py-2 rounded hover:bg-red-500">
          Add Employee
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b">
              <td className="p-2">{employee.name}</td>
              <td className="p-2">{employee.role}</td>
              <td className="p-2">{employee.email}</td>
              <td className="p-2 flex space-x-2">
                <button className="text-[#60A5FA] hover:text-blue-700">
                  <FiEdit />
                </button>
                <button className="text-[#FF6B6B] hover:text-red-700">
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;