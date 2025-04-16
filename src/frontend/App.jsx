import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import EmployeeList from './components/Employees/EmployeeList';
import Report from './components/Report';
import Setting from './components/Setting';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Layout from './components/common/Layout';

const App = () => {
  return (
    <BrowserRouter>
        <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />   {/* Add ToastContainer here */}
      <Routes>
        {/* Public login route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected routes with Sidebar layout */}
        <Route element={<Layout />}>
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute allowNonAdmin={true} allowedRoles={['admin']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute allowNonAdmin={true} allowedRoles={['admin']}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowNonAdmin={true} allowedRoles={['admin']}>
                <Setting />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;