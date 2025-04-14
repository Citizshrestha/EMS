import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  supabase,
  supabaseAdmin,
} from "@backend/services/supabaseClient";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    role: "employee",
    name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null); 
  const [newRole, setNewRole] = useState(""); 

  // Fetch employees on component mount 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const { data, dataFetchError } = await supabase
          .from("profiles")
          .select("id, role, name, email")
          .neq("role", "admin");

        console.log("Raw data from Supabase:", data);

        if (dataFetchError) {
          throw dataFetchError;
        }

        const validEmployees = (data || []).filter(
          (emp) =>
            emp &&
            emp.id &&
            typeof emp.id === "string" &&
            emp.name &&
            typeof emp.name === "string" &&
            emp.name.trim() !== "" &&
            emp.role !== "admin"
            
        );

        console.log("Filtered employees:", validEmployees);
        setEmployees(validEmployees);
      } catch (error) {
        setError("Failed to fetch employees: " + error.message);
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle deleting an employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const { error } = await supabase.from("profiles").delete().eq("id", id);

        if (error) {
          throw error;
        }

        console.log("Successfully deleted employee with ID: ", id);
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("id, role, name, email")
          .neq("role", "admin");

        if (fetchError) {
          throw fetchError;
        }
        setEmployees(data || []);
      } catch (err) {
        console.error("Error deleting employee", err);
        alert("Failed to delete employee: " + err.message);
      }
    }
  };

  // Open the modal for adding a new employee
  const handleAddEmployee = () => {
    setFormData({
      id: null,
      role: "",
      name: "",
      email: "",
      password: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing employee
  const handleEdit = (emp) => {
    setFormData({
      id: emp.id,
      role: emp.role,
      name: emp.name,
      email: emp.email,
      password: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle inline role editing
  const handleEditRole = (employee) => {
    setEditingRoleId(employee.id);
    setNewRole(employee.role); 
  };

  const handleSaveRole = async (id) => {
    if (!newRole.trim()) {
      alert("Role cannot be empty");
      return;
    }

    try {
     
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update({ role: newRole.trim() })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating role:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("No rows updated: Employee not found or update failed");
      }

      if (data.length > 1) {
        throw new Error("Multiple rows updated: Expected exactly one row");
      }

      console.log("Role updated successfully:", data[0]);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, role: newRole.trim() } : emp
        )
      );
      setEditingRoleId(null);
      setNewRole("");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role: " + err.message);
    }
  };

  // Handle form submission for adding  or editing an employee
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Name and Email are required");
      return;
    }

    if (!formData.role.trim()) {
      setFormError("Role is required");
      return;
    }

    // Validate password for  new employees (not required when editing)
    if (!formData.id && !formData.password) {
      setFormError("Password is required for new employees");
      return;
    }

    // Basic password  validation
    if (!formData.id && formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return;
    }

    try {
      if (formData.id) {
        // Edit existing employee
        console.log("Updating employee with ID:", formData.id);

        // Verify the employee exists in the profiles table
        const { data: existingEmployee, error: fetchError } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("id", formData.id);

        if (fetchError) {
          console.error("Error checking employee existence:", fetchError);
          throw fetchError;
        }

        if (!existingEmployee || existingEmployee.length === 0) {
          throw new Error("Employee not found in profiles table");
        }

        // Get the authenticated user's session to check their role
        const { data: { user }, error: userError, } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching authenticated user:", userError);
          throw userError;
        }

        console.log("Authenticated user:", user);

        const oldEmail = existingEmployee[0].email;
        const emailChanged = oldEmail !== formData.email;

        if (emailChanged) {
          const { data: authData, error: authError } =
            await supabaseAdmin.auth.admin.updateUserById(formData.id, {
              email: formData.email,
            });

          if (authError) {
            console.error("Error updating email in auth.users:", authError);
            throw authError;
          }
          console.log("Email updated in auth.users:", authData);
        }

        // Perform the update using supabaseAdmin to bypass RLS
        const { data, error } = await supabaseAdmin
          .from("profiles")
          .update({
            name: formData.name,
            role: formData.role,
            email: formData.email,
          })
          .eq("id", formData.id)
          .select();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          throw new Error(
            "No rows updated: Employee not found or update failed"
          );
        }

        if (data.length > 1) {
          throw new Error("Multiple rows updated: Expected exactly one row");
        }

        const updatedEmployee = data[0];
        console.log("Update successful, data:", updatedEmployee);
        // Update the employees state with edited data
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === formData.id
              ? {
                  ...emp,
                  name: formData.name,
                  role: formData.role,
                  email: formData.email,
                }
              : emp
          )
        );

        if (emailChanged) {
          setFormError(
            "Email updated successfully. The user may need to confirm their new email before logging in."
          );
        }
      } else {
        // Add new employee
        // Create a new user in auth.users with the provided password
        const { data: userData, error: userError } = await supabase.auth.signUp(
          {
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: "http://your-app-url/login",
            },
          }
        );

        if (userError) {
          console.error("User creation error:", userError);
          throw userError;
        }

        if (!userData.user) {
          throw new Error("User creation failed: No user data returned");
        }

        const newUserId = userData.user.id;
        console.log("New user created with ID:", newUserId);
        console.log("New user data:", userData);

        // Auto-confirm the email using supabaseAdmin
        const { data: confirmData, error: confirmError } =
          await supabaseAdmin.auth.admin.updateUserById(newUserId, {
            email_confirmed_at: new Date().toISOString(),
          });

        if (confirmError) {
          console.error("Error confirming email:", confirmError);
          throw confirmError;
        }

        console.log("Email confirmed for new user:", confirmData);

        // Insert the new employee into the profiles table
        const { data: insertedData, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: newUserId,
            name: formData.name,
            role: formData.role,
            email: formData.email,
          })
          .select();

        if (insertError) {
          console.error("Profile insert error:", insertError);
          throw insertError;
        }

        if (!insertedData || insertedData.length === 0) {
          throw new Error("No rows inserted: Insert operation failed");
        }

        if (insertedData.length > 1) {
          throw new Error("Multiple rows inserted: Expected exactly one row");
        }

        const newUser = insertedData[0];
        console.log("Profile insert successful, data:", newUser);

        setEmployees((prev) => [...prev, newUser]);
        console.log("Successfully added new employee: ", newUser);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving employee:", err);
      setFormError("Failed to save employee: " + err.message);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null); 
  };

  // Handle inline role input change
  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  // Cancel inline role editing
  const handleCancelRoleEdit = () => {
    setEditingRoleId(null);
    setNewRole("");
  };

  // Loading and error states
  if (loading) {
    return <div className="p-4">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const shouldShowEmptyState =
    !employees || employees.length === 0 || employees.every((e) => !e?.id);

  return (
    <div className=" min-h-[100vh] w-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Employee List</h3>
        <button
          onClick={handleAddEmployee}
          className="bg-[#FF6B6B] text-white px-4 py-2 rounded hover:bg-red-500"
        >
          Add Employee
        </button>
      </div>

      {shouldShowEmptyState ? (
        <p className="text-gray-500">No Employees Found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border-r border-gray-300">Name</th>
              <th className="p-2 text-left border-r border-gray-300">Role</th>
              <th className="p-2 text-left border-r border-gray-300">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b">
                <td className="p-2 border-r border-gray-300">
                  {employee.name}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {editingRoleId === employee.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newRole}
                        onChange={handleRoleChange}
                        className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                        placeholder="Enter new role"
                      />
                 
                      <button
                        onClick={() => handleSaveRole(employee.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelRoleEdit}
                        className="text-red-500 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{employee.role}</span>
                      <button
                        onClick={() => handleEditRole(employee)}
                        className="text-[#60A5FA] hover:text-blue-700"
                      >
                        <FiEdit size={16} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {employee.email}
                </td>
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(employee)}
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

      {/* Modal for adding/editing employees */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {formData.id ? "Edit Employee" : "Add Employee"}
            </h3>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                  required
                />
              </div>
              {/* Password field for new employees */}
              {!formData.id && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
               
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                  placeholder="Enter role (e.g., CEO, Designer, Developer)"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#60A5FA] text-white rounded hover:bg-blue-600"
                >
                  {formData.id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
