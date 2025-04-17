import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchUserProfile } from '../../utils/userProfile';
import { supabase } from '../../../backend/services/supabaseClient';

const EmpStatsCard = () => {
  const [loggedInEmp, setLoggedInEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [acceptedTaskCount, setAcceptedTaskCount] = useState(0);
  const [failedTaskCount, setFailedTaskCount] = useState(0);

  useEffect(() => {
    const fetchLoggedInEmp = async () => {
      try {
        const data = await fetchUserProfile();
        if (!data) {
          toast.error('Failed to fetch user profile');
          return;
        }
        setLoggedInEmp(data);
      } catch (err) {
        toast.error(err.message || 'Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };

    const fetchTaskCounts = async (empId) => {
      try {
        // Fetch "New Task" count (status: "Pending")
        const { count: newCount, error: newError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', empId)
          .eq('status', 'Pending');

        if (newError) {
          toast.error(newError.message);
          return;
        }
        setTaskCount(newCount);

        // Fetch "Completed Task" count (status: "Completed")
        const { count: completedCount, error: completedError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', empId)
          .eq('status', 'Completed');

        if (completedError) {
          toast.error(completedError.message);
          return;
        }
        setCompletedTaskCount(completedCount);

        // Fetch "Accepted Task" count (status: "Accepted")
        const { count: acceptedCount, error: acceptedError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', empId)
          .eq('status', 'Accepted');

        if (acceptedError) {
          toast.error(acceptedError.message);
          return;
        }
        setAcceptedTaskCount(acceptedCount);

        // Fetch "Failed Task" count (status: "Failed")
        const { count: failedCount, error: failedError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', empId)
          .eq('status', 'Failed');

        if (failedError) {
          toast.error(failedError.message);
          return;
        }
        setFailedTaskCount(failedCount);
      } catch (err) {
        toast.error(err.message || 'Error fetching task counts');
      }
    };

    const initialize = async () => {
      await fetchLoggedInEmp();
      if (loggedInEmp?.id) {
        await fetchTaskCounts(loggedInEmp.id);
      }
    };

    initialize();
  }, [loggedInEmp?.id]); 

  if (loading){
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-wrap space-x-8 gap-8">
      <div className="bg-red-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
        <h2 className="font-bold text-4xl mb-2">{taskCount}</h2>
        <span className="text-lg font-medium">New Task</span>
      </div>
      <div className="bg-emerald-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
        <h2 className="font-bold text-4xl mb-2">{completedTaskCount}</h2>
        <span className="text-lg font-medium">Completed Task</span>
      </div>
      <div className="bg-blue-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
        <h2 className="font-bold text-4xl mb-2">{acceptedTaskCount}</h2>
        <span className="text-lg font-medium">Accepted Task</span>
      </div>
      <div className="bg-yellow-500 h-32 w-64 text-white text-left px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
        <h2 className="font-bold text-4xl mb-2">{failedTaskCount}</h2>
        <span className="text-lg font-medium">Failed Task</span>
      </div>
    </div>
  );
};

export default EmpStatsCard;