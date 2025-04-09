import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../../backend/services/supabaseClient';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, role, name, email')
          .neq('role', 'admin');

        console.log('Raw data from Supabase:', data); // More detailed logging

        if (error) {
          throw error;
        }

        // More comprehensive filtering
        const validEmployees = (data || []).filter(emp => 
          emp && 
          emp.id && 
          typeof emp.id === 'string' && 
          emp.name && 
          typeof emp.name === 'string' &&
          emp.name.trim() !== ''
        );

        console.log('Filtered employees:', validEmployees); // Log filtered results
        setEmployees(validEmployees);
      } catch (error) {
        setError('Failed to fetch employees: ' + error.message);
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle Delete Action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }

        console.log("Successfully deleted employee with ID: ", id);
        setEmployees(prev => prev.filter(employee => employee.id !== id));
      } catch (err) {
        console.error("Error deleting employee", err);
        alert('Failed to delete employee: ' + err.message);
      }
    }
  };

  // ... keep your handleEdit and handleAddEmployee functions the same ...

  if (loading) {
    return <div className="p-4">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // More reliable empty state check
  const shouldShowEmptyState = !employees || 
                             employees.length === 0 || 
                             employees.every(e => !e?.id);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Employee List</h3>
        <button 
          className="bg-[#FF6B6B] text-white px-4 py-2 rounded hover:bg-red-500"
        >
          Add Employee
        </button>
      </div>
      
      {shouldShowEmptyState ? (
        <p className="text-gray-500">No Employees Found</p>
      ) : (
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
                  <button 
                    className="text-[#60A5FA] hover:text-blue-700"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="text-[#FF6B6B] hover:text-red-700"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;