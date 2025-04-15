// src/components/protectedRoute/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchUserProfile } from '@utils/userProfile';

const ProtectedRoute = ({ children, allowedRoles=[],allowNonAdmin = false}) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await fetchUserProfile();
        if (data && data.role) {
          setUserRole(data.role);
          console.log('User role:', data.role, 'Allowed roles:', allowedRoles);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [allowedRoles,allowNonAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

   if (!userRole){
     return <Navigate to='/' replace />
   }
    
   const isRoleAllowed = allowedRoles.includes(userRole);

   const isNonAdminAllowed = allowNonAdmin && userRole!== 'admin';

   if (!isRoleAllowed && !isNonAdminAllowed) {
    console.log(`Access denied: User role ${userRole} not allowed`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;